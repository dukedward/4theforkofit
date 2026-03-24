import React from "react";
import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold">4theForkOfIt</span>
          </div>
          <p className="font-body text-sm text-background/60">
            Soul Food & BBQ Catering — Made with love, smoked with passion.
          </p>
          <p className="font-body text-xs text-background/40">
            © {new Date().getFullYear()} 4theForkOfIt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
