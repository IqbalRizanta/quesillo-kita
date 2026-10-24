import { useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, rupiah } from '../../lib/api.js';
import { useAuth, useToast } from '../../store/shop.js';
import { CountUp } from '../../components/Anim.jsx';
import {
  ChefHat, LayoutDashboard, CakeSlice, Images, Palette, Plus, Pencil,
  Star, Eye, Save, Trash2, LogOut, CheckCircle, MessageSquare, TicketPercent
} from 'lucide-react';

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="lbl">{label}</span>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

const SETTING_FIELDS = [
  ['hero_badge', 'Badge Hero (mis: Lumer di mulut!)'],
  ['hero_title', 'Judul Utama Hero'],
  ['hero_subtitle', 'Subjudul Hero'],
  ['hero_image', 'Foto Hero (URL / Upload)'],
  ['about_title', 'Judul Tentang Toko'],
  ['about_text', 'Cerita Tentang Toko'],
  ['about_image', 'Foto Tentang (URL / Upload)'],
  ['wa_number', 'Nomor WhatsApp Pemesanan (contoh: 6281234567890)'],
  ['address', 'Alamat Lengkap Toko'],
  ['hours', 'Jam Operasional Buka Toko'],
  ['instagram_url', 'Link Profil Instagram'],
  ['promo_text', 'Teks Berjalan Promo'],
  ['footer_note', 'Catatan Footer Website'],
];

function useUpload() {
  async function upload(file) {
    let payload = file, name = file.name;
    try {
      const bitmap = await fileToImage(file);
      const max = 1280;
      const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      payload = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.84));
      name = 'foto.jpg';
    } catch { /* upload original jika canvas gagal */ }

    const fd = new FormData();
    fd.append('image', payload, name);
    const { data } = await api.post('/admin/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  }
  return upload;
}

function fileToImage(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = rej;
    img.src = url;
  });
}

// 1. Dashboard Overview
function Dashboard() {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data
  });

  if (!data) return <div className="card text-sm text-center py-6">Memuat ringkasan...</div>;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="card text-center p-3">
          <div className="text-xs text-choco/70 flex items-center justify-center gap-1"><CakeSlice size={14} /> Produk</div>
          <b className="text-xl text-choco"><CountUp value={data.productsCount} /></b>
        </div>
        <div className="card text-center p-3">
          <div className="text-xs text-choco/70 flex items-center justify-center gap-1"><TicketPercent size={14} /> Banner</div>
          <b className="text-xl text-choco"><CountUp value={data.bannersCount} /></b>
        </div>
        <div className="card text-center p-3">
          <div className="text-xs text-choco/70 flex items-center justify-center gap-1"><Images size={14} /> Galeri</div>
          <b className="text-xl text-choco"><CountUp value={data.galleriesCount} /></b>
        </div>
        <div className="card text-center p-3">
          <div className="text-xs text-choco/70 flex items-center justify-center gap-1"><MessageSquare size={14} /> Ulasan</div>
          <b className="text-xl text-choco"><CountUp value={data.testimonialsCount} /></b>
          {data.pendingTestimonials > 0 && (
            <span className="text-[10px] text-tomato font-bold block mt-0.5">
              ({data.pendingTestimonials} perlu ditinjau)
            </span>
          )}
        </div>
      </div>

      <div className="card text-xs space-y-2 bg-butter/20 border border-caramel-light">
        <b className="font-chubby text-sm text-choco block">💡 Info Pengelolaan Toko</b>
        <p className="opacity-80 leading-relaxed">
          Semua pesanan pembeli langsung diarahkan ke <b>WhatsApp tokomu</b>. Di panel ini, kamu dapat mengganti harga puding, memperbarui foto produk, mengubah banner promo, menambah foto galeri, serta menyetujui ulasan pembeli tanpa perlu bantuan tim IT atau membuka kode!
        </p>
      </div>
    </div>
  );
}

