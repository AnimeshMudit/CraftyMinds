"use client";

import React from "react";
import { motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";

export default function CTASection() {
  const contactMethods = [
    {
      icon: Instagram,
      title: "Instagram DM",
      label: "@craftymindstudio",
      description: "Follow our workspace, view stories, and reach out through direct messages.",
      href: "https://instagram.com/craftymindstudio",
      colorClass: "hover:border-[#E1306C]/40 group-hover:text-[#E1306C]",
      btnText: "View Profile",
    },
    {
      icon: Mail,
      title: "Email Inquiry",
      label: "craftymindstudios@gmail.com",
      description: "Send us an email for bulk gifting queries, design proposals, or questions.",
      href: "mailto:craftymindstudios@gmail.com?subject=Crafty%20Mind%20Studio%20Inquiry",
      colorClass: "hover:border-accent/40 group-hover:text-accent",
      btnText: "Write Email",
    },
  ];

  return (
    <section id="contact" className="py-12 md:py-32 bg-background relative overflow-hidden scroll-mt-20 border-t border-border-custom/50">
      {/* Soft color decorative blur circles for premium editorial style */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-accent/5 filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-accent-secondary/5 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 flex flex-col items-center text-center mb-8 md:mb-16"
        >
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Get in Touch</span>
          
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-foreground leading-tight">
            Let&apos;s Create Something <br />
            <span className="font-light italic text-accent-secondary">Beautiful Together</span>
          </h2>
          
          <p className="text-foreground/75 text-sm sm:text-base max-w-xl leading-relaxed font-sans font-light">
            We love bringing your custom ideas to life! Whether you want a personalized welcome plaque, custom fabric pouches, or magnets for a special occasion, reach out to us through email or Instagram DM.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-3xl mx-auto">
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={idx}
                href={method.href}
                target={method.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={method.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`group block p-5 md:p-8 bg-white border border-border-custom rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${method.colorClass}`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-3 md:space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-foreground/70 group-hover:bg-accent/5 group-hover:text-accent transition-colors duration-300">
                      <Icon size={22} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    {/* Titles */}
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg md:text-xl font-medium text-foreground">{method.title}</h3>
                      <p className="text-[11px] uppercase tracking-wider text-accent font-semibold">{method.label}</p>
                    </div>
                    {/* Description */}
                    <p className="text-foreground/70 text-xs sm:text-sm font-sans font-light leading-relaxed">
                      {method.description}
                    </p>
                  </div>

                  {/* Button Action text */}
                  <div className="pt-4 md:pt-6 mt-auto flex items-center text-xs font-semibold uppercase tracking-widest text-foreground/80 group-hover:text-accent transition-colors duration-300">
                    <span>{method.btnText}</span>
                    <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        <p className="text-[10px] uppercase tracking-widest text-foreground/40 text-center pt-8 md:pt-12 font-sans font-medium">
          Response time: Usually within 1–2 business days
        </p>
      </div>
    </section>
  );
}
