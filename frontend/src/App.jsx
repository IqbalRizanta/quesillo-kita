import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout.jsx';
import { useAuth } from './store/shop.js';

// Lazy loading halaman agar initial bundle super cepat & hemat kuota
const Home = lazy(() => import('./pages/Home.jsx'));
const Menu = lazy(() => import('./pages/Menu.jsx'));
const Detail = lazy(() => import('./pages/Detail.jsx'));
const Promo = lazy(() => import('./pages/Promo.jsx'));
const Galeri = lazy(() => import('./pages/Galeri.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Admin = lazy(() => import('./pages/admin/Admin.jsx'));

function Loading() {
  return <div className="pt-12 text-center text-choco/60 text-sm">Memuat konten ceria…</div>;
}

// Guard untuk Panel Admin: jika belum login, tampilkan form login
function AdminRoute() {
  const token = useAuth(s => s.token);
  if (!token) {
    return <Login />;
  }
  return <Admin />;
}

export default function App() {
  const { pathname } = useLocation();

  // Scroll to top setiap kali berpindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Rute Publik (Company Profile & Promotion) */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:slug" element={<Detail />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/tentang" element={<About />} />
          <Route path="/kontak" element={<Contact />} />

          {/* Rute Khusus Admin (Tersembunyi dari navigasi umum) */}
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect rute lama atau tidak valid ke Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
