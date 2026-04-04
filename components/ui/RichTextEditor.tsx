"use client";

import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { useRichTextEditor } from "@/hooks/useRichTextEditor";
import "react-quill-new/dist/quill.snow.css";

// Quill doit être importé dynamiquement car il accède à `document`
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] w-full rounded-md border bg-muted/30 animate-pulse flex items-center justify-center text-sm text-muted-foreground">
      Chargement de l&apos;éditeur...
    </div>
  ),
});

interface RichTextEditorProps {
  /** Valeur HTML actuelle */
  value: string;
  /** Callback appelé quand le contenu change */
  onChange: (value: string) => void;
  /** Label affiché au-dessus de l'éditeur */
  label?: string;
  /** Placeholder quand l'éditeur est vide */
  placeholder?: string;
  /** Message d'erreur de validation */
  error?: string;
}

/**
 * Composant éditeur de texte riche basé sur Quill.
 * Ce composant est la VUE uniquement — la logique est dans useRichTextEditor.
 */
export function RichTextEditor({
  value,
  onChange,
  label = "Description",
  placeholder = "Décrivez le produit en détail...",
  error,
}: RichTextEditorProps) {
  const { modules, formats } = useRichTextEditor();

  return (
    <div className="space-y-2">
      {label && <Label>{label} *</Label>}
      <div
        className={`rich-text-editor-wrapper rounded-md border ${
          error
            ? "border-destructive ring-1 ring-destructive"
            : "border-input"
        }`}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
