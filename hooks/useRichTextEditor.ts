import { useCallback, useMemo } from "react";

/**
 * Hook de logique métier pour l'éditeur de texte riche (Quill).
 * Sépare la configuration et la logique de transformation du rendu.
 */
export function useRichTextEditor() {
  /**
   * Modules Quill : configuration de la toolbar et des fonctionnalités.
   * Inclut support vidéo, images, liens, etc.
   */
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    []
  );

  /**
   * Formats supportés par l'éditeur.
   */
  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "list",
      "bullet",
      "align",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
    ],
    []
  );

  /**
   * Nettoie le HTML vide produit par Quill (ex: "<p><br></p>").
   * Retourne une string vide si le contenu est considéré comme vide.
   */
  const sanitizeHtml = useCallback((html: string): string => {
    if (!html) return "";
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length === 0 ? "" : html;
  }, []);

  /**
   * Vérifie si le contenu HTML est réellement vide.
   */
  const isContentEmpty = useCallback((html: string): boolean => {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length === 0;
  }, []);

  /**
   * Extrait le texte brut du HTML (utile pour les meta descriptions, aperçus, etc.)
   */
  const extractPlainText = useCallback(
    (html: string, maxLength?: number): string => {
      if (!html) return "";
      const text = html.replace(/<[^>]*>/g, "").trim();
      if (maxLength && text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
      }
      return text;
    },
    []
  );

  return {
    modules,
    formats,
    sanitizeHtml,
    isContentEmpty,
    extractPlainText,
  };
}
