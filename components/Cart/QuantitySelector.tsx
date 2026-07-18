import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-border-custom bg-white rounded-full px-1.5 py-0.5 md:px-2 md:py-1 select-none w-fit">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1 || disabled}
        className="p-1 rounded-full text-foreground/60 hover:text-accent hover:bg-background transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/60 cursor-pointer disabled:cursor-not-allowed"
        type="button"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 md:w-8 text-center text-xs md:text-sm font-medium font-sans text-foreground">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= 99 || disabled}
        className="p-1 rounded-full text-foreground/60 hover:text-accent hover:bg-background transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/60 cursor-pointer disabled:cursor-not-allowed"
        type="button"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