// 2. Produk Management
function Products() {
  const qc = useQueryClient();
  const upload = useUpload();
  const toast = useToast(s => s.show);
  const { data = [] } = useQuery({
    queryKey: ['a-products'],
    queryFn: async () => (await api.get('/admin/products')).data
  });

  const blank = { name: '', price: 18000, stock: 30, description: '', category: 'Original', imageUrl: '', isBestSeller: true, isActive: true };
  const [f, setF] = useState(blank);
  const [editingId, setEditingId] = useState(null);

  async function save(e) {
    e.preventDefault();
    const payload = { ...f, price: Number(f.price), stock: Number(f.stock) };
    if (editingId) {
      await api.put(`/admin/products/${editingId}`, payload);
      toast('Produk berhasil diperbarui!');
    } else {
      await api.post('/admin/products', payload);
      toast('Produk baru berhasil ditambahkan!');
    }
    setF(blank);
    setEditingId(null);
    qc.invalidateQueries(['a-products']);
    qc.invalidateQueries(['public-products']);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setF({
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description || '',
      category: p.category || 'Original',
      imageUrl: p.imageUrl || '',
      isBestSeller: !!p.isBestSeller,
      isActive: p.isActive ?? true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-3">
      <form onSubmit={save} className="card space-y-3 border border-caramel-light/60">
        <b className="text-sm flex items-center gap-1.5 text-choco">
          {editingId ? <><Pencil size={15} /> Edit Menu</> : <><Plus size={15} /> Tambah Menu Baru</>}
        </b>

        <Field label="Nama Menu" hint="Contoh: Quesillo Original Classic, Quesillo Matcha Green Tea">
          <input className="input text-sm" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Harga (Rp)" hint="Angka tanpa titik (mis: 18000)">
            <input className="input text-sm" type="number" min="0" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} required />
          </Field>
          <Field label="Kategori" hint="Contoh: Original, Matcha">
            <input className="input text-sm" value={f.category} onChange={e => setF({ ...f, category: e.target.value })} />
          </Field>
        </div>

        <Field label="Deskripsi Cita Rasa" hint="Ceritakan kenikmatan tekstur dan rasanya dengan kalimat manis">
          <textarea className="input text-sm" rows={2} value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
        </Field>

        <Field label="Foto Menu" hint="Tempel link foto atau upload langsung dari galeri HP">
          <input className="input text-sm" placeholder="https://... (opsional kalau upload)" value={f.imageUrl} onChange={e => setF({ ...f, imageUrl: e.target.value })} />
          <div className="mt-1.5 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={async e => {
                if (!e.target.files[0]) return;
                const url = await upload(e.target.files[0]);
                setF({ ...f, imageUrl: url });
                toast('Foto menu terupload!');
              }}
            />
          </div>
        </Field>

        {f.imageUrl && (
          <img src={f.imageUrl} className="h-28 rounded-2xl object-cover border border-caramel-light" alt="Pratinjau" />
        )}

        <div className="flex gap-4 pt-1">
          <label className="text-xs flex gap-2 items-center font-bold text-choco">
            <input type="checkbox" checked={f.isBestSeller} onChange={e => setF({ ...f, isBestSeller: e.target.checked })} />
            <Star size={14} className="fill-butter text-caramel-dark" /> Tandai Favorit / Best Seller
          </label>
          <label className="text-xs flex gap-2 items-center font-bold text-choco">
            <input type="checkbox" checked={f.isActive} onChange={e => setF({ ...f, isActive: e.target.checked })} />
            <Eye size={14} /> Tampilkan di Menu
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn-chubby bg-caramel text-white text-xs font-bold flex-1 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save size={15} /> {editingId ? 'Simpan Perubahan' : 'Simpan Menu'}
          </motion.button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setF(blank); setEditingId(null); }}
              className="btn-chubby bg-white border border-caramel text-xs font-bold"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* List Produk */}
      <div className="space-y-2">
        {data.map(p => (
          <div key={p.id} className="card text-xs flex gap-2.5 items-center border border-caramel-light/50">
            {p.imageUrl ? (
              <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-butter/40 grid place-items-center text-choco font-bold">Q</div>
            )}
            <div className="flex-1 min-w-0">
              <b className="text-sm text-choco truncate block">{p.name}</b>
              <div className="opacity-75">{rupiah(p.price)} • {p.category}{!p.isActive && ' • (Disembunyikan)'}</div>
            </div>
            <button className="font-bold text-caramel-dark flex items-center gap-1 px-2 py-1" onClick={() => startEdit(p)}>
              <Pencil size={13} /> Edit
            </button>
            <button
              className="text-tomato font-bold flex items-center gap-1 px-2 py-1"
              onClick={async () => {
                if (confirm(`Hapus menu "${p.name}"?`)) {
                  await api.delete(`/admin/products/${p.id}`);
                  qc.invalidateQueries(['a-products']);
                  toast('Menu dihapus');
                }
              }}
            >
              <Trash2 size={13} /> Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Settings CMS
function Settings() {
  const qc = useQueryClient();
  const upload = useUpload();
  const toast = useToast(s => s.show);
  const { data } = useQuery({
    queryKey: ['a-settings'],
    queryFn: async () => (await api.get('/admin/settings')).data
  });

  const [f, setF] = useState(null);
  const cur = f || data || {};

  if (!data) return <div className="card text-sm text-center py-6">Memuat pengaturan...</div>;

  return (
    <div className="card space-y-4 border border-caramel-light/60">
      <div className="border-b border-caramel-light/50 pb-2">
        <b className="text-sm flex items-center gap-1.5 text-choco">
          <Palette size={16} /> Pengaturan Tampilan & Kontak Website
        </b>
        <p className="text-[11px] text-choco/70 mt-0.5">
          Semua teks dan foto yang diubah di sini otomatis langsung tampil di website pembeli.
        </p>
      </div>

      {SETTING_FIELDS.map(([key, label]) => (
        <Field key={key} label={label}>
          {key === 'about_text' || key === 'hero_subtitle' ? (
            <textarea
              className="input text-sm resize-y"
              rows={3}
              value={cur[key] || ''}
              onChange={e => setF({ ...cur, [key]: e.target.value })}
            />
          ) : (
            <input
              className="input text-sm"
              value={cur[key] || ''}
              onChange={e => setF({ ...cur, [key]: e.target.value })}
            />
          )}

          {key.includes('image') && (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="hint">Unggah foto baru:</span>
              <input
                type="file"
                accept="image/*"
                className="text-xs"
                onChange={async e => {
                  if (!e.target.files[0]) return;
                  const url = await upload(e.target.files[0]);
                  setF({ ...cur, [key]: url });
                  toast('Foto berhasil diunggah! Jangan lupa klik Simpan.');
                }}
              />
            </div>
          )}
        </Field>
      ))}

      <motion.button
        whileTap={{ scale: 0.96 }}
        className="btn-chubby bg-caramel text-white w-full flex items-center justify-center gap-1.5 text-sm font-bold shadow-soft"
        onClick={async () => {
          await api.put('/admin/settings', cur);
          qc.invalidateQueries(['settings']);
          toast('Pengaturan berhasil disimpan!');
        }}
      >
        <Save size={16} /> Simpan Seluruh Pengaturan
      </motion.button>
    </div>
  );
}

// 4. Banner Promo
function BannersAdmin() {
  const qc = useQueryClient();
  const upload = useUpload();
  const toast = useToast(s => s.show);
  const { data = [] } = useQuery({
    queryKey: ['a-banners'],
    queryFn: async () => (await api.get('/admin/banners')).data
  });

  const [f, setF] = useState({ title: '', imageUrl: '', link: '/menu' });

  async function save(e) {
    e.preventDefault();
    await api.post('/admin/banners', f);
    setF({ title: '', imageUrl: '', link: '/menu' });
    qc.invalidateQueries(['a-banners']);
    toast('Banner promo tersimpan!');
  }

  return (
    <div className="space-y-3">
      <form onSubmit={save} className="card space-y-3 border border-caramel-light/60">
        <b className="text-sm flex items-center gap-1.5 text-choco"><Plus size={15} /> Tambah Banner Promo</b>
        <Field label="Judul / Keterangan Promo" hint="Contoh: Paket Duo Hemat (Original + Matcha)">
          <input className="input text-sm" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} required />
        </Field>
        <Field label="Foto Banner" hint="Tempel link foto atau upload dari HP">
          <input className="input text-sm" placeholder="https://..." value={f.imageUrl} onChange={e => setF({ ...f, imageUrl: e.target.value })} />
          <input
            type="file"
            accept="image/*"
            className="text-xs mt-1.5"
            onChange={async e => {
              if (!e.target.files[0]) return;
              const url = await upload(e.target.files[0]);
              setF({ ...f, imageUrl: url });
              toast('Foto banner terupload!');
            }}
          />
        </Field>
        <motion.button whileTap={{ scale: 0.95 }} className="btn-chubby bg-caramel text-white text-xs font-bold w-full">
          Simpan Banner
        </motion.button>
      </form>

      <div className="space-y-2">
        {data.map(b => (
          <div key={b.id} className="card text-xs flex items-center gap-2 border border-caramel-light/50">
            {b.imageUrl && <img src={b.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />}
            <b className="flex-1 text-choco truncate">{b.title}</b>
            <button
              className="text-tomato font-bold px-2 py-1 flex items-center gap-1"
              onClick={async () => {
                if (confirm(`Hapus banner "${b.title}"?`)) {
                  await api.delete(`/admin/banners/${b.id}`);
                  qc.invalidateQueries(['a-banners']);
                  toast('Banner dihapus');
                }
              }}
            >
              <Trash2 size={13} /> Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Galeri
function GaleriAdmin() {
  const qc = useQueryClient();
  const upload = useUpload();
  const toast = useToast(s => s.show);
  const { data = [] } = useQuery({
    queryKey: ['a-galeri'],
    queryFn: async () => (await api.get('/admin/galleries')).data
  });

  const [f, setF] = useState({ title: '', imageUrl: '' });

  async function save(e) {
    e.preventDefault();
    await api.post('/admin/galleries', f);
    setF({ title: '', imageUrl: '' });
    qc.invalidateQueries(['a-galeri']);
    toast('Foto galeri berhasil disimpan!');
  }

  return (
    <div className="space-y-3">
      <form onSubmit={save} className="card space-y-3 border border-caramel-light/60">
        <b className="text-sm flex items-center gap-1.5 text-choco"><Plus size={15} /> Tambah Foto Galeri</b>
        <Field label="Judul Foto" hint="Contoh: Suasana Pembuatan Quesillo, Kemasan Cantik">
          <input className="input text-sm" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} required />
        </Field>
        <Field label="Foto" hint="Upload foto dari HP">
          <input
            type="file"
            accept="image/*"
            className="text-xs"
            onChange={async e => {
              if (!e.target.files[0]) return;
              const url = await upload(e.target.files[0]);
              setF({ ...f, imageUrl: url });
              toast('Foto terupload!');
            }}
          />
        </Field>
        {f.imageUrl && <img src={f.imageUrl} className="h-24 rounded-2xl object-cover" alt="Pratinjau" />}
        <motion.button whileTap={{ scale: 0.95 }} className="btn-chubby bg-caramel text-white text-xs font-bold w-full">
          Simpan ke Galeri
        </motion.button>
      </form>

      <div className="space-y-2">
        {data.map(g => (
          <div key={g.id} className="card text-xs flex items-center gap-2 border border-caramel-light/50">
            {g.imageUrl && <img src={g.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />}
            <b className="flex-1 text-choco truncate">{g.title}</b>
            <button
              className="text-tomato font-bold px-2 py-1 flex items-center gap-1"
              onClick={async () => {
                if (confirm(`Hapus foto "${g.title}"?`)) {
                  await api.delete(`/admin/galleries/${g.id}`);
                  qc.invalidateQueries(['a-galeri']);
                  toast('Foto galeri dihapus');
                }
              }}
            >
              <Trash2 size={13} /> Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Testimoni Moderasi
function TestimonialsAdmin() {
  const qc = useQueryClient();
  const toast = useToast(s => s.show);
  const { data = [] } = useQuery({
    queryKey: ['a-testimonials'],
    queryFn: async () => (await api.get('/admin/testimonials')).data
  });

  return (
    <div className="space-y-2">
      <div className="card text-xs bg-butter/20 border border-caramel-light">
        Ulasan yang dikirim pembeli dari halaman Kontak perlu disetujui di sini sebelum muncul di halaman publik.
      </div>

      {data.map(t => (
        <div key={t.id} className="card text-xs space-y-2 border border-caramel-light/50">
          <div className="flex items-center justify-between">
            <b className="text-sm text-choco">{t.name}</b>
            <span className="text-caramel-dark font-bold">⭐ {t.rating}/5</span>
          </div>
          <p className="opacity-80 italic">"{t.message}"</p>

          <div className="flex items-center justify-between pt-1 border-t border-caramel-light/40">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.isApproved ? 'bg-mint/20 text-choco' : 'bg-tomato/20 text-tomato'}`}>
              {t.isApproved ? 'Tampil di Web' : 'Menunggu Persetujuan'}
            </span>
            <div className="flex gap-2">
              <button
                className={`font-bold px-2.5 py-1 rounded-xl text-[11px] ${t.isApproved ? 'bg-butter/50 text-choco' : 'bg-mint text-white'}`}
                onClick={async () => {
                  await api.patch(`/admin/testimonials/${t.id}`, { isApproved: !t.isApproved });
                  qc.invalidateQueries(['a-testimonials']);
                  toast(t.isApproved ? 'Ulasan disembunyikan' : 'Ulasan disetujui untuk tampil!');
                }}
              >
                {t.isApproved ? 'Sembunyikan' : 'Setujui Tampil'}
              </button>
              <button
                className="text-tomato font-bold px-2 py-1"
                onClick={async () => {
                  if (confirm('Hapus ulasan ini?')) {
                    await api.delete(`/admin/testimonials/${t.id}`);
                    qc.invalidateQueries(['a-testimonials']);
                    toast('Ulasan dihapus');
                  }
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {!data.length && <div className="card text-xs text-center py-6 text-choco/75">Belum ada ulasan yang masuk.</div>}
    </div>
  );
}

export default function Admin() {
  const { logout, user } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav('/', { replace: true });
  }

  return (
    <div className="pt-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-caramel-light/60 pb-3">
        <h1 className="font-chubby font-extrabold text-xl flex items-center gap-2 text-choco">
          Admin Quesillo <ChefHat size={24} className="text-caramel" />
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-choco/70 hidden sm:inline">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-tomato flex items-center gap-1 hover:underline"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </div>

      <div className="flex gap-2 text-xs font-bold flex-wrap">
        <Link to="/admin" className="btn-chubby bg-white border border-caramel !px-3.5 !py-1.5 flex items-center gap-1.5">
          <LayoutDashboard size={14} /> Ringkasan
        </Link>
        <Link to="/admin/produk" className="btn-chubby bg-white border border-caramel !px-3.5 !py-1.5 flex items-center gap-1.5">
          <CakeSlice size={14} /> Menu (Original & Matcha)
        </Link>
        <Link to="/admin/pengaturan" className="btn-chubby bg-butter border border-caramel !px-3.5 !py-1.5 flex items-center gap-1.5">
          <Palette size={14} /> Tampilan & Kontak
        </Link>
        <Link to="/admin/promo" className="btn-chubby bg-white border border-caramel !px-3.5 !py-1.5 flex items-center gap-1.5">
          <TicketPercent size={14} /> Promo Banner
        </Link>
        <Link to="/admin/galeri" className="btn-chubby bg-white border border-caramel !px-3.5 !py-1.5 flex items-center gap-1.5">
          <Images size={14} /> Galeri Foto
        </Link>
        <Link to="/admin/testimoni" className="btn-chubby bg-white border border-caramel !px-3.5 !py-1.5 flex items-center gap-1.5">
          <MessageSquare size={14} /> Ulasan Pembeli
        </Link>
      </div>

      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="produk" element={<Products />} />
        <Route path="pengaturan" element={<Settings />} />
        <Route path="promo" element={<BannersAdmin />} />
        <Route path="galeri" element={<GaleriAdmin />} />
        <Route path="testimoni" element={<TestimonialsAdmin />} />
      </Routes>
    </div>
  );
}
