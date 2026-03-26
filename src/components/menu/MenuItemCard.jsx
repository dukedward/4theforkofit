import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import MenuItemModal from "./MenuItemModal";

export default function MenuItemCard({ item, index }) {
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => setShowModal(true)}
    >
      {item.image_url && (
        <div className="aspect-4/3 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {item.name}
          </h3>
          <span className="font-body text-primary font-bold text-lg whitespace-nowrap">
            ${item.price?.toFixed(2)}
          </span>
        </div>
        {item.description && (
          <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-4">
            {item.description}
          </p>
        )}
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            addItem(item);
          }}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body"
        >
          <Plus className="w-4 h-4 mr-1" /> Add to Cart
        </Button>
      </div>
      {showModal && (
        <MenuItemModal item={item} onClose={() => setShowModal(false)} />
      )}
    </motion.div>
  );
}
