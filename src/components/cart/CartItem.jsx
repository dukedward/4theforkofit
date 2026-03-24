import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/50 last:border-0">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-base font-semibold text-foreground truncate">
          {item.name}
        </h4>
        <p className="font-body text-sm text-primary font-medium">
          ${item.price?.toFixed(2)} each
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="font-body text-sm font-medium w-6 text-center">
          {item.quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <p className="font-body text-sm font-semibold w-16 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={() => removeItem(item.menu_item_id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
