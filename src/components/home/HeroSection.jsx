import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[500px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/69be11296b316d6e33c5ff20/ea2a1f6b1_generated_aec69fad.png"
          alt="Soul food BBQ spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="font-body text-primary text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-4">
            Soul Food & BBQ Catering
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
            Smokin' Good
            <br />
            <span className="text-primary">Soul Food</span>
          </h1>
          <p className="font-body text-white/70 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
            Hand-crafted BBQ and soul food made from family recipes, slow-smoked
            to perfection. Let us cater your next event.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/menu">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold px-8 text-base"
              >
                View Our Menu <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-primary hover:bg-white/10 font-body font-semibold px-8 text-base"
              >
                Place an Order
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
