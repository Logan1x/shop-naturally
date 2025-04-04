import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface PhoneProps {
  phone: {
    _id: { $oid: string };
    fullName: string;
    name: string;
    brand: string;
    ram: string;
    storage: string;
    price: number;
    rating: string;
    reviews: string;
    bought: string;
    isInStock: boolean;
    productUrl: string;
  };
  index: number;
}

const PhoneCard: React.FC<PhoneProps> = ({ phone, index }) => {
  return (
    <Card
      className="phone-card animate-fade-in px-3 py-2"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <Badge
              variant="outline"
              className="mb-2 bg-primary/5 text-primary border-primary/20"
            >
              {phone.brand.toUpperCase()}
            </Badge>
            <h3 className="text-xl font-medium tracking-tight">
              <a
                href={phone.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-200"
              >
                {phone.name}
              </a>
            </h3>
          </div>
          <Badge className="text-lg font-medium bg-primary/10 text-primary hover:bg-primary/15 border-0">
            ₹{phone.price.toLocaleString()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">RAM:</span>
            <span className="font-medium">{phone.ram}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Storage:</span>
            <span className="font-medium">{phone.storage}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Bought:</span>
            <span className="font-medium">{phone.bought}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Rating:</span>
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.round(parseFloat(phone.rating))
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">
                {phone.rating} ({phone.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {!phone.isInStock && (
          <Badge className="text-xs bg-red-500 text-white">Out of Stock</Badge>
        )}
      </div>
    </Card>
  );
};

export default PhoneCard;
