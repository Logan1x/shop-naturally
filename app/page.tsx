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
              P
            </span>
            <span className="font-medium text-lg">PhoneSearch</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Compare
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </a>
          </nav>
        </div>
      </header>

      <main className="relative grow">
        <ChatInput />
      </main>

      <footer className="mt-20 py-8 border-t border-slate-200 flex-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} PhoneSearch. All rights reserved. Find your
              perfect phone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
