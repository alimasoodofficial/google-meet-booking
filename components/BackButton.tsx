"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`group inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors ${className}`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-sm">
        <ChevronLeft className="w-5 h-5" />
      </div>
      <span>Back</span>
    </button>
  );
}
