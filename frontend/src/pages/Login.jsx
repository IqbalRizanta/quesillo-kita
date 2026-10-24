import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { useAuth, useToast } from '../store/shop.js';
import { Lock, LogIn, ChefHat } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuth(s => s.login);
  const toast = useToast(s => s.show);
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      toast(`Selamat datang kembali, ${data.user.name}!`);
      nav('/admin', { replace: true });
    } catch (err) {
      toast(err.response?.data?.error || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-8 max-w-sm mx-auto">
      <form onSubmit={handleLogin} className="card space-y-4 border-2 border-caramel-light/60 shadow-soft">
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-butter/40 text-choco mb-1">
            <ChefHat size={32} />
          </div>
          <h1 className="font-chubby font-extrabold text-xl text-choco flex items-center justify-center gap-1.5">
            Portal Admin Quesillo
          </h1>
          <p className="text-xs text-choco/70">
            Masuk untuk mengelola produk, foto, promo, dan tampilan website.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="lbl">Email Administrator</label>
            <input
              className="input text-sm"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@quesillo.local"
              required
            />
          </div>

          <div>
            <label className="lbl">Kata Sandi</label>
            <input
              className="input text-sm"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={loading}
          className="btn-chubby bg-caramel text-white w-full text-sm font-bold flex items-center justify-center gap-2 shadow-soft mt-2"
        >
          {loading ? 'Memverifikasi...' : <><LogIn size={16} /> Masuk ke Panel</>}
        </motion.button>
      </form>
    </div>
  );
}
