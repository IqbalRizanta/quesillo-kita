import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api, getWhatsAppUrl } from '../lib/api.js';
import { ProductCard } from '../components/Layout.jsx';
import { Stagger, Item, SkeletonCard, Bouncy } from '../components/Anim.jsx';
import { CakeSlice, MessageCircle, Sparkles } from 'lucide-react';

export default function Menu() {
  const [q, setQ] = useState('');
  const { data: s } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ['products', q],
    queryFn: async () => (await api.get(`/products?search=${encodeURIComponent(q)}`)).data
  });

  const waNumber = s?.wa_number || '6281234567890';
  const customOrderWa = getWhatsAppUrl(waNumber, 'Halo Quesillo.kita! Saya ingin custom order / pemesanan dalam jumlah banyak.');

  return (
    <div className="pt-4 space-y-5">
      <div className="text-center space-y-1">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-chubby font-extrabold text-2xl bubble-text flex items-center justify-center gap-2 text-choco"
        >
          Menu Ceria Quesillo <Bouncy anim="wiggle"><CakeSlice size={26} /></Bouncy>
        </motion.h1>
        <p className="text-xs text-choco/75 max-w-md mx-auto">
          Dessert puding karamel rumahan dibuat dari susu murni dan telur pilihan. Pilih varian favoritmu dan pesan langsung via WhatsApp!
        </p>
      </div>

      <div className="relative">
        <input
          className="input !py-2.5 text-sm"
          placeholder="Cari varian rasa (original, matcha)..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!isLoading && (
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map(p => (
            <Item key={p.slug || p.id}>
              <ProductCard p={p} waNumber={waNumber} />
            </Item>
          ))}
        </Stagger>
      )}

      {!isLoading && !data.length && (
        <div className="card text-center text-sm py-6 space-y-2">
          <p>Varian yang dicari belum tersedia.</p>
          <button
            onClick={() => setQ('')}
            className="text-xs font-bold text-caramel-dark underline"
          >
            Tampilkan semua menu
          </button>
        </div>
      )}

      {/* Info Tambahan Pemesanan Khusus */}
      <div className="card bg-butter/30 border border-caramel-light p-4 text-center space-y-2">
        <b className="font-chubby text-sm flex items-center justify-center gap-1.5 text-choco">
          <Sparkles size={16} className="text-caramel" /> Butuh Pesanan Jumlah Banyak / Acara?
        </b>
        <p className="text-xs opacity-80 max-w-md mx-auto">
          Kami melayani pesanan untuk arisan, ulang tahun, hampers, maupun acara kantor dengan packaging spesial.
        </p>
        <a
          href={customOrderWa}
          target="_blank"
          rel="noreferrer"
          className="btn-chubby bg-[#25D366] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
        >
          <MessageCircle size={15} /> Konsultasi Pesanan via WhatsApp
        </a>
      </div>
    </div>
  );
}
