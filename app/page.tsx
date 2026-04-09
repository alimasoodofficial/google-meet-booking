import Link from "next/link";
import { ArrowRight, Calendar, Settings, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Next-Gen Booking System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
          Schedule Meetings with <span className="text-primary">Precision.</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          The ultimate high-end booking solution for professionals. Includes automatic Google Meet integration, 
          real-time availability, and a premium administrative dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/book"
            className="w-full sm:w-auto btn-primary text-lg py-5 px-10 flex items-center justify-center gap-3 active:scale-95 duration-200"
          >
            <Calendar className="w-6 h-6" />
            Book a Meeting
            <ArrowRight className="w-6 h-6" />
          </Link>
          
          <Link
            href="/admin/signin"
            className="w-full sm:w-auto btn-secondary text-lg py-5 px-10 flex items-center justify-center gap-3 active:scale-95 duration-200"
          >
            <Settings className="w-6 h-6" />
            Admin Dashboard
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-10 text-left hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Google Meet</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Automatic meeting link generation and seamless calendar syncing for global teams.</p>
          </div>
          
          <div className="glass-card p-10 text-left hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Instant Sync</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Set recurring weekly slots and handle real-time concurrency with zero latency.</p>
          </div>
          
          <div className="glass-card p-10 text-left hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Secure Edge</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Built on Supabase for enterprise-grade security and reliable data management.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
