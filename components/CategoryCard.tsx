"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  countLabel?: string;
}

export default function CategoryCard({
  title,
  description,
  imageSrc,
  href,
  countLabel,
}: CategoryCardProps) {
  return (
    <Link href={href} className="group block space-y-2 md:space-y-4">
      {/* Category Image - Large Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border-custom bg-background shadow-xs transition-shadow duration-500 group-hover:shadow-md">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Category Info - Spacing and Typography */}
      <div className="space-y-1.5 md:space-y-2 px-1">
        <h3 className="font-serif text-xl md:text-2xl tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-foreground/70 text-xs md:text-sm leading-relaxed font-light font-sans">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent pt-1 group-hover:text-accent-secondary transition-colors duration-300">
          <span>Explore Collection</span>
          <ArrowRight size={12} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
