"use client";

/**
 * Composant Vue pour afficher du contenu HTML riche (venant de Quill).
 * Utilisé côté shop pour rendre la description du produit avec vidéos, images, etc.
 *
 * Les styles sont définis dans globals.css sous `.rich-content-renderer`.
 * On n'importe PAS le CSS Quill ici — nos styles custom suffisent pour l'affichage.
 */

interface RichContentRendererProps {
  /** Contenu HTML à afficher */
  content: string;
  /** Classes CSS additionnelles */
  className?: string;
}

export function RichContentRenderer({
  content,
  className = "",
}: RichContentRendererProps) {
  if (!content) return null;

  // Détecte si le contenu est du HTML riche ou du texte brut
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (!isHtml) {
    // Fallback pour les anciennes descriptions en texte brut
    return (
      <p className={`whitespace-pre-line ${className}`}>
        {content}
      </p>
    );
  }

  return (
    <div className={`rich-content-renderer ql-snow ${className}`}>
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ padding: 0 }}
      />
    </div>
  );
}
