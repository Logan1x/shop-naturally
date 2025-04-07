"use client";
import React from "react";
import ChatInput from "@/components/chatBox";
import LogoIcon from "@/components/LogoIcon";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col"
    >
      <header className="flex-none py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="rounded-lg w-10 h-10 border border-dashed flex items-center justify-center text-lg font-bold overflow-hidden">
              <LogoIcon />
            </span>
            <span className="font-medium text-lg">Shop Naturally</span>
          </div>
        </div>
      </header>

      <main className="relative grow flex flex-col pb-24 md:pb-0">
        <div
          className="
            fixed bottom-0 left-0 w-full p-4 bg-white
            md:static md:flex md:items-center md:justify-center md:p-0 md:bg-transparent
          "
        >
          <ChatInput />
        </div>
      </main>

      <footer className="mt-auto py-4 flex-none block z-50 relative md:static md:border md:border-dashed ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
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
    </motion.div>
  );
};

export default Index;
