"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import CartButton from "@/components/Cart/CartButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/mdf", label: "MDF Arts" },
  { href: "/pouches", label: "Pouches" },
  { href: "/magnets", label: "Magnets" },
  { href: "/rakhis", label: "Rakhis" },
  { href: "/track-order", label: "Track Order" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-border-custom/60 py-3 md:py-4 shadow-xs"
          : "bg-transparent border-transparent py-4 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">
            Crafty Mind <span className="font-light italic text-accent">Studio</span>
          </span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/60 -mt-1 group-hover:text-foreground/80 transition-colors duration-300">
            Handcrafted With Love
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1 text-sm uppercase tracking-wider text-foreground/80 hover:text-foreground transition-colors duration-300"
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavBorder"
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
          <CartButton />
          
          <a
            href="https://wa.me/919140194290?text=Hi%2C%20I%20am%20interested%20in%20your%20handcrafted%20products!"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            Say Hello
          </a>
        </nav>

        {/* Mobile Actions (Cart & Hamburger) */}
        <div className="flex md:hidden items-center space-x-1">
          <CartButton />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground/80 hover:text-foreground transition-colors duration-300 cursor-pointer"
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background border-b border-border-custom overflow-hidden"
          >
            <nav className="flex flex-col px-8 py-8 space-y-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-serif tracking-wide py-2 ${
                      isActive ? "text-accent font-semibold" : "text-foreground/75"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <hr className="border-border-custom/50 my-2" />
              <a
                href="https://wa.me/919140194290?text=Hi%2C%20I%20am%20interested%20in%20your%20handcrafted%20products!"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3.5 rounded-xl text-sm uppercase tracking-wider bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 shadow-sm"
              >
                Contact via WhatsApp
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
