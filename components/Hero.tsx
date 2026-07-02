"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 overflow-hidden bg-background">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ECE6DD_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Editorial Text Column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col justify-center text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 border border-accent/20 bg-accent/5 px-4 py-1.5 rounded-full w-fit mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-accent">Handmade in Small Batches</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-foreground leading-[1.08] mb-6"
          >
            Crafted by Hand. <br />
            <span className="font-light italic text-accent">Made with Love.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-foreground/75 text-base md:text-lg max-w-lg leading-relaxed mb-10 font-sans font-light"
          >
            Every creation is thoughtfully handmade—from colorful MDF décor and hand-painted pouches to adorable fridge magnets that make everyday spaces feel special.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 items-center"
          >
            <Link
              href="#categories"
              className="group px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-full font-medium tracking-wide text-sm flex items-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Browse Collections</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            <a
              href="#contact"
              className="px-8 py-4 border border-border-custom bg-white/50 backdrop-blur-xs hover:bg-white text-foreground rounded-full font-medium tracking-wide text-sm flex items-center gap-2.5 transition-all duration-300 hover:border-foreground/30 hover:-translate-y-0.5"
            >
              <MessageCircle size={16} className="text-accent" />
              <span>Contact Us</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Artistic Collage Column */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:col-span-6 relative h-[450px] sm:h-[550px] w-full flex items-center justify-center"
        >
          {/* Main Large Image (MDF Art) */}
          <motion.div
            variants={imageVariants}
            whileHover={{ scale: 1.02, zIndex: 30 }}
            className="absolute left-[5%] top-[10%] w-[55%] h-[70%] rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-[-2deg] cursor-pointer group"
          >
            <Image
              src="/images/mdf_art_showcase.jpg"
              alt="MDF Hand-painted Mandala Art"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 50vw, 30vw"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-white bg-accent/90 px-3 py-1.5 rounded-md">MDF Board Arts</span>
            </div>
          </motion.div>

          {/* Secondary Overlapping Image (Handmade Pouch) */}
          <motion.div
            variants={imageVariants}
            whileHover={{ scale: 1.03, zIndex: 30 }}
            className="absolute right-[5%] top-[5%] w-[42%] h-[50%] rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-[3deg] cursor-pointer group"
          >
            <Image
              src="/images/handmade_pouch_showcase.jpg"
              alt="Handmade Quilted Pouch"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 40vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-white bg-accent/90 px-3 py-1.5 rounded-md">Fabric Pouches</span>
            </div>
          </motion.div>

          {/* Third Overlapping Image (Fridge Magnets) */}
          <motion.div
            variants={imageVariants}
            whileHover={{ scale: 1.03, zIndex: 30 }}
            className="absolute right-[12%] bottom-[8%] w-[38%] h-[42%] rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-[-4deg] cursor-pointer group"
          >
            <Image
              src="/images/magnet_showcase.jpg"
              alt="Handmade Fridge Magnets"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 35vw, 18vw"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-white bg-accent/90 px-3 py-1.5 rounded-md">Clay Magnets</span>
            </div>
          </motion.div>

          {/* Decorative small sticker badge */}
          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
            className="absolute left-[3%] bottom-[12%] z-30 bg-[#79825A] text-white py-3 px-5 rounded-full shadow-lg font-serif text-sm tracking-wide border-2 border-white"
          >
            100% Original
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
