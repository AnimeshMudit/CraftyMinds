"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CategoryCard from "@/components/CategoryCard";
import WhyHandmade from "@/components/WhyHandmade";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

export default function Home() {
  const categories = [
    {
      title: "MDF Board Arts",
      description: "Intricately hand-painted wooden welcome boards, name plates, and wall plaques designed to add a warm, personal touch to your entryways.",
      imageSrc: "https://buswdznodxyugbipflnc.supabase.co/storage/v1/object/public/product-images/1783099587508_ChatGPT_Image_Jul_3__2026__10_55_05_PM.png",
      href: "/mdf",
    },
    {
      title: "Hand-painted Pouches",
      description: "Charming cotton canvas zipper pouches and cosmetic bags, individually hand-sewn and decorated with original hand-painted art.",
      imageSrc: "https://buswdznodxyugbipflnc.supabase.co/storage/v1/object/public/product-images/1783101753699_ChatGPT_Image_Jul_3__2026__02_02_17_AM.png",
      href: "/pouches",
    },
    {
      title: "Fridge Magnets",
      description: "Sweet, hand-sculpted clay bears, personalized name magnets, and hand-painted wood slices that make everyday magnetic surfaces feel special.",
      imageSrc: "https://buswdznodxyugbipflnc.supabase.co/storage/v1/object/public/product-images/1783102042086_ChatGPT_Image_Jul_3__2026__11_36_43_PM.png",
      href: "/magnets",
    },
    {
      title: "Handmade Rakhis",
      description: "Celebrate the sacred sibling bond with handcrafted designer rakhis made from premium threads, delicate beads, and crochet.",
      imageSrc: "/images/rakhi_showcase.jpg",
      href: "/rakhis",
    },
  ];

  return (
    <div className="relative">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About Crafty Mind Studio */}
      <AboutSection />

      {/* 3. Why Choose Handmade */}
      <WhyHandmade />

      {/* 5. Collections Section */}
      <section id="categories" className="py-12 md:py-32 bg-background scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          {/* Header */}
          <div className="max-w-xl mb-8 md:mb-16 space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-accent">Our Collections</span>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">
              Explore Our Collections
            </h2>
            <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
              Browse through our handcrafted collections. Select any collection card to explore our individual hand-painted designs and product details.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <CategoryCard {...category} />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. How Ordering Works */}
      <HowItWorks />

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. Contact Call-to-Action */}
      <CTASection />

    </div>
  );
}
