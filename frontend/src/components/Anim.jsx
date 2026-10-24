import { motion, AnimatePresence, animate, useInView } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, Fragment } from 'react';
import { ReceiptText, CookingPot, PartyPopper, CircleX, Check } from 'lucide-react';
import { useToast } from '../store/shop.js';

export const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

// Muncul halus saat di-scroll (hemat: sekali saja)
export function FadeIn({ children, className, delay = 0 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.35, delay }}>
      {children}
    </motion.div>
  );
}

// Grid yang muncul satu-satu
export function Stagger({ children, className, animateDirectly = false }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={animateDirectly ? "show" : undefined}
      whileInView={!animateDirectly ? "show" : undefined}
      viewport={!animateDirectly ? { once: true, margin: '-20px' } : undefined}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
    >
      {children}
    </motion.div>
  );
}
export function Item({ children, className }) {
  return <motion.div className={className} variants={fadeUp}>{children}</motion.div>;
}

// Maskot mengambang lucu
export function Float({ children }) {
  return (
    <motion.div animate={{ y: [0, -9, 0], rotate: [0, -2.5, 2.5, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}>
      {children}
    </motion.div>
  );
}

// Placeholder goyang saat loading
export function SkeletonCard() {
  return (
    <div className="card space-y-2 animate-pulse">
      <div className="h-32 rounded-2xl bg-caramel-light/60" />
      <div className="h-4 rounded-full bg-caramel-light/60 w-3/4" />
      <div className="h-4 rounded-full bg-caramel-light/60 w-1/2" />
    </div>
  );
}

// Angka berhitung naik (mis: omzet dashboard)
export function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, Number(value) || 0, { duration: 1.2, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return <span ref={ref}>{'Rp' + n.toLocaleString('id-ID')}</span>;
}

// Pita berjalan berisi kata-kata ceria
export function Marquee({ items }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden rounded-full bg-choco text-butter py-1.5 text-sm font-hand">
      <div className="marquee-track gap-6 px-3">
        {row.map((t, i) => <span key={i} className="whitespace-nowrap">{t} ✦</span>)}
      </div>
    </div>
  );
}
// Notifikasi kecil pengganti alert() — dipakai via useToast(s=>s.show)
export function Toaster() {
  const msg = useToast((s) => s.msg);
  return (
    <AnimatePresence>
      {msg && (
        <motion.div initial={{ opacity: 0, y: 24, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 12, x: '-50%' }}
          className="fixed bottom-24 md:bottom-8 left-1/2 z-50 card !bg-choco !text-white text-sm font-bold max-w-[92vw] text-center">
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Emoji yang menari: bounce | wiggle | spin | pulse | swing
const DANCES = {
  bounce: { y: [0, -11, 0] },
  wiggle: { rotate: [0, -16, 12, -7, 0] },
  spin: { rotate: 360 },
  pulse: { scale: [1, 1.3, 1] },
  swing: { rotate: [0, 13, -9, 0], y: [0, -5, 0] },
};
export function Bouncy({ children, anim = 'bounce', className }) {
  const dance = DANCES[anim] || DANCES.bounce;
  const slow = anim === 'spin';
  return (
    <motion.span className={`inline-block ${className || ''}`} animate={dance}
      transition={slow
        ? { duration: 3, repeat: Infinity, ease: 'linear' }
        : { duration: anim === 'wiggle' ? 1.1 : 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
      whileTap={{ scale: 1.5, rotate: -12 }}>
      {children}
    </motion.span>
  );
}

// Ledakan konfeti satu kali (fireKey berubah = meledak lagi)
export function ConfettiBurst({ fireKey }) {
  const parts = useMemo(() => {
    const colors = ['#E8A93D', '#FF8FA3', '#7ED6A5', '#FFD966', '#A8D8FF'];
    return Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2 + Math.random() * 0.4;
      const d = 70 + Math.random() * 100;
      return { x: Math.cos(a) * d, y: Math.sin(a) * d - 50, r: Math.random() * 540 - 270, c: colors[i % 5], s: 6 + Math.random() * 7 };
    });
  }, [fireKey]);
  if (!fireKey) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/4 z-50 flex justify-center">
      {parts.map((p, i) => (
        <motion.span key={`${fireKey}-${i}`}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.r, scale: 0.5 }}
          transition={{ duration: 1 + Math.random() * 0.6, ease: 'easeOut' }}
          style={{ width: p.s, height: p.s * 0.62, background: p.c, borderRadius: 2, position: 'absolute' }} />
      ))}
    </div>
  );
}

// Secangkir dessert mengepul — untuk status menunggu (ikon, bukan emoji)
export function SteamCup({ icon: Icon = CookingPot, label }) {
  return (
    <div className="flex flex-col items-center gap-0 py-1">
      <div className="steam" aria-hidden>{[0, 1, 2].map(i => <span key={i} style={{ animationDelay: `${i * 0.45}s` }} />)}</div>
      <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <Icon size={52} className="text-caramel-dark" />
      </motion.div>
      {label && <div className="text-xs font-bold opacity-70 mt-1">{label}</div>}
    </div>
  );
}

// Timeline status pesanan full-animasi: Diterima → Diproses → Selesai
const STEP_DEFS = [
  { key: 'PENDING', label: 'Diterima', Icon: ReceiptText },
  { key: 'PROCESSING', label: 'Diproses', Icon: CookingPot },
  { key: 'DONE', label: 'Selesai', Icon: PartyPopper },
];
export function OrderSteps({ status }) {
  if (status === 'CANCELLED') {
    return (
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="rounded-2xl bg-tomato/15 text-tomato font-bold p-3 text-center text-sm flex items-center justify-center gap-2">
        <motion.span animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 0.6, delay: 0.2 }} className="inline-flex">
          <CircleX size={22} />
        </motion.span>
        Pesanan dibatalkan. Chat WA untuk info.
      </motion.div>
    );
  }
  const idx = Math.max(0, STEP_DEFS.findIndex(s => s.key === status));
  return (
    <div className="flex items-start">
      {STEP_DEFS.map((s, i) => {
        const done = i < idx, cur = i === idx;
        return (
          <Fragment key={s.key}>
            {i > 0 && (
              <div className="flex-1 h-1.5 rounded-full bg-caramel-light/50 overflow-hidden mx-1 mt-[22px]">
                <motion.div className="h-full w-full bg-mint origin-left" initial={false}
                  animate={{ scaleX: i <= idx ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.25 }} />
              </div>
            )}
            <div className="flex flex-col items-center w-[68px] shrink-0">
              <motion.div
                initial={false}
                animate={cur ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={cur ? { repeat: Infinity, duration: 1.6 } : {}}
                className={`relative w-11 h-11 grid place-items-center rounded-full ${done || cur ? 'bg-caramel text-white' : 'bg-caramel-light/40 text-choco/40'}`}>
                {cur && (
                  <motion.span className="absolute inset-0 rounded-full border-[3px] border-caramel"
                    animate={{ scale: [1, 1.45], opacity: [0.9, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }} />
                )}
                <s.Icon size={22} />
                {done && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 grid place-items-center rounded-full bg-mint text-choco">
                    <Check size={13} strokeWidth={3.5} />
                  </motion.span>
                )}
              </motion.div>
              <span className={`text-[11px] font-bold mt-1 ${done || cur ? '' : 'opacity-45'}`}>{s.label}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// Centang sukses yang menggambar sendiri
export function CheckDraw({ size = 76 }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 72 72" initial="hidden" animate="show" className="mx-auto">
      <motion.circle cx="36" cy="36" r="31" fill="none" stroke="#7ED6A5" strokeWidth="5" strokeLinecap="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.6 } } }} />
      <motion.path d="M23 37 L32 46 L50 27" fill="none" stroke="#7ED6A5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.4, delay: 0.5 } } }} />
    </motion.svg>
  );
}
