"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/5] w-full max-h-[380px] sm:max-h-none rounded-3xl overflow-hidden border border-border-custom shadow-xs bg-[#EFEBE4] group">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-all duration-700 group-hover:scale-101 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}
