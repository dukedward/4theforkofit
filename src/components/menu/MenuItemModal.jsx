import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CHICKEN_SIZES = [
  { size: "10pc", price: 15 },
  { size: "20pc", price: 26 },
  { size: "30pc", price: 37 },
];

export default function MenuItemModal({ item, onClose }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(CHICKEN_SIZES[0]);
  const hasSizes = item?.has_sizes;

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {item.image_url && (
          <div className="aspect-video w-full overflow-hidden shrink-0">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {item.name}
            </h2>
            <span className="font-body text-primary font-bold text-2xl whitespace-nowrap">
              $
              {hasSizes
                ? selectedSize.price.toFixed(2)
                : item.price?.toFixed(2)}
            </span>
          </div>

          {item.description && (
            <p className="font-body text-muted-foreground mb-6 leading-relaxed">
              {item.description}
            </p>
          )}

          {hasSizes && (
            <div className="mb-4">
              <label className="font-body text-sm font-medium text-foreground block mb-2">
                Amount
              </label>
              <div className="flex gap-2 flex-wrap">
                {CHICKEN_SIZES.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg border font-body text-sm font-medium transition-colors ${
                      selectedSize.size === s.size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary text-foreground"
                    }`}
                  >
                    {s.size} - ${s.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={() => {
              if (hasSizes) {
                addItem({
                  ...item,
                  selected_size: selectedSize.size,
                  price: selectedSize.price,
                  display_name: `${item.name} (${selectedSize.size})`,
                });
              } else {
                addItem(item);
              }
              onClose();
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold py-5"
          >
            <Plus className="w-4 h-4 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
