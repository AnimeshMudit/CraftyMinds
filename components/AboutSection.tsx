"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.0, ease: "easeOut" as const, delay: 0.1 },
    },
  };

  return (
    <section id="about" className="py-24 md:py-32 bg-white overflow-hidden border-t border-b border-border-custom/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Editorial Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
          className="lg:col-span-6 flex flex-col justify-center space-y-6"
        >
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Our Philosophy</span>
          
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.15]">
            Every Piece Tells <br />
            <span className="font-light italic text-accent-secondary">a Slow-Crafted Story.</span>
          </h2>
          
          <div className="space-y-5 text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            <p>
              At Crafty Mind Studio, we are a small artisan business born out of a deep passion for creating meaningful gifts and décor. We believe that the objects we surround ourselves with should have a soul. In a world of mass production, we invite you to embrace the charm of the unique and the beauty of the handmade.
            </p>
            <p>
              Every single mandala wooden plaque, stitched cotton pouch, and tiny clay magnet is handmade with care in our studio. We spend hours planning colors, painting details, and selecting raw materials to ensure that what arrives at your doorstep is a work of art.
            </p>
            <p>
              Because of this slow, dedicated process, every piece is unique, holding its own character and personal touch. When you choose our creations, you choose something built with patience, love, and intent.
            </p>
            <p className="font-serif italic text-accent text-base sm:text-lg pt-2">
              {"\"We don't manufacture. We pour heart, patience, and meticulous skill into everything we build.\""}
            </p>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-8 border-t border-border-custom/60">
            <div>
              <span className="font-serif text-3xl font-light text-accent">100%</span>
              <p className="text-[11px] uppercase tracking-wider text-foreground/60 mt-1">Handmade with Care</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-light text-accent-secondary">Small</span>
              <p className="text-[11px] uppercase tracking-wider text-foreground/60 mt-1">Artisan Business</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Process Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={imageVariants}
          className="lg:col-span-6 relative"
        >
          <div className="relative h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-border-custom bg-background group">
            <Image
              src="/images/crafting_process.jpg"
              alt="Artisan hand painting wood art"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-103"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(45,42,38,0.08))]" />
          </div>
          
          {/* Accent frame decoration */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-accent/30 rounded-bl-3xl pointer-events-none hidden sm:block" />
          <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-accent-secondary/30 rounded-tr-3xl pointer-events-none hidden sm:block" />
        </motion.div>

      </div>
    </section>
  );
}
