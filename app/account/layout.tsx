import { ShopLayout } from "@/components/layout/ShopLayout";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopLayout>{children}</ShopLayout>;
}
