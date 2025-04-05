import React from "react";
import ChatInput from "@/components/chatBox";

const Index = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      <header className="flex-none py-6 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-primary text-white rounded-lg w-10 h-10 flex items-center justify-center text-lg font-bold">
              SN
            </span>
            <span className="font-medium text-lg">Shop Naturally</span>
          </div>
        </div>
      </header>

      <main className="relative grow flex flex-col">
        <ChatInput />
      </main>

      <footer className="mt-auto py-8 border-t border-slate-200 flex-none">
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
