import Link from 'next/link';
import { MOCK_RESTAURANTS } from '@/lib/mock-data';
import { ArrowRight, QrCode, Smartphone } from 'lucide-react';

export default function HomePage() {
  const restaurants = Object.values(MOCK_RESTAURANTS).map((item) => item.restaurant);

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-stone-200 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-stone-100 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5 text-amber-600" />
            NFC & QR Digital Menu Engine
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Multi-Restaurant Platform
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
            Select a sample restaurant below to test the white-label customer menu view.
          </p>
        </div>

        {/* Demo Restaurants List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Active Demo Restaurants
          </h2>

          {restaurants.map((rest) => (
            <Link
              key={rest.id}
              href={`/menu/${rest.slug}`}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden bg-cover bg-center shrink-0 border border-stone-200"
                  style={{ backgroundImage: `url(${rest.logo})` }}
                />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {rest.name}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Path: <code className="text-amber-700 font-mono">/menu/{rest.slug}</code>
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {/* Technical Architecture Info */}
        <div className="p-4 rounded-2xl bg-stone-900 text-stone-300 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold">
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>NFC / QR Dynamic Route Architecture</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-normal">
            Customers scanning NFC chips or QR codes are routed directly to <code className="text-amber-300">/menu/[restaurantSlug]</code>. The system dynamically loads that restaurant&apos;s branding, colors, categories, and menu items.
          </p>
        </div>
      </div>
    </main>
  );
}
