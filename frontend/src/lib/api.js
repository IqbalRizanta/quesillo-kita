import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 menit cache
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export const api = axios.create({ baseURL: '/api' });

// Pasang Bearer token admin jika tersedia
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('q_admin_token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Interceptor response
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('q_admin_token');
    }
    return Promise.reject(err);
  }
);

export const rupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

// Helper URL WhatsApp interaktif untuk pemesanan atau pertanyaan
export function getWhatsAppUrl(waNumber = '6281234567890', message = 'Halo Quesillo.kita! Saya ingin bertanya seputar produk.') {
  const cleanWa = String(waNumber).replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanWa}?text=${encodeURIComponent(message)}`;
}

// Template pesan WhatsApp untuk pemesanan produk tertentu
export function getProductOrderWaUrl(product, waNumber = '6281234567890') {
  const message = [
    `Halo Quesillo.kita! 🍮✨`,
    `Saya ingin memesan varian: *${product.name}* (${rupiah(product.price)})`,
    `Bisa tolong info ketersediaan stok & jadwal pengirimannya? Terima kasih!`
  ].join('\n');

  return getWhatsAppUrl(waNumber, message);
}
