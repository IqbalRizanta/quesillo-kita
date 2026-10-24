const prisma = require('../lib/prisma');
const { mem } = require('../lib/store');

class UserRepository {
  async findByEmail(email) {
    if (prisma) {
      try {
        return await prisma.user.findUnique({ where: { email } });
      } catch (err) {
        console.warn('[UserRepository.findByEmail] DB fallback to mem:', err.message);
      }
    }
    return mem.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findById(id) {
    if (prisma) {
      try {
        return await prisma.user.findUnique({
          where: { id: Number(id) },
          select: { id: true, name: true, email: true, role: true, createdAt: true }
        });
      } catch (err) {
        console.warn('[UserRepository.findById] DB fallback to mem:', err.message);
      }
    }
    const u = mem.users.find(x => x.id === Number(id));
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: new Date() };
  }
}

module.exports = new UserRepository();
