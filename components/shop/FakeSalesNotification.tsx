"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const firstNames = ["Jean", "Marie", "Paul", "Sophie", "Luc", "Emma", "Thomas", "Julie", "Marc", "Alice", "Didier", "Astride", "Christian", "Nathalie", "Patrick", "Carine", "Samuel", "Estelle"];
const cities = ["Douala", "Yaoundé", "Bafoussam", "Bamenda", "Kribi", "Garoua", "Maroua", "Edea", "Limbe", "Buea", "Bertoua", "Ngaoundéré"];

const avatarEmojis = ["👤", "👩", "👨", "🧑", "👩‍🦱", "👨‍🦱", "🧑‍🦰", "👩‍🦳"];

export function FakeSalesNotification() {
  const { toast } = useToast();

  useEffect(() => {
    const initialDelay = Math.floor(Math.random() * 5000) + 3000;
    
    let intervalId: NodeJS.Timeout;

    const showNotification = () => {
      const name = firstNames[Math.floor(Math.random() * firstNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const timeAgo = Math.floor(Math.random() * 30) + 1;
      const avatar = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];
      
      toast({
        variant: "sale" as any,
        title: "🛍️ Nouvelle commande !",
        description: (
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg">
              {avatar}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm leading-tight">
                <span className="font-bold">{name}</span> de <span className="font-semibold">{city}</span>
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Il y a {timeAgo} min
              </span>
            </div>
          </div>
        ),
        duration: 5000,
      });
    };

    const timeoutId = setTimeout(() => {
      showNotification();
      
      intervalId = setInterval(() => {
        showNotification();
      }, Math.floor(Math.random() * 20000) + 15000);
      
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [toast]);

  return null;
}
