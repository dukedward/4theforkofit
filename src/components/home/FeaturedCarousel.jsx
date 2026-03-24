import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCart();

  const visibleCount =
    typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;
  const maxIndex = Math.max(0, items.length - visibleCount);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (items.length <= visibleCount) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, items.length, visibleCount]);

  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-primary text-sm font-semibold uppercase tracking-[0.15em] mb-2">
              Fan Favorites
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Featured Items
            </h2>
          </div>
          {items.length > visibleCount && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: `-${currentIndex * (100 / visibleCount + (visibleCount > 1 ? 2 : 0))}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-full md:w-[calc(33.333%-16px)]"
              >
                <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={
                        item.image_url ||
                        "https://media.base44.com/images/public/69be11296b316d6e33c5ff20/4e582a3bc_generated_58b4ba1a.png"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <span className="font-body text-primary font-bold text-lg">
                        ${item.price?.toFixed(2)}
                      </span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => addItem(item)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Navigation Dots */}
        {items.length > 1 && (
          <div className="flex md:hidden justify-center gap-2 mt-6">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-primary w-6" : "bg-border"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
