"use client";

import React, { useState, useRef, useEffect } from "react";
// import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const PLACEHOLDER_TEXTS = [
  "show me phone under 20000 rupess with at least 8gb ram",
  "15000 me 256gb storage wale phone batao",
  "10000 में 4GB रैम वाले फोन बताओ",
];

const ChatInput: React.FC = () => {
  const [input, setInput] = useState("");
  //   const { sendMessage, isLoading } = useChat();
  const isLoading = false;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      //   sendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  // Cycle through placeholder texts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % PLACEHOLDER_TEXTS.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
