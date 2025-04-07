import React from "react";
import ChatInput from "@/components/chatBox";
import { Carrot } from "lucide-react";

const Index = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      <header className="flex-none py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className=" rounded-lg w-10 h-10 border border-dashed flex items-center justify-center text-lg font-bold">
              <Carrot />
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

      <footer className="mt-auto py-8 flex-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} Shop Naturally. All rights reserved. Find your
              perfect smartphone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
