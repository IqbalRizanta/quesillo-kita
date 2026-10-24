import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { Mascot } from '../components/Layout.jsx';
import { Stagger, Item, Bouncy } from '../components/Anim.jsx';
import { Images } from 'lucide-react';

export default function Galeri() {
  const { data = [] } = useQuery({ queryKey: ['galeri'], queryFn: async () => (await api.get('/galleries')).data });
  return (
    <div className="pt-4 space-y-3">
      <h1 className="font-chubby font-semibold text-xl bubble-text flex items-center gap-2">Galeri Manis <Bouncy anim="spin"><Images size={24} /></Bouncy></h1>
      <p className="text-sm opacity-70">Semua foto bisa diganti admin dari dashboard tanpa coding.</p>
      <Stagger className="grid grid-cols-2 gap-3">
        {data.map(g => (
          <Item key={g.id}>
          <motion.div whileHover={{ rotate: 1.5, scale: 1.03 }} whileTap={{ scale: 0.95 }} className="card !p-2">
            {g.imageUrl ? <img src={g.imageUrl} alt={g.title} loading="lazy" className="h-36 w-full rounded-2xl object-cover" /> : <div className="h-36 grid place-items-center rounded-2xl bg-butter/50"><Mascot size={64} /></div>}
            <div className="text-xs font-bold text-center py-1">{g.title}</div>
          </motion.div>
          </Item>
        ))}
      </Stagger>
      {!data.length && <div className="card text-sm">Galeri kosong.</div>}
    </div>
  );
}
