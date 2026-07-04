"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, User } from "lucide-react";

const testimonials = [
  {
    name: "Sneha Sharma",
    location: "Mumbai, MH",
    product: "MDF Name Plate",
    review: "The custom welcome board exceeded my expectations! The detail in the mandala painting is breathtaking, and the colors are vibrant yet sophisticated. It sits beautifully at our main entryway.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    location: "Delhi, DL",
    product: "Personalized Magnets",
    review: "I ordered a set of personalized clay bear magnets for my partner, and they are absolutely adorable. The packaging was lovely and arrived with a cute handwritten note. Outstanding craft!",
    rating: 5,
  },
  {
    name: "Aditi Rao",
    location: "Bangalore, KA",
    product: "Hand-painted Pouches",
    review: "Stunning hand-painted pouches! The fabric is high quality, and the hand-painted floral pattern feels so premium. It's my daily travel essential now. Love supporting small artisans!",
    rating: 5,
  },
];

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <section className="py-12 md:py-24 bg-white border-b border-border-custom/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 md:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Customer Stories</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground">
            Loved by Collectors
          </h2>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            Read what our clients say about the quality, attention to detail, and love put into every creation.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-background/30 hover:bg-white border border-border-custom p-5 md:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md group"
            >
              <div className="space-y-4 md:space-y-6">
                {/* Rating Stars */}
                <div className="flex gap-1 text-accent">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-accent" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-foreground/80 font-serif italic text-sm sm:text-base leading-relaxed">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              {/* User Bio Footer */}
              <div className="mt-6 pt-4 md:mt-8 md:pt-6 border-t border-border-custom/60 flex items-center gap-4">
                {/* Customer Photo / Avatar space */}
                <div className="w-10 h-10 rounded-full border border-border-custom bg-background flex items-center justify-center text-foreground/40 overflow-hidden relative group-hover:border-accent/40 transition-colors duration-300">
                  <User size={16} />
                </div>
                
                <div>
                  <h4 className="font-serif text-sm font-semibold text-foreground tracking-wide">
                    {t.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/50 font-sans">
                    {t.product} &bull; {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
