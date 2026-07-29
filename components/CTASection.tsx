"use client";

import React from "react";
import { motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";
import { contactConfig, getWhatsAppLink } from "@/lib/contact";

// Custom official SVG icon for WhatsApp
function WhatsAppIcon({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <title>WhatsApp</title>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CTASection() {
  const contactMethods = [
    {
      icon: WhatsAppIcon,
      title: "WhatsApp Business",
      label: contactConfig.whatsAppDisplay,
      description: "Chat with us for product enquiries, custom orders, gifting, bulk purchases, or order support.",
      href: getWhatsAppLink(),
      colorClass: "hover:border-[#25D366]/40 group-hover:text-[#25D366]",
      btnText: "START CHAT",
      ariaLabel: `Contact us on WhatsApp Business at ${contactConfig.whatsAppDisplay}`,
    },
    {
      icon: Instagram,
      title: "Instagram",
      label: contactConfig.instagramHandle,
      description: "Explore our latest handmade creations, behind-the-scenes moments, and new product launches. Reach out anytime through Instagram DMs.",
      href: contactConfig.instagramUrl,
      colorClass: "hover:border-[#E1306C]/40 group-hover:text-[#E1306C]",
      btnText: "VIEW PROFILE",
      ariaLabel: `Follow us on Instagram at ${contactConfig.instagramHandle}`,
    },
    {
      icon: Mail,
      title: "Email",
      label: contactConfig.supportEmail,
      description: "Send us an email for bulk gifting queries, design proposals, or questions.",
      href: `mailto:${contactConfig.supportEmail}?subject=Crafty%20Mind%20Studio%20Inquiry`,
      colorClass: "hover:border-accent/40 group-hover:text-accent",
      btnText: "Write Email",
      ariaLabel: `Send us an email at ${contactConfig.supportEmail}`,
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
            We love bringing your custom ideas to life! Whether you want a personalized welcome plaque, custom fabric pouches, or magnets for a special occasion, reach out to us through email, Instagram, or WhatsApp.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={idx}
                href={method.href}
                target={method.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={method.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={method.ariaLabel}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`group block p-5 md:p-8 bg-white border border-border-custom rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-[0.985] active:translate-y-0 active:opacity-95 ${method.colorClass}`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-3 md:space-y-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center text-foreground/70 transition-colors duration-300 ${
                      method.title === "WhatsApp Business" 
                        ? "group-hover:bg-[#25D366]/5 group-hover:text-[#25D366]" 
                        : method.title === "Instagram"
                        ? "group-hover:bg-[#E1306C]/5 group-hover:text-[#E1306C]"
                        : "group-hover:bg-accent/5 group-hover:text-accent"
                    }`}>
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
                  <div className="pt-4 md:pt-6 mt-auto flex items-center text-xs font-semibold uppercase tracking-widest text-foreground/80 group-hover:text-inherit transition-colors duration-300">
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
