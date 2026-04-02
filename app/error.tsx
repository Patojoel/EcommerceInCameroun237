"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="text-8xl">⚠️</div>
        <h1 className="text-3xl font-bold text-foreground">
          Une erreur est survenue
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Quelque chose s&apos;est mal passé. Veuillez réessayer ou revenir à
          l&apos;accueil.
        </p>
        {error.message && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3 max-w-md">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
