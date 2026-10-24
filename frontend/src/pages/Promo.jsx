import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api, getWhatsAppUrl } from '../lib/api.js';
import { Mascot } from '../components/Layout.jsx';
import { Stagger, Item, FadeIn, Bouncy } from '../components/Anim.jsx';
import { TicketPercent, MessageCircle, Sparkles } from 'lucide-react';

export default function Promo() {
  const { data: s } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data
  });

  const { data } = useQuery({
    queryKey: ['promos'],
    queryFn: async () => (await api.get('/promos')).data
  });

  const waNumber = s?.wa_number || '6281234567890';
  const banners = data?.banners || [];

  return (
    <div className="pt-4 space-y-4">
      <div className="text-center space-y-1">
        <h1 className="font-chubby font-extrabold text-2xl bubble-text flex items-center justify-center gap-2 text-choco">
          Promo Ceria <Bouncy anim="pulse"><TicketPercent size={26} /></Bouncy>
        </h1>
        <p className="text-xs text-choco/75">
          Nikmati penawaran spesial dessert Quesillo favoritmu hari ini!
        </p>
      </div>

      {data?.promo_text && (
        <div className="card relative overflow-hidden shine bg-choco text-butter font-hand text-base md:text-lg text-center flex items-center justify-center gap-2 shadow-soft">
          <Sparkles size={20} className="shrink-0 text-butter" />
          <span>{data.promo_text}</span>
        </div>
      )}

      <Stagger className="space-y-3">
        {banners.map(b => (
          <Item key={b.id}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="card flex flex-col sm:flex-row items-center gap-4 border border-caramel-light/60"
            >
              <div className="shrink-0 overflow-hidden rounded-2xl w-full sm:w-28 h-28 bg-butter/40 flex items-center justify-center">
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <Mascot size={70} />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <b className="font-chubby text-base text-choco block">{b.title}</b>
                <p className="text-xs text-choco/70">
                  Klaim promo ini sekarang melalui admin WhatsApp kami.
                </p>
                <a
                  href={getWhatsAppUrl(waNumber, `Halo Quesillo.kita! Saya mau klaim promo: ${b.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-chubby bg-[#25D366] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle size={15} /> Klaim via WhatsApp
                </a>
              </div>
            </motion.div>
          </Item>
        ))}

        {!banners.length && (
          <div className="card text-sm text-center py-8 text-choco/75">
            Belum ada banner promo aktif. Pantau terus Instagram kami untuk promo menarik lainnya!
          </div>
        )}
      </Stagger>

      <FadeIn>
        <div className="card text-xs text-center opacity-80 bg-butter/25">
          💡 Syarat & ketentuan promo berlaku. Hubungi kami via WhatsApp untuk detail selengkapnya.
        </div>
      </FadeIn>
    </div>
  );
}
