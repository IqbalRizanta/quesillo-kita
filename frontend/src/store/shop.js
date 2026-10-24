import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store autentikasi khusus Admin (disimpan di localStorage)
export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => {
        localStorage.setItem('q_admin_token', token);
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('q_admin_token');
        set({ token: null, user: null });
      }
    }),
    { name: 'quesillo-admin-auth' }
  )
);

// Toast notifikasi ramah pengguna
let toastTimer = null;
export const useToast = create((set) => ({
  msg: null,
  show: (msg) => {
    set({ msg });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ msg: null }), 2600);
  }
}));
