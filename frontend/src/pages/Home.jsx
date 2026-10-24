import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, MessageCircle, Egg, Candy, Snowflake, Star, CakeSlice, PartyPopper, Sparkles, MapPin, Clock } from 'lucide-react';
import { api, getWhatsAppUrl } from '../lib/api.js';
import { Mascot, ProductCard } from '../components/Layout.jsx';
import { FadeIn, Stagger, Item, Float, SkeletonCard, Marquee, Bouncy } from '../components/Anim.jsx';

export default function Home() {
  const { data: s } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['public-products'],
    queryFn: async () => (await api.get('/products')).data
  });

  const { data: testi = [] } = useQuery({
    queryKey: ['testi'],
    queryFn: async () => (await api.get('/testimonials')).data
  });

  const waNumber = s?.wa_number || '6281234567890';
  const generalWaUrl = getWhatsAppUrl(waNumber, 'Halo Quesillo.kita! Saya mau pesan puding karamel.');

  return (
    <div className="space-y-6 pt-4">
      {/* Hero Banner */}
      <motion.section
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card relative bg-gradient-to-br from-butter/60 via-cream to-berry/20 overflow-hidden border-2 border-caramel-light/50"
      >
        <div className="blob w-28 h-28 bg-berry/30 -top-8 -right-8" />
        <div className="blob w-20 h-20 bg-mint/40 bottom-2 left-1/4" style={{ animationDelay: '1.8s' }} />

        <span className="badge-tilt bg-mint text-choco font-bold">
          {s?.hero_badge || 'Lumer di mulut!'}
        </span>

        <div className="flex flex-col md:flex-row items-center gap-4 mt-3">
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-chubby font-extrabold text-2xl md:text-3xl leading-tight bubble-text text-choco">
              {s?.hero_title || 'Quesillo Lumer Paling Ceria!'}
            </h1>
            <p className="text-sm mt-2 opacity-85 leading-relaxed max-w-lg">
              {s?.hero_subtitle || 'Dessert puding karamel khas Venezuela buatan rumahan. Manis legit, tekstur creamy lumer bikin senyum.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-4">
              <Link
                to="/menu"
                className="btn-chubby bg-caramel text-white text-xs md:text-sm flex items-center gap-1.5 shadow-soft hover:opacity-95"
              >
                Lihat Menu <Bouncy anim="wiggle"><CakeSlice size={17} /></Bouncy>
              </Link>
              <a
                href={generalWaUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-chubby bg-[#25D366] text-white text-xs md:text-sm flex items-center gap-1.5 shadow-soft hover:opacity-95"
              >
                <MessageCircle size={17} /> Pesan via WA
              </a>
            </div>
          </div>

          <div className="shrink-0 p-2">
            {s?.hero_image ? (
              <img
                src={s.hero_image}
                alt="Quesillo.kita Hero"
                className="w-36 h-36 md:w-44 md:h-44 rounded-3xl object-cover rotate-2 border-4 border-white shadow-soft"
              />
            ) : (
              <div className="rotate-2">
                <Float>
                  <Mascot size={130} />
                </Float>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Marquee Badge */}
      <Marquee items={['Puding Flan Venezuela', 'Creamy Lumer', '100% Karamel Asli', 'Freshly Made Daily', 'Manisnya Pas']} />

      {/* Promo Bar */}
      {s?.promo_text && (
        <div className="card relative overflow-hidden shine bg-choco text-butter font-hand text-base md:text-lg text-center flex items-center justify-center gap-2 shadow-soft">
          <PartyPopper size={20} className="shrink-0 text-butter" />
          <span>{s.promo_text}</span>
        </div>
      )}

      {/* 2 Menu Unggulan (Original & Matcha) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-chubby font-extrabold text-xl flex items-center gap-2 text-choco">
              Menu Favorit <Bouncy><Flame size={22} className="text-tomato" /></Bouncy>
            </h2>
            <p className="text-xs text-choco/70">Dua cita rasa legendaris yang selalu bikin ketagihan</p>
          </div>
          <Link to="/menu" className="text-xs font-bold text-caramel-dark underline hover:opacity-80">
            Detail Menu →
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(p => (
              <Item key={p.id || p.slug}>
                <ProductCard p={p} waNumber={waNumber} />
              </Item>
            ))}
          </Stagger>
        )}
      </section>

      {/* Brand Story (About) */}
      <FadeIn>
        <section className="card space-y-3 border-2 border-caramel-light/40">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-caramel" />
            <h2 className="font-chubby font-extrabold text-lg text-choco">
              {s?.about_title || 'Kenapa Harus Quesillo.kita?'}
            </h2>
          </div>
          <p className="text-sm opacity-85 leading-relaxed">
            {s?.about_text || 'Kami membuat Quesillo rumahan autentik khas Venezuela dengan resep istimewa menggunakan telur segar, susu murni, dan karamel alami.'}
          </p>

          <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs font-bold">
            <div className="rounded-2xl bg-butter/50 p-3 flex flex-col items-center gap-1.5 shadow-sm">
              <Bouncy><Egg size={22} className="text-caramel-dark" /></Bouncy>
              <span>Telur Segar</span>
            </div>
            <div className="rounded-2xl bg-berry/20 p-3 flex flex-col items-center gap-1.5 shadow-sm">
              <Bouncy anim="swing"><Candy size={22} className="text-berry" /></Bouncy>
              <span>Karamel Alami</span>
            </div>
            <div className="rounded-2xl bg-mint/30 p-3 flex flex-col items-center gap-1.5 shadow-sm">
              <Bouncy anim="pulse"><Snowflake size={22} className="text-mint" /></Bouncy>
              <span>Tanpa Pengawet</span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Testimoni Pelanggan */}
      <FadeIn>
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-chubby font-extrabold text-lg flex items-center gap-2 text-choco">
              Kata Mereka <Bouncy anim="swing"><MessageCircle size={20} className="text-caramel" /></Bouncy>
            </h2>
            <Link to="/kontak" className="text-xs font-bold text-caramel-dark underline">
              Beri Ulasan
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {testi.slice(0, 3).map(t => (
              <div key={t.id} className="card text-sm space-y-1.5 bg-white border border-caramel-light/50">
                <div className="flex items-center justify-between">
                  <b className="font-chubby text-choco">{t.name}</b>
                  <span className="inline-flex gap-0.5">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={13} className="fill-butter text-caramel-dark" />
                    ))}
                  </span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed italic">"{t.message}"</p>
              </div>
            ))}
            {!testi.length && (
              <div className="card text-xs text-choco/70 col-span-full text-center py-4">
                Belum ada ulasan yang ditampilkan. Jadilah yang pertama memberikan testimoni di halaman Kontak!
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      {/* Banner Lokasi & Jam Buka */}
      <FadeIn>
        <section className="card bg-butter/30 border-2 border-caramel-light/60 flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="space-y-1 text-center sm:text-left">
            <b className="font-chubby text-base text-choco block">Siap Manjakan Harimu?</b>
            <div className="text-xs opacity-80 flex items-center justify-center sm:justify-start gap-1">
              <Clock size={14} /> {s?.hours || 'Senin - Sabtu, 09.00 - 20.00 WIB'}
            </div>
            <div className="text-xs opacity-80 flex items-center justify-center sm:justify-start gap-1">
              <MapPin size={14} /> {s?.address || 'Jakarta'}
            </div>
          </div>
          <a
            href={generalWaUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-chubby bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-soft"
          >
            <MessageCircle size={16} /> Chat & Pesan Sekarang
          </a>
        </section>
      </FadeIn>
    </div>
  );
}
