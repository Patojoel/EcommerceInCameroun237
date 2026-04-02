import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/profile");

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mon profil</h1>
      <ProfileForm
        user={{
          name: session.user?.name ?? "",
          email: session.user?.email ?? "",
          image: session.user?.image ?? "",
        }}
      />
    </div>
  );
}
