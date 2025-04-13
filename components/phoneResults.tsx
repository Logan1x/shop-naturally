import React from "react";
import { motion } from "framer-motion";
import { Search, IndianRupee, HardDrive, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PhoneCard from "./phoneCard";
import { Button } from "@/components/ui/button";

interface PhoneResultsProps {
  results: any[] | null;
  query: string;
  onNewSearch: () => void;
  message?: string;
}

const PhoneResults: React.FC<PhoneResultsProps> = ({
  results,
  query,
  onNewSearch,
  message,
}) => {
  const [sortField, setSortField] = React.useState<
    null | "price" | "storage" | "reviews"
  >(null);
  const [sortOrder, setSortOrder] = React.useState<null | "asc" | "desc">(null);

  if (!results) return null;

  // Sorting logic
  const getSortedResults = () => {
    if (!sortField || !sortOrder) return results;
    const sorted = [...results].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (typeof aValue !== "number") aValue = 0;
      if (typeof bValue !== "number") bValue = 0;
      if (sortOrder === "asc") return aValue - bValue;
      return bValue - aValue;
    });
    return sorted;
  };

  const sortedResults = getSortedResults();

  // Helper for cycling sort state
  const handleSortClick = (field: "price" | "storage" | "reviews") => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortField(null);
      setSortOrder(null);
    } else {
      setSortOrder("asc");
    }
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 mt-8 rounded-2xl glass-card animate-fade-in">
        <Search size={48} className="text-muted-foreground mb-4 opacity-70" />
        <h3 className="text-xl font-medium mb-2">No matches found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {message ? (
            <span>{message}</span>
          ) : (
            <>
              We couldn&apos;t find any phones matching your query:{" "}
              <span className="font-medium text-foreground">
                &quot;{query}&quot;
              </span>
            </>
          )}
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
              {sortedResults.length} results
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

        {/* Filter/Sort Bar */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Price Sort */}
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors
              ${
                sortField === "price"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-transparent hover:bg-primary/10"
              }
            `}
            onClick={() => handleSortClick("price")}
            type="button"
          >
            <IndianRupee size={16} className="mr-1" />
            <span className="text-sm">Price</span>
            {sortField === "price" && (
              <span className="ml-1 text-xs">
                {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
              </span>
            )}
          </button>
          {/* Storage Sort */}
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors
              ${
                sortField === "storage"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-transparent hover:bg-primary/10"
              }
            `}
            onClick={() => handleSortClick("storage")}
            type="button"
          >
            <HardDrive size={16} className="mr-1" />
            <span className="text-sm">Storage</span>
            {sortField === "storage" && (
              <span className="ml-1 text-xs">
                {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
              </span>
            )}
          </button>
          {/* Reviews Sort */}
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors
              ${
                sortField === "reviews"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-transparent hover:bg-primary/10"
              }
            `}
            onClick={() => handleSortClick("reviews")}
            type="button"
          >
            <Star size={16} className="mr-1" />
            <span className="text-sm">Reviews</span>
            {sortField === "reviews" && (
              <span className="ml-1 text-xs">
                {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
              </span>
            )}
          </button>
          {/* Clear Sort */}
          {sortField && sortOrder && (
            <button
              className="flex items-center gap-1 px-3 py-1 rounded-full border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              onClick={() => {
                setSortField(null);
                setSortOrder(null);
              }}
              type="button"
            >
              <span className="text-sm">Clear</span>
            </button>
          )}
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
          {sortedResults.map((phone, index) => (
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
