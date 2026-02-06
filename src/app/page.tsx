"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      router.push("/products");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transition-transform hover:scale-105">
            <LayoutDashboard className="text-primary-foreground w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Anadu Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back, please log in to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="text-xs font-semibold text-gray-700"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="text-xs font-semibold text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center mt-8 text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-bold text-primary hover:text-primary/80 uppercase tracking-widest"
            >
              Contact Admin
            </a>
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
            &copy; 2026 Anadu Product Management
          </p>
        </div>
      </div>
    </div>
  );
}
