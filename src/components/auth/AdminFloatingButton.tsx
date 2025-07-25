"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function AdminFloatingButton() {
  const { data: session, status } = useSession();

  if (
    status !== "authenticated" ||
    (session?.user && (session.user as any).role !== "admin")
  ) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="fixed bottom-6 right-6 z-50 bg-black/80 hover:bg-black text-white rounded-full p-4 shadow-lg border border-white/20 transition-colors duration-200 flex items-center justify-center"
      aria-label="Admin Panel"
    >
      <Shield className="w-6 h-6" />
    </Link>
  );
} 