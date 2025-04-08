import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PhoneCard from "./phoneCard";
import { Button } from "@/components/ui/button";

interface PhoneResultsProps {
  results: any[] | null;
  query: string;
  onNewSearch: () => void;
}

const PhoneResults: React.FC<PhoneResultsProps> = ({
  results,
  query,
  onNewSearch,
}) => {
  if (!results) return null;

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 mt-8 rounded-2xl glass-card animate-fade-in">
        <Search size={48} className="text-muted-foreground mb-4 opacity-70" />
        <h3 className="text-xl font-medium mb-2">No matches found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn&apos;t find any phones matching your query:{" "}
          <span className="font-medium text-foreground">
            &quot;{query}&quot;
          </span>
        </p>
        <button
          onClick={onNewSearch}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors duration-200"
        >
          Try a new search
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-12rem)]">
      <div className="flex-grow">
        <div className="flex flex-col mb-6">
          <div className="mb-2">
            <Badge
              variant="outline"
              className="px-3 py-1 rounded-full bg-secondary text-muted-foreground border-0"
            >
              {results.length} results
            </Badge>
          </div>
          <h2 className="text-xl font-medium mb-2">
            Results for{" "}
            <span className="text-primary">&quot;{query}&quot;</span>
          </h2>
          <p className="text-muted-foreground">
            Select any phone to see more details
          </p>
        </div>

        <motion.div
          className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-24"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {results.map((phone, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <PhoneCard phone={phone} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* New search button - fixed at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 py-4 bg-gradient-to-t from-background to-background/90">
        <div className="container mx-auto flex justify-center">
          <Button
            onClick={onNewSearch}
            className="px-6 py-6 rounded-full shadow-lg flex items-center gap-2 bg-primary/90 hover:bg-primary"
            size="lg"
          >
            <Search size={18} />
            New search
          </Button>
        </div>
        <div className="text-center text-xs mt-3 text-gray-400">
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
    </div>
  );
};

export default PhoneResults;
