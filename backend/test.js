// Unit & Integration Test untuk Quesillo.kita (Company Profile & Promotion)
const { spawn } = require('child_process');

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
let pass = 0, fail = 0;
const results = [];

function ok(name, cond, extra = '') {
  if (cond) {
    pass++;
    results.push(`  ✅ ${name}`);
  } else {
    fail++;
    results.push(`  ❌ ${name} ${extra}`);
  }
}

async function req(method, path, { token, body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(BASE + path, { method, headers, body: payload });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const srv = spawn('node', ['src/index.js'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
    cwd: __dirname
  });

  try {
    for (let i = 0; i < 40; i++) {
      try {
        const r = await fetch(BASE + '/health');
        if (r.ok) break;
      } catch {}
      await wait(500);
    }

    // 1. Health Check
    let r = await req('GET', '/health');
    ok('Health Check 200', r.status === 200 && r.json.ok === true);

    // 2. Public Catalog & Products (2 menu utama: Original & Matcha)
    r = await req('GET', '/products');
    ok('Katalog publik memuat minimal 2 menu', r.status === 200 && r.json.length >= 2, `Total: ${r.json?.length}`);

    const hasOriginal = r.json.some(p => p.slug.includes('original'));
    const hasMatcha = r.json.some(p => p.slug.includes('matcha'));
    ok('Menu Original Classic tersedia', hasOriginal);
    ok('Menu Matcha Green Tea tersedia', hasMatcha);

    // 3. Settings & Content Publik
    r = await req('GET', '/settings');
    ok('GET /settings 200 dengan nomor WA', r.status === 200 && typeof r.json.wa_number === 'string');

    r = await req('GET', '/promos');
    ok('GET /promos 200', r.status === 200 && Array.isArray(r.json.banners));

    r = await req('GET', '/galleries');
    ok('GET /galleries 200', r.status === 200 && Array.isArray(r.json));

    r = await req('GET', '/testimonials');
    ok('GET /testimonials 200', r.status === 200 && Array.isArray(r.json));

    // 4. Testimoni Publik (Pending moderation)
    r = await req('POST', '/testimonials', { body: { name: 'Pecinta Dessert', rating: 5, message: 'Rasanya luar biasa enak!' } });
    ok('Kirim testimoni publik 201 (Pending)', r.status === 201 && r.json.ok === true);

    // 5. Auth Admin & Guard Security
    r = await req('POST', '/auth/login', { body: { email: 'admin@quesillo.local', password: 'salah' } });
    ok('Login salah ditolak 401', r.status === 401);

    r = await req('POST', '/auth/login', { body: { email: 'admin@quesillo.local', password: 'admin123' } });
    ok('Login admin sukses 200', r.status === 200 && !!r.json.token);
    const adminToken = r.json.token;

    r = await req('GET', '/admin/stats');
    ok('Akses admin tanpa token ditolak 401', r.status === 401);

    r = await req('GET', '/admin/stats', { token: adminToken });
    ok('Akses admin dengan token sukses 200', r.status === 200 && typeof r.json.productsCount === 'number');

    // 6. Admin Update Settings CMS
    r = await req('PUT', '/admin/settings', { token: adminToken, body: { hero_badge: 'Super Lumer!' } });
    ok('Admin update settings CMS sukses', r.status === 200 && r.json.ok === true);

    // 7. Verify public settings updated
    r = await req('GET', '/settings');
    ok('Settings publik terupdate real-time', r.status === 200 && r.json.hero_badge === 'Super Lumer!');

  } finally {
    srv.kill();
  }

  console.log('\nHasil Pengujian Backend Quesillo.kita:');
  console.log(results.join('\n'));
  console.log(`\nRingkasan: ${pass} lolos, ${fail} gagal`);
  process.exit(fail ? 1 : 0);
}

main().catch(e => {
  console.error('FATAL ERROR:', e);
  process.exit(1);
});
