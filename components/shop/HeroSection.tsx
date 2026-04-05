"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  productCount: number;
}

const SHOP_NAME = "EcommerceInCameroun237";

export function HeroSection({ productCount }: HeroSectionProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for scroll animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Typewriter effect for shop name
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < SHOP_NAME.length) {
        setDisplayedText(SHOP_NAME.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursor);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] sm:min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative floating elements */}
      <div className="absolute top-16 right-[20%] text-6xl opacity-20 animate-float hidden md:block" style={{ animationDelay: "0.5s" }}>
        🇨🇲
      </div>
      <div className="absolute bottom-32 left-[15%] text-4xl opacity-15 animate-float hidden md:block" style={{ animationDelay: "2s" }}>
        🛍️
      </div>
      <div className="absolute top-1/3 right-[10%] text-3xl opacity-10 animate-float hidden lg:block" style={{ animationDelay: "1s" }}>
        ✨
      </div>

      {/* Content */}
      <div className="container relative z-10 py-16 sm:py-20">
        <div
          className={`max-w-3xl transition-all duration-1000 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          {/* Shop name with typewriter */}
          <Badge className="mb-4 sm:mb-6 px-3 py-1.5 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
            🇨🇲 Made in Cameroun
          </Badge>

          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              <span className="text-primary inline-block">
                {displayedText}
                <span
                  className={`inline-block w-[3px] h-[0.8em] bg-primary ml-1 align-baseline transition-opacity ${
                    showCursor ? "opacity-100" : "opacity-0"
                  } ${isTypingDone ? "animate-blink" : ""}`}
                />
              </span>
            </h1>
          </div>

          <h2
            className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight transition-all duration-700 delay-300 ${
              isTypingDone
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            L&apos;artisanat camerounais{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              livré chez vous
            </span>
          </h2>

          <p
            className={`mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed transition-all duration-700 delay-500 ${
              isTypingDone
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            Découvrez une collection unique de vêtements traditionnels, bijoux
            artisanaux, et saveurs authentiques du Cameroun. Chaque produit
            raconte une histoire.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap transition-all duration-700 delay-700 ${
              isTypingDone
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group" asChild>
              <Link href="/products">
                Explorer la boutique
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="backdrop-blur-sm" asChild>
              <Link href="/categories/artisanat">Voir l&apos;artisanat</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div
            className={`flex gap-4 sm:gap-6 mt-8 sm:mt-10 text-xs sm:text-sm text-muted-foreground flex-wrap transition-all duration-700 delay-1000 ${
              isTypingDone
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              ✅ +{productCount > 0 ? productCount : 200} produits
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              ✅ Artisans certifiés
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full hidden xs:flex">
              ✅ Livraison sécurisée
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
