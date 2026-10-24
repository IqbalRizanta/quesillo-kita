require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SETTINGS = {
  hero_badge: 'Lumer di mulut!',
  hero_title: 'Quesillo Lumer Paling Ceria!',
  hero_subtitle: 'Dessert puding karamel khas Venezuela buatan rumahan. Manis legit, tekstur creamy lumer bikin senyum.',
  hero_image: '',
  about_title: 'Kenapa Quesillo.kita?',
  about_text: 'Kami membuat Quesillo rumahan premium dengan susu murni, telur segar, dan karamel alami tanpa pengawet. Setiap cup disajikan segar untuk menemani momen manismu.',
  about_image: '',
  wa_number: '6281234567890',
  address: 'Jl. Rasa Manis No. 12, Jakarta',
  maps_url: '',
  hours: 'Senin - Sabtu, 09.00 - 20.00 WIB',
  instagram_url: 'https://www.instagram.com/quesillo.kita',
  promo_text: 'Promo Spesial: Dapatkan harga hemat untuk pemesanan paket Original & Matcha via WhatsApp!',
  footer_note: 'Dibuat dengan cinta untuk para penikmat dessert.',
  logo_url: ''
};

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@quesillo.local' },
    update: { passwordHash },
    create: { name: 'Admin Quesillo', email: 'admin@quesillo.local', passwordHash, role: 'ADMIN' }
  });

  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  const catOriginal = await prisma.category.upsert({
    where: { slug: 'original' },
    update: { name: 'Original' },
    create: { name: 'Original', slug: 'original' }
  });

  const catMatcha = await prisma.category.upsert({
    where: { slug: 'matcha' },
    update: { name: 'Matcha' },
    create: { name: 'Matcha', slug: 'matcha' }
  });

  const products = [
    {
      name: 'Quesillo Original Classic',
      slug: 'original-classic',
      description: 'Puding karamel klasik khas Venezuela bertekstur lumer di mulut dengan saus karamel legit.',
      price: 18000,
      stock: 50,
      categoryId: catOriginal.id,
      isBestSeller: true,
      isActive: true
    },
    {
      name: 'Quesillo Matcha Green Tea',
      slug: 'matcha-green-tea',
      description: 'Sentuhan teh hijau Jepang berkualitas berpadu dengan manis creamy susu dan karamel lumer.',
      price: 22000,
      stock: 40,
      categoryId: catMatcha.id,
      isBestSeller: true,
      isActive: true
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });
  }

  const banners = [
    { title: 'Dua Varian Favorit: Original Classic & Matcha Green Tea!', link: '/menu', sortOrder: 0 },
    { title: 'Fresh Homemade Setiap Hari — Chat WhatsApp untuk Pemesanan', link: '/kontak', sortOrder: 1 },
  ];
  for (const b of banners) {
    const exist = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!exist) await prisma.banner.create({ data: b });
  }

  const galleries = ['Quesillo Original Classic', 'Quesillo Matcha Green Tea', 'Tekstur Creamy Lumer', 'Kemasan Rapi & Manis'];
  for (let i = 0; i < galleries.length; i++) {
    const exist = await prisma.gallery.findFirst({ where: { title: galleries[i] } });
    if (!exist) await prisma.gallery.create({ data: { title: galleries[i], sortOrder: i } });
  }

  console.log('Seed berhasil: 2 menu utama (Original & Matcha), admin@quesillo.local / admin123');
}

main()
  .catch(e => { console.error('Seed error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
