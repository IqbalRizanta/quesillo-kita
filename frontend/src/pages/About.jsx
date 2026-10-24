import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { api } from '../lib/api.js';
import { Mascot } from '../components/Layout.jsx';
import { Bouncy } from '../components/Anim.jsx';

export default function About() {
  const { data: s } = useQuery({ queryKey: ['settings'], queryFn: async () => (await api.get('/settings')).data });
  return (
    <div className="pt-4 space-y-3">
      <h1 className="font-chubby font-extrabold text-xl flex items-center gap-2">Tentang Kami <Bouncy anim="pulse"><Heart size={22} className="fill-berry text-berry" /></Bouncy></h1>
      <div className="card text-sm space-y-2">
        {s?.about_image ? <img src={s.about_image} className="rounded-2xl w-full h-44 object-cover" alt="about" /> : <div className="grid place-items-center py-4"><Mascot size={90} /></div>}
        <b>{s?.about_title}</b><p className="opacity-80">{s?.about_text}</p>
      </div>
    </div>
  );
}
