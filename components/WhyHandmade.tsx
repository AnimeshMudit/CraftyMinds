"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Sliders, ShieldCheck, Gift } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Handmade with Love",
    description: "Every item is painted, sewn, and polished individually by hand. No two pieces are exactly identical.",
  },
  {
    icon: Sliders,
    title: "Custom Designs",
    description: "Personalize the dimensions, color palettes, patterns, or add initials to make it uniquely yours.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Materials",
    description: "We source organic canvas cotton, eco-friendly MDF wood, and high-strength neodymium magnets.",
  },
  {
    icon: Gift,
    title: "Thoughtful Gifts",
    description: "Every item comes carefully packaged in simple, beautiful wrapping, complete with a handwritten note if you are sending a gift.",
  },
];

export default function WhyHandmade() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="py-12 md:py-24 bg-white border-b border-border-custom/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 md:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Made with Intent</span>
          <h2 className="font-serif text-2.5xl sm:text-4xl tracking-tight text-foreground">
            Why Choose Handmade?
          </h2>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm">
            Handmade products represent an appreciation for human creativity, details, and quality that mass production can never replicate.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-background/40 hover:bg-white border border-border-custom p-5 md:p-8 rounded-2xl transition-all duration-300 hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="font-serif text-lg md:text-xl tracking-wide text-foreground mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans font-light">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
