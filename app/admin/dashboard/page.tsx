import { getAvailability, getBookings } from '@/app/actions/availability';
import AvailabilitySetter from '@/components/admin/AvailabilitySetter';
import BookingsList from '@/components/admin/BookingsList';
import BackButton from '@/components/BackButton';
import { ShieldCheck, LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let availability: any[] = [];
  let bookings: any[] = [];
  let error: string | null = null;

  try {
    const [availData, bookData] = await Promise.all([
      getAvailability(),
      getBookings()
    ]);
    availability = availData || [];
    bookings = bookData || [];
  } catch (e: any) {
    console.error('Admin Dashboard Fetch Error:', e);
    error = e.message || 'Failed to connect to Supabase. Please check your API keys in .env.local';
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-8">
        <div className="max-w-md w-full glass-card p-10 text-center border-t-8 border-red-500 shadow-2xl">
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Configuration Error</h1>
          <p className="text-red-600 mb-8 font-semibold">{error}</p>
          <div className="text-left text-sm text-slate-500 space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100 italic-none">
            <p className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Technical Recovery:</p>
            <ul className="space-y-2 font-medium">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Verify <code>NEXT_PUBLIC_SUPABASE_URL</code></li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Check <code>SUPABASE_SERVICE_ROLE_KEY</code></li>
            </ul>
          </div>
          <button onClick={() => window.location.reload()} className="btn-primary w-full mt-8">Retry Connection</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-sm">
            <ShieldCheck className="w-5 h-5" />
            Admin Secured
          </div>
        </div>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl"><LayoutDashboard className="w-8 h-8 text-primary" /></div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
            Configure your professional availability and oversee upcoming sessions from a central command center.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-16">
          <section className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full" />
              Availability Management
            </h2>
            <div className="glass-card p-1 shadow-xl">
              <AvailabilitySetter initialSlots={availability || []} />
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full" />
              Upcoming Bookings
            </h2>
            <div className="glass-card shadow-xl overflow-hidden">
              <BookingsList bookings={bookings || []} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
