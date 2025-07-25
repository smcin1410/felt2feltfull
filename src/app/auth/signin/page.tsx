"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (email === "admin@felt2felt.com") {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/admin",
      });
    } else {
      await signIn("email", { email, callbackUrl: "/" });
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-white">Sign in</h1>
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded border bg-neutral-800 text-[#39FF14] font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
        />
        {email === "admin@felt2felt.com" && (
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded border bg-neutral-800 text-[#39FF14] font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? (email === "admin@felt2felt.com" ? "Signing in..." : "Sending...") : "Sign In"}
        </button>
      </form>
    </main>
  );
} 