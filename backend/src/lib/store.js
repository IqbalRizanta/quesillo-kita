// Fallback memory store saat database postgres belum berjalan.
const DEFAULT_SETTINGS = {
  hero_badge: 'Lumer di mulut!',
  hero_title: 'Quesillo Lumer Paling Ceria!',
  hero_subtitle: 'Dessert puding karamel khas Venezuela buatan rumahan. Manis legit, tekstur creamy lumer bikin senyum.',
  hero_image: '',
  about_title: 'Kenapa Quesillo.kita?',
  about_text: 'Kami membuat Quesillo rumahan premium dengan susu, telur segar, dan karamel alami tanpa pengawet. Setiap gigitan memberikan sensasi manis lumer yang memanjakan lidah.',
  about_image: '',
  wa_number: '6281234567890',
  address: 'Jl. Rasa Manis No. 12, Jakarta',
  maps_url: '',
  hours: 'Senin - Sabtu, 09.00 - 20.00 WIB',
  instagram_url: 'https://www.instagram.com/quesillo.kita',
  promo_text: 'Promo Spesial: Pesan 2 Cup (Original + Matcha) dapatkan free topping karamel ekstra!',
  footer_note: 'Dibuat dengan cinta untuk para pecinta dessert sejati.',
  logo_url: ''
};

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Quesillo Original Classic',
    slug: 'original-classic',
    description: 'Puding karamel klasik khas Venezuela bertekstur lumer di mulut dengan saus karamel legit.',
    price: 18000,
    stock: 50,
    imageUrl: '',
    category: 'Original',
    isBestSeller: true,
    isActive: true
  },
  {
    id: 2,
    name: 'Quesillo Matcha Green Tea',
    slug: 'matcha-green-tea',
    description: 'Sentuhan teh hijau Jepang berkualitas berpadu dengan manis creamy susu dan karamel lumer.',
    price: 22000,
    stock: 40,
    imageUrl: '',
    category: 'Matcha',
    isBestSeller: true,
    isActive: true
  }
];

const mem = {
  settings: { ...DEFAULT_SETTINGS },
  products: [...DEFAULT_PRODUCTS],
  banners: [
    { id: 1, title: 'Original Karamel & Matcha Green Tea — Pesan via WhatsApp Sekarang!', imageUrl: '', link: '/menu', isActive: true, sortOrder: 0 },
    { id: 2, title: 'Freshly Baked Daily — Tanpa Bahan Pengawet', imageUrl: '', link: '/tentang', isActive: true, sortOrder: 1 },
  ],
  galleries: [
    { id: 1, title: 'Quesillo Original Classic', imageUrl: '', isActive: true, sortOrder: 0 },
    { id: 2, title: 'Quesillo Matcha Green Tea', imageUrl: '', isActive: true, sortOrder: 1 },
    { id: 3, title: 'Tekstur Creamy Lumer', imageUrl: '', isActive: true, sortOrder: 2 },
    { id: 4, title: 'Kemasan Cantik Siap Hadiah', imageUrl: '', isActive: true, sortOrder: 3 },
  ],
  testimonials: [
    { id: 1, name: 'Alya', rating: 5, message: 'Lembut banget quesillo-nya, manisnya nggak bikin enek! Langsung repeat order via WA.', isApproved: true },
    { id: 2, name: 'Bima', rating: 5, message: 'Matcha-nya wangi premium, perpaduan sama karamelnya nagih parah.', isApproved: true },
    { id: 3, name: 'Clara', rating: 5, message: 'Packaging aman dan rapi, cocok buat camilan sore di kantor.', isApproved: true },
  ],
  users: [
    {
      id: 1,
      name: 'Admin Quesillo',
      email: 'admin@quesillo.local',
      role: 'ADMIN',
      // bcrypt hash untuk 'admin123'
      passwordHash: '$2a$10$TVtV4QRU9QosLK5pDCSGa.p.wMul1LLDnG.ikDFh6SgN45vsRifVi'
    }
  ]
};

module.exports = { DEFAULT_SETTINGS, DEFAULT_PRODUCTS, mem };
