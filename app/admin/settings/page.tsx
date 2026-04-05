"use client";

import { useThemeStore, themePresets } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import { Check, Palette, Paintbrush } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { activePresetId, setTheme, getActivePreset } = useThemeStore();
  const activePreset = getActivePreset();

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Palette className="h-8 w-8 text-primary" />
          Paramètres du thème
        </h1>
        <p className="text-muted-foreground mt-2">
          Personnalisez les couleurs de votre boutique. Les changements s&apos;appliquent instantanément partout.
        </p>
      </div>

      <Separator />

      {/* Active Theme Preview */}
      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Thème actif
          </CardTitle>
          <CardDescription>
            Votre thème actuel est appliqué sur toute la boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                style={{ background: `hsl(${activePreset.colors.primary})` }}
              />
              <div
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                style={{ background: `hsl(${activePreset.colors.background})` }}
              />
              <div
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                style={{ background: `hsl(${activePreset.colors.foreground})` }}
              />
              <div
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                style={{ background: `hsl(${activePreset.colors.accent})` }}
              />
            </div>
            <div>
              <p className="font-bold text-lg">{activePreset.emoji} {activePreset.name}</p>
              <Badge variant="secondary">Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Presets Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Choisir un thème</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themePresets.map((preset) => {
            const isActive = preset.id === activePresetId;
            return (
              <Card
                key={preset.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                    : "hover:ring-1 hover:ring-border"
                )}
                onClick={() => setTheme(preset.id)}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Color Preview Strip */}
                  <div className="flex gap-1 h-12 rounded-xl overflow-hidden shadow-inner">
                    <div
                      className="flex-1"
                      style={{ background: `hsl(${preset.colors.primary})` }}
                    />
                    <div
                      className="flex-1"
                      style={{ background: `hsl(${preset.colors.background})` }}
                    />
                    <div
                      className="flex-1"
                      style={{ background: `hsl(${preset.colors.foreground})` }}
                    />
                    <div
                      className="flex-1"
                      style={{ background: `hsl(${preset.colors.muted})` }}
                    />
                    <div
                      className="flex-1"
                      style={{ background: `hsl(${preset.colors.accent})` }}
                    />
                  </div>

                  {/* Name + Active Check */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <span className="text-lg">{preset.emoji}</span>
                      {preset.name}
                    </span>
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Mini Preview */}
                  <div
                    className="rounded-lg p-3 text-xs space-y-2"
                    style={{
                      background: `hsl(${preset.colors.background})`,
                      color: `hsl(${preset.colors.foreground})`,
                    }}
                  >
                    <div
                      className="w-full h-7 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: `hsl(${preset.colors.primary})`,
                        color: `hsl(${preset.colors.primaryForeground})`,
                      }}
                    >
                      Bouton primaire
                    </div>
                    <div className="flex gap-1.5">
                      <div
                        className="flex-1 h-5 rounded"
                        style={{ background: `hsl(${preset.colors.muted})` }}
                      />
                      <div
                        className="flex-1 h-5 rounded"
                        style={{ background: `hsl(${preset.colors.accent})` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Reset and Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/50 border">
        <div className="flex-1">
          <p className="text-sm font-medium">Réinitialiser le thème</p>
          <p className="text-xs text-muted-foreground">
            Revenir au thème Orange Cameroun par défaut
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme("orange-default")}
          disabled={activePresetId === "orange-default"}
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
