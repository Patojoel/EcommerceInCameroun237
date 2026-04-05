import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  accent: string;
  accentForeground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  secondary: string;
  secondaryForeground: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  emoji: string;
  colors: ThemeColors;
  darkColors: ThemeColors;
}

export const themePresets: ThemePreset[] = [
  {
    id: "orange-default",
    name: "Orange Cameroun",
    emoji: "🟠",
    colors: {
      primary: "25 95% 53%",
      primaryForeground: "210 40% 98%",
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      accent: "210 40% 96.1%",
      accentForeground: "222.2 47.4% 11.2%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      secondary: "210 40% 96.1%",
      secondaryForeground: "222.2 47.4% 11.2%",
    },
    darkColors: {
      primary: "25 95% 53%",
      primaryForeground: "222.2 47.4% 11.2%",
      background: "222.2 84% 4.9%",
      foreground: "210 40% 98%",
      accent: "217.2 32.6% 17.5%",
      accentForeground: "210 40% 98%",
      card: "222.2 84% 4.9%",
      cardForeground: "210 40% 98%",
      muted: "217.2 32.6% 17.5%",
      mutedForeground: "215 20.2% 65.1%",
      secondary: "217.2 32.6% 17.5%",
      secondaryForeground: "210 40% 98%",
    },
  },
  {
    id: "green-forest",
    name: "Vert Forêt",
    emoji: "🌿",
    colors: {
      primary: "152 60% 40%",
      primaryForeground: "0 0% 100%",
      background: "0 0% 100%",
      foreground: "160 20% 8%",
      accent: "150 30% 94%",
      accentForeground: "160 20% 15%",
      card: "0 0% 100%",
      cardForeground: "160 20% 8%",
      muted: "150 20% 95%",
      mutedForeground: "155 10% 45%",
      secondary: "150 20% 95%",
      secondaryForeground: "160 20% 15%",
    },
    darkColors: {
      primary: "152 60% 45%",
      primaryForeground: "160 20% 8%",
      background: "160 30% 5%",
      foreground: "150 15% 95%",
      accent: "155 25% 15%",
      accentForeground: "150 15% 95%",
      card: "160 30% 5%",
      cardForeground: "150 15% 95%",
      muted: "155 25% 15%",
      mutedForeground: "150 15% 60%",
      secondary: "155 25% 15%",
      secondaryForeground: "150 15% 95%",
    },
  },
  {
    id: "blue-ocean",
    name: "Bleu Océan",
    emoji: "🌊",
    colors: {
      primary: "217 91% 60%",
      primaryForeground: "0 0% 100%",
      background: "0 0% 100%",
      foreground: "222 47% 11%",
      accent: "214 32% 95%",
      accentForeground: "222 47% 11%",
      card: "0 0% 100%",
      cardForeground: "222 47% 11%",
      muted: "214 32% 95%",
      mutedForeground: "215 16% 47%",
      secondary: "214 32% 95%",
      secondaryForeground: "222 47% 11%",
    },
    darkColors: {
      primary: "217 91% 60%",
      primaryForeground: "222 47% 8%",
      background: "222 47% 6%",
      foreground: "210 40% 98%",
      accent: "217 33% 17%",
      accentForeground: "210 40% 98%",
      card: "222 47% 6%",
      cardForeground: "210 40% 98%",
      muted: "217 33% 17%",
      mutedForeground: "215 20% 65%",
      secondary: "217 33% 17%",
      secondaryForeground: "210 40% 98%",
    },
  },
  {
    id: "red-passion",
    name: "Rouge Passion",
    emoji: "❤️",
    colors: {
      primary: "0 72% 51%",
      primaryForeground: "0 0% 100%",
      background: "0 0% 100%",
      foreground: "0 0% 8%",
      accent: "0 40% 96%",
      accentForeground: "0 0% 15%",
      card: "0 0% 100%",
      cardForeground: "0 0% 8%",
      muted: "0 20% 96%",
      mutedForeground: "0 10% 45%",
      secondary: "0 20% 96%",
      secondaryForeground: "0 0% 15%",
    },
    darkColors: {
      primary: "0 72% 55%",
      primaryForeground: "0 0% 100%",
      background: "0 20% 5%",
      foreground: "0 10% 95%",
      accent: "0 15% 15%",
      accentForeground: "0 10% 95%",
      card: "0 20% 5%",
      cardForeground: "0 10% 95%",
      muted: "0 15% 15%",
      mutedForeground: "0 10% 60%",
      secondary: "0 15% 15%",
      secondaryForeground: "0 10% 95%",
    },
  },
  {
    id: "purple-luxe",
    name: "Violet Luxe",
    emoji: "💜",
    colors: {
      primary: "271 76% 53%",
      primaryForeground: "0 0% 100%",
      background: "0 0% 100%",
      foreground: "270 30% 8%",
      accent: "270 30% 96%",
      accentForeground: "270 30% 15%",
      card: "0 0% 100%",
      cardForeground: "270 30% 8%",
      muted: "270 20% 96%",
      mutedForeground: "270 10% 45%",
      secondary: "270 20% 96%",
      secondaryForeground: "270 30% 15%",
    },
    darkColors: {
      primary: "271 76% 58%",
      primaryForeground: "0 0% 100%",
      background: "270 30% 5%",
      foreground: "270 10% 95%",
      accent: "270 20% 15%",
      accentForeground: "270 10% 95%",
      card: "270 30% 5%",
      cardForeground: "270 10% 95%",
      muted: "270 20% 15%",
      mutedForeground: "270 10% 60%",
      secondary: "270 20% 15%",
      secondaryForeground: "270 10% 95%",
    },
  },
  {
    id: "gold-premium",
    name: "Or Premium",
    emoji: "✨",
    colors: {
      primary: "45 93% 47%",
      primaryForeground: "45 20% 10%",
      background: "40 20% 99%",
      foreground: "40 20% 8%",
      accent: "40 30% 94%",
      accentForeground: "40 20% 15%",
      card: "40 20% 99%",
      cardForeground: "40 20% 8%",
      muted: "40 20% 95%",
      mutedForeground: "40 10% 45%",
      secondary: "40 20% 95%",
      secondaryForeground: "40 20% 15%",
    },
    darkColors: {
      primary: "45 93% 50%",
      primaryForeground: "45 20% 8%",
      background: "40 20% 4%",
      foreground: "40 15% 95%",
      accent: "40 15% 15%",
      accentForeground: "40 15% 95%",
      card: "40 20% 4%",
      cardForeground: "40 15% 95%",
      muted: "40 15% 15%",
      mutedForeground: "40 10% 60%",
      secondary: "40 15% 15%",
      secondaryForeground: "40 15% 95%",
    },
  },
];

