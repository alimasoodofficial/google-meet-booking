"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth for demo purposes
    // Real auth would happen here via Supabase or similar
    setTimeout(() => {
      router.push("/admin/dashboard");
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="p-6 relative z-10">
        <BackButton />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Admin Access</h1>
            <p className="text-slate-500 font-medium">Verify your credentials to manage the portal.</p>
          </div>

          <div className="glass-card p-10 shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary rounded-full -mt-0.5" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="admin@veltolabs.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
              <button type="button" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">Forgot Password?</button>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Secure Session</div>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-400 text-sm font-medium leading-relaxed">
            By signing in, you agree to our <span className="text-slate-600 underline">Terms of Service</span> and <span className="text-slate-600 underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </main>
  );
}
