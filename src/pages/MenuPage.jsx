import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { motion } from "framer-motion";
import { listItems } from "../api/menuItem";

const CATEGORIES = [
  "All",
  "Entrees",
  "Sides",
  "Hand-crafted Sauces",
  "Beverages",
  "Breads & Specials",
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const {
    data: menuItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menu-items"],
    queryFn: () => listItems({ available: true }),
  });

  const filtered =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // console.log("Items error:", error);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary/30 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-primary text-sm font-semibold uppercase tracking-[0.15em] mb-2">
            Our Offerings
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Menu
          </h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Slow-smoked BBQ and soul food classics, all made fresh for your
            catering needs.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="bg-card border border-border/50 shadow-sm flex-wrap h-auto gap-1 p-1.5">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="font-body text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-4/3 rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground text-lg">
              No items in this category yet.
            </p>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((item, idx) => (
              <MenuItemCard key={item.id} item={item} index={idx} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
