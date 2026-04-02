import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header */}
      <header className="border-b bg-background">
        <div className="container h-14 flex items-center">
          <Link href="/" className="font-bold text-lg flex items-center gap-2">
            <span>🇨🇲</span>
            <span>Ecommerce237</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EcommerceInCameroun237
      </footer>
    </div>
  );
}
