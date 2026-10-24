import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { api, rupiah, getProductOrderWaUrl } from '../lib/api.js';
import { Mascot } from '../components/Layout.jsx';

export default function Detail() {
  const { slug } = useParams();

  const { data: s } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data
  });

  const { data: p, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => (await api.get(`/products/${slug}`)).data
  });

  if (isLoading) {
    return <div className="card mt-6 text-sm text-center py-8">Memuat informasi produk...</div>;
  }

  if (!p) {
    return (
      <div className="card mt-6 text-center py-8 space-y-3">
        <p className="text-sm font-bold">Produk tidak ditemukan atau belum aktif.</p>
        <Link to="/menu" className="btn-chubby bg-caramel text-white text-xs inline-block">
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  const waNumber = s?.wa_number || '6281234567890';
  const orderWaUrl = getProductOrderWaUrl(p, waNumber);

  return (
    <div className="pt-4 space-y-4 max-w-xl mx-auto">
      <Link to="/menu" className="text-xs font-bold text-choco hover:text-caramel-dark flex items-center gap-1">
        <ArrowLeft size={16} /> Kembali ke Menu
      </Link>

      <div className="card space-y-4 border-2 border-caramel-light/50">
        <div className="relative overflow-hidden rounded-2xl bg-butter/40">
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full h-64 object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-64 grid place-items-center">
              <Mascot size={120} />
            </div>
          )}
          {p.isBestSeller && (
            <span className="badge-tilt absolute top-3 left-3 bg-berry text-white shadow-sm font-bold">
              ⭐ Best Seller
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-butter/60 text-choco">
              Kategori: {p.category || 'Flan Dessert'}
            </span>
            <span className="text-xs font-bold text-mint bg-mint/15 px-2.5 py-1 rounded-full">
              Tersedia Hari Ini
            </span>
          </div>

          <h1 className="font-chubby font-extrabold text-2xl text-choco">{p.name}</h1>
          <div className="font-chubby font-extrabold text-xl text-caramel-dark">
            {rupiah(p.price)}
          </div>
          <p className="text-sm text-choco/80 leading-relaxed pt-1">
            {p.description}
          </p>
        </div>

        {/* Keistimewaan Bahan */}
        <div className="p-3 bg-cream rounded-2xl border border-caramel-light/60 space-y-2 text-xs">
          <b className="font-chubby text-choco flex items-center gap-1.5">
            <Sparkles size={14} className="text-caramel" /> Karakteristik Rasa
          </b>
          <div className="grid grid-cols-2 gap-2 text-choco/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-mint shrink-0" />
              <span>Tekstur super lumer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-mint shrink-0" />
              <span>Saus karamel legit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-mint shrink-0" />
              <span>Tanpa pemanis buatan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-mint shrink-0" />
              <span>Tanpa pengawet</span>
            </div>
          </div>
        </div>

        {/* Direct Order WhatsApp CTA */}
        <motion.a
          whileTap={{ scale: 0.95 }}
          href={orderWaUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-chubby bg-[#25D366] text-white w-full flex items-center justify-center gap-2 text-sm font-bold shadow-soft"
        >
          <MessageCircle size={18} /> Pesan {p.name} via WhatsApp
        </motion.a>
      </div>
    </div>
  );
}
