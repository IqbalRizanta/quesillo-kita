import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api, getWhatsAppUrl } from '../lib/api.js';
import { useToast } from '../store/shop.js';
import { FadeIn, Bouncy } from '../components/Anim.jsx';
import { MapPin, Clock, Camera, MessageCircle, Send, Star, Heart } from 'lucide-react';

export default function Contact() {
  const { data: s } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data
  });

  const toast = useToast(t => t.show);
  const [f, setF] = useState({ name: '', rating: 5, message: '' });
  const [submitting, setSubmitting] = useState(false);

  const waNumber = s?.wa_number || '6281234567890';
  const chatWaUrl = getWhatsAppUrl(waNumber, 'Halo Quesillo.kita! Saya ingin bertanya informasi seputar produk & lokasi.');

  async function sendTestimonial(e) {
    e.preventDefault();
    if (!f.name.trim() || !f.message.trim()) {
      toast('Nama dan ulasan wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/testimonials', f);
      toast('Terima kasih! Ulasanmu berhasil dikirim.');
      setF({ name: '', rating: 5, message: '' });
    } catch (err) {
      toast(err.response?.data?.error || 'Gagal mengirim ulasan');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-4 space-y-5 max-w-lg mx-auto">
      <div className="text-center space-y-1">
        <h1 className="font-chubby font-extrabold text-2xl flex items-center justify-center gap-2 text-choco">
          Kontak & Lokasi <Bouncy><MapPin size={24} className="text-tomato" /></Bouncy>
        </h1>
        <p className="text-xs text-choco/75">
          Kunjungi toko kami atau hubungi kami langsung via WhatsApp.
        </p>
      </div>

      {/* Info Toko */}
      <div className="card text-sm space-y-3 border-2 border-caramel-light/50">
        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="text-tomato shrink-0 mt-0.5" />
            <div>
              <b className="block text-choco">Alamat Toko:</b>
              <span className="opacity-80 text-xs">{s?.address || 'Jakarta'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock size={18} className="text-caramel shrink-0 mt-0.5" />
            <div>
              <b className="block text-choco">Jam Buka:</b>
              <span className="opacity-80 text-xs">{s?.hours || 'Senin - Sabtu, 09.00 - 20.00 WIB'}</span>
            </div>
          </div>

          {s?.instagram_url && (
            <div className="flex items-start gap-2.5">
              <Camera size={18} className="text-berry shrink-0 mt-0.5" />
              <div>
                <b className="block text-choco">Instagram:</b>
                <a
                  className="underline text-xs text-caramel-dark font-bold hover:opacity-80"
                  href={s.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  @quesillo.kita
                </a>
              </div>
            </div>
          )}
        </div>

        <a
          className="btn-chubby bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-2 w-full shadow-soft"
          href={chatWaUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={17} /> Chat Langsung via WhatsApp
        </a>
      </div>

      {/* Form Testimoni Publik */}
      <FadeIn>
        <form onSubmit={sendTestimonial} className="card space-y-3 border-2 border-caramel-light/50">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-berry fill-berry" />
            <b className="font-chubby text-sm text-choco">Ceritakan Pengalaman Manismu!</b>
          </div>

          <div>
            <label className="lbl">Nama Lengkap</label>
            <input
              className="input text-sm"
              placeholder="Namamu"
              value={f.name}
              onChange={e => setF({ ...f, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="lbl">Rating Rasa</label>
            <select
              className="input text-sm"
              value={f.rating}
              onChange={e => setF({ ...f, rating: Number(e.target.value) })}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5/5) — Enak banget & lumer parah!</option>
              <option value={4}>⭐⭐⭐⭐ (4/5) — Enak dan manisnya pas</option>
              <option value={3}>⭐⭐⭐ (3/5) — Cukup enak</option>
            </select>
          </div>

          <div>
            <label className="lbl">Ulasan / Kesan</label>
            <textarea
              className="input text-sm"
              rows={3}
              placeholder="Gimana rasa Quesillo yang kamu coba?"
              value={f.message}
              onChange={e => setF({ ...f, message: e.target.value })}
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={submitting}
            className="btn-chubby bg-caramel text-white w-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft"
          >
            <Send size={15} /> {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </motion.button>
        </form>
      </FadeIn>
    </div>
  );
}
