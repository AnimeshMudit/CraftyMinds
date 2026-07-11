"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, MessageSquare, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-white border-t border-border-custom pt-10 pb-8 md:pt-16 md:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
        
        {/* Brand Information */}
        <div className="md:col-span-2 flex flex-col space-y-4">
          <Link href="/" className="flex flex-col w-fit">
            <span className="font-serif text-2xl tracking-wide text-foreground">
              Crafty Mind <span className="font-light italic text-accent">Studio</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-foreground/50 -mt-0.5">
              Handcrafted With Love
            </span>
          </Link>
          <p className="text-foreground/75 text-sm max-w-sm leading-relaxed">
            Lovingly handcrafted wood art plaques, hand-painted fabric pouches, and clay magnets. Every piece is unique and painted by hand.
          </p>
        </div>

        {/* Categories / Quick Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-foreground/80">Explore</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>
              <Link href="/mdf" className="hover:text-accent transition-colors duration-300">
                MDF Board Arts
              </Link>
            </li>
            <li>
              <Link href="/pouches" className="hover:text-accent transition-colors duration-300">
                Hand-painted Pouches
              </Link>
            </li>
            <li>
              <Link href="/magnets" className="hover:text-accent transition-colors duration-300">
                Fridge Magnets
              </Link>
            </li>
            <li>
              <Link href="/rakhis" className="hover:text-accent transition-colors duration-300">
                Handmade Rakhis
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-foreground/80">Connect</h4>
          <ul className="space-y-3.5 text-sm text-foreground/70">
            <li>
              <a
                href="https://wa.me/919140194290?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20handcrafted%20products!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 hover:text-accent transition-colors duration-300 group"
              >
                <MessageSquare size={16} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                <span>WhatsApp chat</span>
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/craftymindstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 hover:text-accent transition-colors duration-300 group"
              >
                <Instagram size={16} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                <span>@craftymindstudio</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@craftymindstudio.com"
                className="flex items-center space-x-2.5 hover:text-accent transition-colors duration-300 group"
              >
                <Mail size={16} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                <span>hello@craftymindstudio.com</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-8 pt-6 md:mt-16 md:pt-8 border-t border-border-custom/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/50 tracking-wider">
        <p>© {currentYear} CRAFTY MIND STUDIO. ALL RIGHTS RESERVED.</p>
        <p className="flex items-center gap-1">
          Lovingly hand-painted & stitched.
        </p>
      </div>
    </footer>
  );
}
