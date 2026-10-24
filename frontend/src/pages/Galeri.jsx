import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { Mascot } from '../components/Layout.jsx';
import { Stagger, Item, Bouncy } from '../components/Anim.jsx';
import { Images } from 'lucide-react';
import { useState } from 'react';

function GalleryCard({ g }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="card !p-2 flex flex-col border border-caramel-light/60 shadow-sm"
    >
      <div className="relative h-40 w-full rounded-2xl bg-butter/30 overflow-hidden flex items-center justify-center">
        {g.imageUrl && !imgError ? (
          <img
            src={g.imageUrl}
            alt={g.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover rounded-2xl transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full grid place-items-center rounded-2xl bg-butter/40">
            <Mascot size={64} />
          </div>
        )}
      </div>
      <div className="text-xs font-bold text-center py-2 text-choco truncate px-1">
        {g.title}
      </div>
    </motion.div>
  );
}

export default function Galeri() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['galeri'],
    queryFn: async () => (await api.get('/galleries')).data
  });

  return (
    <div className="pt-4 space-y-4">
      <div className="text-center space-y-1">
        <h1 className="font-chubby font-extrabold text-2xl bubble-text flex items-center justify-center gap-2 text-choco">
          Galeri Manis <Bouncy anim="spin"><Images size={24} className="text-caramel" /></Bouncy>
        </h1>
        <p className="text-sm opacity-70">Gambar 100% Real Product</p>
      </div>

      {/* Loading Skeleton: Menghindari flash kosong & bug animasi */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="card !p-2 space-y-2 animate-pulse">
              <div className="h-40 rounded-2xl bg-caramel-light/50" />
              <div className="h-3 bg-caramel-light/50 rounded-full w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Galeri Konten: Render hanya saat data siap agar animasi langsung aktif */}
      {!isLoading && data.length > 0 && (
        <Stagger key={data.length} className="grid grid-cols-2 gap-3" animateDirectly={true}>
          {data.map(g => (
            <Item key={g.id}>
              <GalleryCard g={g} />
            </Item>
          ))}
        </Stagger>
      )}

      {/* Pesan jika benar-benar kosong setelah loading selesai */}
      {!isLoading && !data.length && (
        <div className="card text-center text-sm py-8 text-choco/75">
          Belum ada foto galeri yang ditampilkan.
        </div>
      )}
    </div>
  );
}
