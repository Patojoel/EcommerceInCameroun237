"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const firstNames = ["Jean", "Marie", "Paul", "Sophie", "Luc", "Emma", "Thomas", "Julie", "Marc", "Alice", "Didier", "Astride", "Christian", "Nathalie"];
const cities = ["Douala", "Yaoundé", "Bafoussam", "Bamenda", "Kribi", "Garoua", "Maroua", "Edea", "Limbe", "Buea"];

export function FakeSalesNotification() {
  const { toast } = useToast();

  useEffect(() => {
    // Affiche la première notification après 3 à 8 secondes
    const initialDelay = Math.floor(Math.random() * 5000) + 3000;
    
    let intervalId: NodeJS.Timeout;

    const showNotification = () => {
      const name = firstNames[Math.floor(Math.random() * firstNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const timeAgo = Math.floor(Math.random() * 59) + 1; // 1 à 59 minutes
      
      toast({
        title: "Nouvelle commande ! 🛍️",
        description: (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-sm">
              <span className="font-semibold">{name}</span> de <span className="font-semibold">{city}</span> vient d&apos;acheter cet article.
            </span>
            <span className="text-xs text-muted-foreground">Il y a {timeAgo} min</span>
          </div>
        ),
        duration: 5000, // Laisser affiché 5 secondes
      });
    };

    const timeoutId = setTimeout(() => {
      showNotification();
      
      // Ensuite, on affiche aléatoirement toutes les 15 à 35 secondes
      intervalId = setInterval(() => {
        showNotification();
      }, Math.floor(Math.random() * 20000) + 15000);
      
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [toast]);

  return null; // Composant invisible
}
