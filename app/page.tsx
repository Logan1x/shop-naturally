"use client";
import React from "react";
import ChatInput from "@/components/chatBox";
import { LogoIcon } from "@/components/icons";
import { motion } from "framer-motion";
import Link from "next/link";

const Index = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="flex-none py-6 px-6 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <span className="rounded-lg w-10 h-10 border border-dashed flex items-center justify-center text-lg font-bold overflow-hidden">
              <LogoIcon />
            </span>
            <span className="font-medium text-lg">Shop Naturally</span>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full flex overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full flex flex-col"
        >
          <div className="w-full h-full flex flex-col">
            <ChatInput />
          </div>
        </motion.div>
      </main>

      <footer className="flex-none py-4  z-10 lg:border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Got feedback?
              <Link
                href="https://cal.com/khushal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Book a chat
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
