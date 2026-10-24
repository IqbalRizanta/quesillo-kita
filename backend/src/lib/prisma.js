const { PrismaClient } = require('@prisma/client');
let prisma = null;
try {
  prisma = new PrismaClient();
} catch (e) {
  console.warn('[prisma] init gagal, pakai mode memory:', e.message);
}
module.exports = prisma;
