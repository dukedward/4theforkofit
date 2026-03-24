import React from "react";
import { Flame, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Flame,
    title: "Slow Smoked",
    description:
      "Our meats are smoked low and slow for up to 14 hours over real hardwood for maximum flavor.",
  },
  {
    icon: Heart,
    title: "Family Recipes",
    description:
      "Every dish is made from cherished family recipes passed down through generations.",
  },
  {
    icon: Clock,
    title: "Made Fresh",
    description:
      "We prepare everything fresh for your event — never frozen, always made with love.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-body text-primary text-sm font-semibold uppercase tracking-[0.15em] mb-2">
            Why Choose Us
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Crafted With Passion
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="text-center p-8 rounded-xl bg-card border border-border/50"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {f.title}
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
