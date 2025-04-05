"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Send, Search, Smartphone, Loader2 } from "lucide-react";
import { PLACEHOLDER_TEXTS } from "@/static/constants";
import PhoneResults from "./phoneResults";

const ChatInput: React.FC = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [results, setResults] = useState<any[] | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [lastQuery, setLastQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setLastQuery(query);
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/search", {
        message: query,
      });

      if (data.phones) {
        setResults(data.phones);
        setShowChat(false);
      } else {
        setResults([]);
        setShowChat(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewSearch = () => {
    setShowChat(true);
    setResults(null);
    setInput("");

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % PLACEHOLDER_TEXTS.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col h-full">
      {showChat && (
        <div className="text-center mb-8 animate-fade-in">
          <span className="inline-block mb-2 py-1 px-3 rounded-full text-sm font-medium bg-primary/10 text-primary">
            Phone Finder
          </span>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Find your perfect smartphone
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Tell us what you&#39;re looking for in a phone, and we&#39;ll search
            through thousands of options to find your perfect match.
          </p>
        </div>
      )}

      {/* Chat Input */}
      {showChat ? (
        <div
          className="max-w-3xl w-full mx-auto 
                   mb-4 justify-end 
                   flex-grow flex flex-col 
                   md:mb-auto md:justify-start"
        >
          <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
            <Search size={16} />
            <span>
              Try asking for specific features, price range, or brands
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative w-full bg-white rounded-2xl shadow-sm border transition-all duration-300 ease-in-out"
          >
            <div className="flex items-end w-full">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
                rows={1}
                className="flex-1 resize-none bg-transparent border-none focus:outline-none focus:ring-0 p-6 pr-14 max-h-[200px] text-base placeholder:text-muted-foreground/70 search-input"
                disabled={isLoading}
                autoFocus
                style={{ minHeight: "80px" }}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-4 bottom-4 w-10 h-10 rounded-full transition-all"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              "Budget phones under ₹15,000",
              "Best camera phone",
              "iPhone alternatives",
              "Gaming phones",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 rounded-full text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <PhoneResults
          results={results}
          query={lastQuery}
          onNewSearch={handleNewSearch}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center animate-pulse-slow">
            <Smartphone size={48} className="mx-auto text-primary mb-4" />
            <p className="text-lg font-medium">Searching phones...</p>
            <p className="text-muted-foreground">
              Finding the best matches for you
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
