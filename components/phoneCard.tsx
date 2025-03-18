import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface PhoneProps {
  phone: {
    id: string;
    main_url: string;
    price: string;
    technical_details: {
      Manufacturer: string;
      OS: string;
      RAM: string;
      Colour: string;
    };
    reviews: string;
    rating: string;
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
            {phone.technical_details.Manufacturer ? (
              <Badge
                variant="outline"
                className="mb-2 bg-primary/5 text-primary border-primary/20"
              >
                {phone.technical_details.Manufacturer}
              </Badge>
            ) : null}
            <h3 className="text-xl font-medium tracking-tight">
              <a
                href={phone.main_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-200"
              >
                {phone.technical_details.Manufacturer} {phone.id}
              </a>
            </h3>
          </div>
          <Badge className="text-lg font-medium bg-primary/10 text-primary hover:bg-primary/15 border-0">
            ₹{phone.price}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">OS:</span>
            <span className="font-medium">{phone.technical_details.OS}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">RAM:</span>
            <span className="font-medium">{phone.technical_details.RAM}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">
              {phone.technical_details.Colour}
            </span>
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
                      i < Math.round(parseFloat(phone.reviews))
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">
                {phone.reviews} ({phone.rating})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PhoneCard;
