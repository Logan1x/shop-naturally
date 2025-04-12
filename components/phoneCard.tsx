import React from "react";
import { Star, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PhoneCardProps {
  phone: {
    name: string;
    brand: string;
    storage: number;
    ram: number;
    price: number;
    reviews: number;
    ratingFloat: number;
    hasGFiveG?: boolean;
    bought?: number;
    productUrl?: string;
  };
  index: number;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone }) => {
  const handleCardClick = () => {
    if (phone.productUrl) {
      window.open(phone.productUrl, "_blank");
    }
  };

  return (
    <Card
      className="p-6 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden relative hover:scale-[1.02] group"
      onClick={handleCardClick}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{phone.name}</h3>
            <p className="text-sm text-muted-foreground">{phone.brand}</p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} fill="currentColor" strokeWidth={0} />
            <span className="font-medium">{phone.ratingFloat.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {typeof phone.ram === "number" && (
            <Badge
              variant="outline"
              className="bg-secondary border-0 rounded-md"
            >
              {phone.ram}GB
            </Badge>
          )}
          {typeof phone.storage === "number" && (
            <Badge
              variant="outline"
              className="bg-secondary border-0 rounded-md"
            >
              {phone.storage}GB
            </Badge>
          )}
          {phone.hasGFiveG && (
            <Badge
              variant="outline"
              className="bg-secondary border-0 rounded-md"
            >
              5G
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-end pt-4">
          <div className="text-xl font-bold">
            ₹{phone.price.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-muted-foreground">
            {phone.reviews} reviews
          </div>
        </div>

        {typeof phone.bought === "number" && (
          <div className="flex items-center mt-2 text-xs font-medium text-green-600 space-x-1">
            <ShoppingBag size={12} className="shrink-0" />
            <span>
              {phone.bought.toLocaleString("en-IN")} bought in past month
            </span>
          </div>
        )}
      </div>

      <div className="absolute bottom-2 right-2 text-muted-foreground opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
        <ArrowUpRight size={16} />
      </div>
    </Card>
  );
};

export default PhoneCard;
