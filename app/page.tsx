"use client";
import React from "react";
import ChatInput from "@/components/chatBox";
import { LogoIcon } from "@/components/icons";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="flex-none py-6 px-6 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="rounded-lg w-10 h-10 border border-dashed flex items-center justify-center text-lg font-bold overflow-hidden">
              <LogoIcon />
            </span>
            <span className="font-medium text-lg">Shop Naturally</span>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full flex flex-col"
        >
          <div className="w-full flex-grow flex flex-col">
            <ChatInput />
          </div>
        </motion.div>
      </main>

      <footer className="flex-none py-2 lg:py-4 z-10 lg:border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Got feedback?
              <a
                href="https://cal.com/khushal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Book a chat
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
