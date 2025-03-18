"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { PLACEHOLDER_TEXTS } from "@/static/constants";

const ChatInput: React.FC<{
  conversationId: string;
  onMessageSent: () => void;
}> = ({
  conversationId,
  onMessageSent,
}: {
  conversationId: string;
  onMessageSent: () => void;
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      if (conversationId) {
        const { data } = await axios.post("/api/search", {
          message: input.trim(),
          conversationId,
        });

        if (data.success) {
          onMessageSent();
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPlaceholderIndex(
  //       (prevIndex) => (prevIndex + 1) % PLACEHOLDER_TEXTS.length
  //     );
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-4xl mx-auto bg-background/80 backdrop-blur-sm border border-border rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-md"
    >
      <div className="flex items-end w-full">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
          rows={3}
          className="flex-1 resize-none bg-transparent border-none focus:outline-none focus:ring-0 p-6 pr-14 max-h-[250px] text-base placeholder:text-muted-foreground/70"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-4 bottom-4 w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 transition-all"
          disabled={!input.trim() || isLoading}
        >
          <Send size={20} className="text-primary-foreground" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
