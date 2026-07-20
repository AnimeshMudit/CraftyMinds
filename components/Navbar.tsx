"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, UserRound, LogOut, CircleUserRound } from "lucide-react";
import CartButton from "@/components/Cart/CartButton";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useCustomerAuth();

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

  useEffect(() => {
    setProfileOpen(false);
    setIsOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email ?? "Customer";
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("") || "C";

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    router.replace("/");
    router.refresh();
  };

  const profileMenuItems = [
    { href: "/profile", label: "My Profile", icon: CircleUserRound },
    { href: "/my-orders", label: "My Orders", icon: UserRound },
    { href: "/profile?saved=addresses", label: "Saved Addresses", icon: UserRound },
    { href: "/profile?section=wishlist", label: "Wishlist", icon: UserRound, muted: true },
    { href: "/profile?section=settings", label: "Account Settings", icon: UserRound },
  ];

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

          {isLoading ? (
            <span className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest bg-accent/10 text-accent font-medium animate-pulse">
              Loading
            </span>
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border-custom bg-white/70 hover:bg-white transition-all duration-300 shadow-xs cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="w-10 h-10 rounded-full overflow-hidden bg-accent/10 text-accent flex items-center justify-center font-semibold text-xs shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </span>
                <ChevronDown size={14} className={`text-foreground/60 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-3 w-72 rounded-3xl border border-border-custom bg-white shadow-[0_18px_60px_rgba(45,42,38,0.14)] overflow-hidden"
                    role="menu"
                  >
                    <div className="p-4 border-b border-border-custom/70 bg-background/60">
                      <p className="text-xs uppercase tracking-widest text-foreground/40">Signed in as</p>
                      <p className="mt-1 font-serif text-lg text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {profileMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                              item.muted
                                ? "text-foreground/40 cursor-default"
                                : "text-foreground/75 hover:bg-accent/5 hover:text-accent"
                            }`}
                          >
                            <Icon size={16} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href={`/login${pathname !== "/login" ? `?next=${encodeURIComponent(pathname || "/")}` : ""}`}
              className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Actions (Cart & Hamburger) */}
        <div className="flex md:hidden items-center space-x-1">
          <CartButton />
          {!isLoading && user ? (
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="w-10 h-10 rounded-full overflow-hidden bg-accent/10 text-accent flex items-center justify-center font-semibold text-[10px] border border-border-custom/70"
              aria-label="Open profile"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{initials}</span>
              )}
            </button>
          ) : !isLoading ? (
            <Link
              href={`/login${pathname !== "/login" ? `?next=${encodeURIComponent(pathname || "/")}` : ""}`}
              className="px-4 py-2 rounded-full text-[10px] uppercase tracking-widest bg-accent text-white font-medium"
            >
              Login
            </Link>
          ) : null}
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
              {!isLoading && user ? (
                <>
                  <div className="flex items-center gap-3 px-1 pb-2">
                    <span className="w-12 h-12 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center text-accent font-semibold">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-lg truncate">{displayName}</p>
                      <p className="text-xs text-foreground/55 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3.5 rounded-xl text-sm uppercase tracking-wider bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 shadow-sm"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsOpen(false);
                      await handleLogout();
                    }}
                    className="w-full text-center py-3.5 rounded-xl text-sm uppercase tracking-wider border border-rose-200 text-rose-600 font-medium hover:bg-rose-50 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href={`/login${pathname !== "/login" ? `?next=${encodeURIComponent(pathname || "/")}` : ""}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3.5 rounded-xl text-sm uppercase tracking-wider bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 shadow-sm"
                >
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
