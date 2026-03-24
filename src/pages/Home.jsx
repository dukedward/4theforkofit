import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import AboutSection from "@/components/home/AboutSection";
import { listItems } from "../api/menuItem";

export default function Home() {
  const { data: featuredItems = [] } = useQuery({
    queryKey: ["featured-items"],
    queryFn: () => listItems.filter({ featured: true, available: true }),
  });

  return (
    <div>
      <HeroSection />
      <FeaturedCarousel items={featuredItems} />
      <AboutSection />
    </div>
  );
}
