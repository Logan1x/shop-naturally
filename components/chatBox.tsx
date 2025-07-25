"use client";
import React, { useState, useRef, useEffect } from "react";
import { WandSparklesIcon } from "./icons";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { PLACEHOLDER_TEXTS, LOADING_MESSAGES } from "@/static/constants";
import PhoneResults from "./phoneResults";

const ChatInput: React.FC = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [results, setResults] = useState<any[] | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [lastQuery, setLastQuery] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
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

      if (data.success === false && data.message) {
        setResults([]);
        setApiMessage(data.message);
        setShowChat(false);
      } else if (data.phones) {
        setResults(data.phones);
        setApiMessage(null);
        setShowChat(false);
      } else {
        setResults([]);
        setApiMessage(null);
        setShowChat(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setResults(null);
      setApiMessage("An error occurred. Please try again.");
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
    setApiMessage(null);
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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Cycle loading messages when loading
  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex(
        (prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col h-full">
      {showChat ? (
        <div className="mt-30 sm:mt-48 lg:mt-40 flex flex-col items-center justify-end h-full py-4">
          <div className="text-center px-4 animate-fade-in lg:scale-[1.1] mt-10">
            <h1 className="text-3xl font-semibold mb-6 tracking-tight">
              Tell us what you want in a phone
            </h1>
          </div>

          <div className="lg:scale-[1.05] max-w-3xl w-full mx-auto flex-1 flex flex-col justify-end">
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
                hidden: {},
              }}
            >
              {[
                "Best phones under ₹15,000",
                "phones with 64gb storage",
                "Top rated 5G phones",
                "Most reviewed phones under ₹20,000",
              ].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.3, ease: "easeOut" },
                    },
                  }}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-secondary-foreground transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>

            <form
              onSubmit={handleSubmit}
              className="relative w-full bg-white rounded-2xl shadow-sm border transition-all duration-300 ease-in-out mb-4"
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
                  style={{ minHeight: "120px" }}
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
          </div>
        </div>
      ) : (
        <PhoneResults
          results={results}
          query={lastQuery}
          onNewSearch={handleNewSearch}
          message={apiMessage}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center animate-pulse-slow">
            <WandSparklesIcon
              className="mx-auto text-primary mb-4"
              width={48}
              height={48}
            />
            <p className="text-lg font-medium">Searching phones...</p>
            <p className="text-muted-foreground">
              {LOADING_MESSAGES[loadingMessageIndex]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
