import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, CakeSlice, TicketPercent, Images, MessageCircle, MapPin, Lock, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, getWhatsAppUrl, getProductOrderWaUrl, rupiah } from '../lib/api.js';
import { Toaster, Bouncy } from './Anim.jsx';

export function Mascot({ size = 84 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Maskot puding Quesillo">
      <ellipse cx="50" cy="82" rx="30" ry="8" fill="#000" opacity=".08" />
      <path d="M20 55 Q20 30 50 30 Q80 30 80 55 L76 78 Q50 88 24 78 Z" fill="#FFD966" stroke="#5C3D2E" strokeWidth="3" />
      <path d="M20 55 Q35 48 50 55 Q65 62 80 55 L80 62 Q65 69 50 62 Q35 55 20 62 Z" fill="#E8A93D" />
      <circle cx="38" cy="62" r="4" fill="#5C3D2E" />
      <circle cx="62" cy="62" r="4" fill="#5C3D2E" />
      <path d="M42 70 Q50 76 58 70" stroke="#5C3D2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="68" r="4" fill="#FF8FA3" opacity=".7" />
      <circle cx="70" cy="68" r="4" fill="#FF8FA3" opacity=".7" />
    </svg>
  );
}

export function ProductCard({ p, waNumber }) {
  const waUrl = getProductOrderWaUrl(p, waNumber);

  return (
    <motion.div
      className="card flex flex-col gap-2 hover:shadow-md transition-shadow"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-butter/40">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            loading="lazy"
            className="h-36 w-full object-cover rounded-2xl hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="h-36 w-full grid place-items-center">
            <Mascot size={70} />
          </div>
        )}
        {p.isBestSeller && (
          <span className="badge-tilt absolute top-2 left-2 bg-berry text-white shadow-sm">
            ⭐ Favorit
          </span>
        )}
      </div>

      <Link to={`/menu/${p.slug}`} className="font-chubby font-bold text-base hover:text-caramel-dark transition line-clamp-1">
        {p.name}
      </Link>
      <p className="text-xs opacity-75 line-clamp-2 leading-relaxed min-h-[2.5rem]">
        {p.description}
      </p>

      <div className="mt-auto pt-2 border-t border-caramel-light/40 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-chubby font-extrabold text-base text-choco">
            {rupiah(p.price)}
          </span>
          <span className="text-[11px] font-bold text-mint bg-mint/15 px-2.5 py-0.5 rounded-full">
            Fresh Daily
          </span>
        </div>

        <motion.a
          whileTap={{ scale: 0.94 }}
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-chubby bg-[#25D366] text-white !py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageCircle size={15} /> Pesan via WhatsApp
        </motion.a>
      </div>
    </motion.div>
  );
}

export default function Layout({ children }) {
  const loc = useLocation();
  const { data: settings, isError: settingsError } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data
  });
  const apiDown = settingsError && !settings;

  const wa = settings?.wa_number || '6281234567890';
  const waChatUrl = getWhatsAppUrl(wa, 'Halo Quesillo.kita! Saya ingin bertanya dan memesan puding karamel.');

  const tab = (to, label, Icon) => {
    const active = loc.pathname === to || (to !== '/' && loc.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`relative flex flex-col items-center text-[11px] py-2 px-1 rounded-2xl min-w-0 ${
          active ? 'text-white font-bold' : 'text-choco'
        }`}
      >
        {active && (
          <motion.span
            layoutId="tab-pill"
            className="absolute inset-0 bg-caramel rounded-2xl"
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        )}
        <motion.span whileTap={{ scale: 1.3, rotate: -8 }} className="relative">
          <Icon size={20} />
        </motion.span>
        <span className="relative">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0 overflow-x-clip bg-cream">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b-2 border-caramel-light/60">
        <div className="max-w-md md:max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-chubby font-extrabold text-lg tracking-wide hover:opacity-90">
            <Mascot size={36} />
            <span className="text-choco">Quesillo.kita</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <Link to="/" className="hover:text-caramel-dark transition">Home</Link>
            <Link to="/menu" className="hover:text-caramel-dark transition">Menu</Link>
            <Link to="/promo" className="hover:text-caramel-dark transition">Promo</Link>
            <Link to="/galeri" className="hover:text-caramel-dark transition">Galeri</Link>
            <Link to="/tentang" className="hover:text-caramel-dark transition">Tentang</Link>
            <Link to="/kontak" className="hover:text-caramel-dark transition">Kontak</Link>
          </nav>

          {/* Desktop WhatsApp CTA Button */}
          <a
            href={waChatUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 btn-chubby bg-[#25D366] text-white text-xs font-bold shadow-soft hover:opacity-95"
          >
            <MessageCircle size={16} /> Chat & Pesan
          </a>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        key={loc.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16 }}
        className="flex-1 max-w-md md:max-w-5xl mx-auto px-4 w-full"
      >
        {apiDown && (
          <div className="card mt-3 !bg-tomato/10 border-2 border-tomato/40 text-sm">
            <b>⚠️ Backend tidak terhubung.</b> Pastikan backend berjalan di port 3000, lalu refresh halaman ini.
          </div>
        )}
        {children}
      </motion.main>

      {/* Floating WhatsApp Button (Mobile & Tablet) */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={waChatUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Hubungi WhatsApp"
        className="fixed bottom-20 md:bottom-6 right-4 z-40 rounded-full bg-[#25D366] text-white font-bold px-5 py-3 shadow-lg flex items-center gap-2"
      >
        <MessageCircle size={20} />
        <span className="text-sm">Pesan via WA</span>
      </motion.a>

      {/* Footer & Discreet Admin Login Link */}
      <footer className="mt-12 py-8 bg-white border-t border-caramel-light/60 text-center text-xs text-choco/75">
        <div className="max-w-md md:max-w-5xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 font-chubby font-bold text-sm text-choco">
            <Mascot size={28} /> Quesillo.kita — Dessert Karamel Rumahan
          </div>
          <p className="max-w-md mx-auto text-xs opacity-80">
            {settings?.footer_note || 'Dibuat dengan cinta untuk para penikmat dessert karamel lumer sejati.'}
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 text-[11px] opacity-70">
            <span>© {new Date().getFullYear()} Quesillo.kita</span>
            <span>•</span>
            {/* Pintu Masuk Rahasia / Tersembunyi untuk Admin */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 hover:text-caramel-dark hover:underline transition"
              title="Panel Kelola Admin"
            >
              <Lock size={11} /> Kelola Toko
            </Link>
          </div>
        </div>
      </footer>

      {/* Bottom Nav on Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t-2 border-caramel-light/70 px-2 py-1 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {tab('/', 'Home', Home)}
          {tab('/menu', 'Menu', CakeSlice)}
          {tab('/promo', 'Promo', TicketPercent)}
          {tab('/galeri', 'Galeri', Images)}
          {tab('/kontak', 'Kontak', MapPin)}
        </div>
      </nav>

      <Toaster />
    </div>
  );
}
