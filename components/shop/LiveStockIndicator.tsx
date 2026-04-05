"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface LiveStockIndicatorProps {
  initialStock: number;
  className?: string;
}

const urgencyMessages = [
  { threshold: 3, message: "🔥 Dernières pièces ! Dépêchez-vous !", color: "text-red-600" },
  { threshold: 5, message: "⚡ Presque épuisé ! Achetez maintenant !", color: "text-red-500" },
  { threshold: 10, message: "⚡ Presque épuisé ! Achetez maintenant !", color: "text-red-500" },
  { threshold: 20, message: "📦 Ce produit se vend rapidement", color: "text-amber-600" },
  { threshold: Infinity, message: "✅ En stock — Disponible", color: "text-green-600" },
];

function getUrgency(stock: number) {
  return urgencyMessages.find((u) => stock <= u.threshold)!;
}

export function LiveStockIndicator({ initialStock, className }: LiveStockIndicatorProps) {
  // Start from a fake display stock slightly below or equal to initialStock
  const startStock = Math.max(1, Math.min(initialStock, Math.floor(initialStock * 0.85) + Math.floor(Math.random() * 5)));
  const [displayStock, setDisplayStock] = useState(startStock);
  const [isPulsing, setIsPulsing] = useState(false);
  const [justDecreased, setJustDecreased] = useState(false);

  const decreaseStock = useCallback(() => {
    setDisplayStock((prev) => {
      if (prev <= 1) return 1;
      const decrease = Math.random() > 0.6 ? 2 : 1;
      return Math.max(1, prev - decrease);
    });
    setIsPulsing(true);
    setJustDecreased(true);
    setTimeout(() => setIsPulsing(false), 2000);
    setTimeout(() => setJustDecreased(false), 3000);
  }, []);

  useEffect(() => {
    // First decrease after 5-10 seconds
    const initialDelay = Math.floor(Math.random() * 5000) + 5000;
    const firstTimeout = setTimeout(() => {
      decreaseStock();

      // Then decrease every 8-20 seconds
      const interval = setInterval(() => {
        decreaseStock();
      }, Math.floor(Math.random() * 12000) + 8000);

      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(firstTimeout);
  }, [decreaseStock]);

  const urgency = getUrgency(displayStock);
  const progressPercent = Math.min(100, (displayStock / Math.max(initialStock, 1)) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Stock bar */}
      <div className="relative w-full h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            progressPercent > 50 ? "bg-green-500" :
            progressPercent > 25 ? "bg-amber-500" :
            progressPercent > 10 ? "bg-orange-500" : "bg-red-500",
            isPulsing && "animate-pulse"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stock info */}
      <div className="flex items-center justify-between gap-2">
        <p className={cn(
          "text-xs sm:text-sm font-semibold transition-all duration-500",
          urgency.color,
          isPulsing && "scale-105"
        )}>
          {urgency.message}
        </p>
        <span className={cn(
          "text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap transition-all duration-300",
          justDecreased ? "text-red-600 scale-110" : "text-muted-foreground"
        )}>
          {displayStock} restant{displayStock > 1 ? "s" : ""}
        </span>
      </div>

      {/* "Someone just bought" notification when stock decreases */}
      {justDecreased && (
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Quelqu&apos;un vient d&apos;acheter cet article</span>
        </div>
      )}
    </div>
  );
}