interface ThemeState {
  activePresetId: string;
  setTheme: (presetId: string) => void;
  getActivePreset: () => ThemePreset;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      activePresetId: "orange-default",

      setTheme: (presetId: string) => {
        set({ activePresetId: presetId });
        // Apply immediately
        const preset = themePresets.find((p) => p.id === presetId);
        if (preset) {
          applyColorsToDOM(preset.colors, preset.darkColors);
        }
      },

      getActivePreset: () => {
        const { activePresetId } = get();
        return themePresets.find((p) => p.id === activePresetId) || themePresets[0];
      },

      applyTheme: () => {
        const preset = get().getActivePreset();
        applyColorsToDOM(preset.colors, preset.darkColors);
      },
    }),
    {
      name: "ecommerce-theme",
    }
  )
);

function applyColorsToDOM(colors: ThemeColors, darkColors: ThemeColors) {
  const root = document.documentElement;

  // Apply light mode colors to :root
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-foreground", colors.accentForeground);
  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--card-foreground", colors.cardForeground);
  root.style.setProperty("--muted", colors.muted);
  root.style.setProperty("--muted-foreground", colors.mutedForeground);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
  root.style.setProperty("--ring", colors.primary);

  // Store dark colors as data attributes for dark mode toggling
  root.dataset.darkPrimary = darkColors.primary;
  root.dataset.darkPrimaryForeground = darkColors.primaryForeground;
  root.dataset.darkBackground = darkColors.background;
  root.dataset.darkForeground = darkColors.foreground;
}
