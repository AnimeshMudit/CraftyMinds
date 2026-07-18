"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Heart, Mail, Package } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse a Collection",
    description: "Explore our curated collections of hand-painted wood art, canvas pouches, or clay magnets to find your style.",
  },
  {
    icon: Heart,
    title: "Choose Your Favourite",
    description: "Select a design that speaks to you, or decide on custom details like name plates or specific color palettes.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    description: "Reach out via Email or Instagram to share your choice and any personalized requests you have in mind.",
  },
  {
    icon: Package,
    title: "Receive Your Creation",
    description: "We hand-craft your order with care, wrap it beautifully, and ship it to you with a personal handwritten note.",
  },
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="py-12 md:py-24 bg-background relative overflow-hidden border-b border-border-custom/50">
      {/* Decorative subtle background detail */}
      <div className="absolute inset-0 bg-[radial-gradient(#ECE6DD_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-20 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent-secondary">Simplicity First</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground">
            How Ordering Works
          </h2>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            Every piece is made to order, painted, and stitched individually. Here is how we bring your custom creation to life.
          </p>
        </div>

        {/* Timeline Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8"
        >
          {/* Horizontal line for desktop timeline */}
          <div className="absolute top-[28px] left-[12.5%] right-[12.5%] h-[1px] bg-border-custom hidden md:block z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center text-center space-y-3 md:space-y-5 relative z-10 group"
              >
                {/* Step Icon Node */}
                <div className="w-14 h-14 rounded-full bg-white border border-border-custom flex items-center justify-center text-accent shadow-xs group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 transform group-hover:scale-105">
                  <Icon size={20} />
                </div>

                {/* Step Number Badge */}
                <span className="text-[10px] font-semibold tracking-widest uppercase text-accent bg-accent/5 px-3 py-1 rounded-full">
                  Step 0{idx + 1}
                </span>

                {/* Step Content */}
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-serif text-lg md:text-xl text-foreground tracking-wide font-medium">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 text-xs sm:text-sm font-sans font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
