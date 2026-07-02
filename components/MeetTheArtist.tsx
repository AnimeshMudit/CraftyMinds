"use client";

import React from "react";
import { motion } from "framer-motion";
import { Palette, Heart, CheckCircle } from "lucide-react";

export default function MeetTheArtist() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="artist" className="py-24 md:py-32 bg-white overflow-hidden border-b border-border-custom/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left"
        >
          <motion.span variants={itemVariants} className="text-xs uppercase tracking-widest font-semibold text-accent">
            Behind the Craft
          </motion.span>
          
          <motion.h2 variants={itemVariants} className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.15]">
            Meet the Artist
          </motion.h2>
          
          <motion.div variants={itemVariants} className="space-y-5 text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            <p>
              Hi, I&apos;m the face behind Crafty Mind Studio. For me, creating isn&apos;t just a hobby—it&apos;s a slow, quiet dialogue between my hands, colors, and the raw materials. 
            </p>
            <p>
              Every single piece in this collection is handcrafted with patience and creativity. From mixing the perfect acrylic shades for an MDF board, to hand-painting intricate patterns on canvas pouches, and molding tiny clay shapes into fridge magnets, each step is done by hand.
            </p>
            <p>
              Because of this handmade process, <strong>no two items are exactly alike</strong>. When you choose a creation from our studio, you are receiving a unique piece of art that holds its own character and charm.
            </p>
            <p>
              Whether you are looking for a special gift or something to brighten your own home, <strong>custom orders are always welcome</strong>. We love collaborating on custom names, colors, and sizes to make something truly meaningful for you.
            </p>
          </motion.div>

          {/* Key values */}
          <motion.div variants={itemVariants} className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border-custom/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-accent/5 text-accent">
                <Palette size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-medium text-foreground">100% Painted</h4>
                <p className="text-[11px] text-foreground/60 font-sans">No mass prints</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-accent-secondary/5 text-accent-secondary">
                <Heart size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-medium text-foreground">Made with Love</h4>
                <p className="text-[11px] text-foreground/60 font-sans">Handcrafted care</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-accent/5 text-accent">
                <CheckCircle size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-medium text-foreground">Custom Orders</h4>
                <p className="text-[11px] text-foreground/60 font-sans">Tailored for you</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          {/* Framed Placeholder */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-dashed border-accent/20 bg-background flex flex-col items-center justify-center p-8 text-center group transition-colors duration-300 hover:bg-accent/5">
            {/* Elegant inner box */}
            <div className="absolute inset-4 border border-border-custom rounded-2xl pointer-events-none" />
            
            <div className="space-y-4 max-w-xs z-10">
              <div className="mx-auto w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center text-accent/60 bg-white shadow-xs">
                <Palette size={20} className="animate-pulse" />
              </div>
              <h3 className="font-serif text-lg text-foreground/80 font-medium">Artisan Workspace</h3>
              <p className="text-xs text-foreground/50 font-sans leading-relaxed">
                A photograph of the artist painting inside the studio will go here.
              </p>
              <span className="inline-block text-[9px] uppercase tracking-widest text-accent font-semibold bg-accent/5 px-3 py-1 rounded-full">
                Artist at Work
              </span>
            </div>

            {/* Watercolor accent elements or background details */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-accent-secondary/20 rounded-tl-xl pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-accent-secondary/20 rounded-br-xl pointer-events-none" />
          </div>

          {/* Accent frame decoration */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-accent-secondary/20 rounded-bl-3xl pointer-events-none" />
          <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-accent/20 rounded-tr-3xl pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
