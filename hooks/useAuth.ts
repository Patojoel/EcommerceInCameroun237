"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  };

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const requireAuth = (redirectTo: string = "/login") => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${window.location.pathname}`);
    }
  };

  const requireAdmin = () => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/");
    }
  };

  return {
    user: session?.user,
    session,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    loginWithGoogle,
    logout,
    requireAuth,
    requireAdmin,
  };
}
