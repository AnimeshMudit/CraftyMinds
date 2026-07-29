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
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">My Story</span>
          
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.15]">
            Hello & <br />
            <span className="font-light italic text-accent-secondary">Welcome!</span>
          </h2>
          
          <div className="space-y-5 text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            <p>
              I&apos;m a homemaker, a mother, and now an artist finally pursuing a dream that patiently waited for many years.
            </p>
            <p>
              Like many women, I chose to put my dreams on hold to devote myself to my family. Every moment was dedicated to their happiness. My world revolved around my son&apos;s education and future, while my love for art quietly remained in my heart.
            </p>
            <p>
              Today, as he begins his own journey, I&apos;ve found the courage to begin mine.
            </p>
            <p>
              Every piece you see here is handcrafted with love, patience, and passion. To me, art is more than decoration; it&apos;s a celebration of creativity, hope, and new beginnings.
            </p>
            <p>
              This is more than a small business; it&apos;s a dream brought back to life. By supporting my work, you&apos;re encouraging the belief that it&apos;s never too late to follow your passion.
            </p>
            <p>
              Thank you for being part of this journey. I hope my creations bring warmth, beauty, and joy to your home.
            </p>
            <div className="pt-2">
              <p className="font-medium text-foreground/90">With love & gratitude, ❤️</p>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-8 border-t border-border-custom/60">
            <div>
              <span className="font-serif text-3xl font-light text-accent">100%</span>
              <p className="text-[11px] uppercase tracking-wider text-foreground/60 mt-1">Handmade & Unique</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-light text-accent-secondary">Heart</span>
              <p className="text-[11px] uppercase tracking-wider text-foreground/60 mt-1">Behind Every Piece</p>
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
              src="https://buswdznodxyugbipflnc.supabase.co/storage/v1/object/public/product-images/1783101248638_ChatGPT_Image_Jul_3__2026__11_23_30_PM.png"
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
