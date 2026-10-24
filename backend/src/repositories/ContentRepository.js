const prisma = require('../lib/prisma');
const { mem } = require('../lib/store');

class ContentRepository {
  // ---- BANNERS ----
  async getBanners({ onlyActive = false } = {}) {
    if (prisma) {
      try {
        const where = onlyActive ? { isActive: true } : {};
        return await prisma.banner.findMany({ where, orderBy: { sortOrder: 'asc' } });
      } catch (err) {
        console.warn('[ContentRepository.getBanners] DB fallback to mem:', err.message);
      }
    }
    return onlyActive ? mem.banners.filter(b => b.isActive) : mem.banners;
  }

  async createBanner(data) {
    if (prisma) {
      try {
        return await prisma.banner.create({ data });
      } catch (err) {
        console.warn('[ContentRepository.createBanner] DB fallback to mem:', err.message);
      }
    }
    const b = { id: Date.now(), ...data };
    mem.banners.push(b);
    return b;
  }

  async deleteBanner(id) {
    if (prisma) {
      try {
        await prisma.banner.delete({ where: { id: Number(id) } });
        return true;
      } catch (err) {
        console.warn('[ContentRepository.deleteBanner] DB fallback to mem:', err.message);
      }
    }
    mem.banners = mem.banners.filter(b => b.id !== Number(id));
    return true;
  }

  // ---- GALLERIES ----
  async getGalleries({ onlyActive = false } = {}) {
    if (prisma) {
      try {
        const where = onlyActive ? { isActive: true } : {};
        return await prisma.gallery.findMany({ where, orderBy: { sortOrder: 'asc' } });
      } catch (err) {
        console.warn('[ContentRepository.getGalleries] DB fallback to mem:', err.message);
      }
    }
    const list = mem.galleries || [];
    return onlyActive ? list.filter(g => g.isActive) : list;
  }

  async createGallery(data) {
    if (prisma) {
      try {
        return await prisma.gallery.create({ data });
      } catch (err) {
        console.warn('[ContentRepository.createGallery] DB fallback to mem:', err.message);
      }
    }
    const g = { id: Date.now(), ...data };
    mem.galleries = mem.galleries || [];
    mem.galleries.push(g);
    return g;
  }

  async deleteGallery(id) {
    if (prisma) {
      try {
        await prisma.gallery.delete({ where: { id: Number(id) } });
        return true;
      } catch (err) {
        console.warn('[ContentRepository.deleteGallery] DB fallback to mem:', err.message);
      }
    }
    mem.galleries = (mem.galleries || []).filter(g => g.id !== Number(id));
    return true;
  }

  // ---- TESTIMONIALS ----
  async getTestimonials({ onlyApproved = false } = {}) {
    if (prisma) {
      try {
        const where = onlyApproved ? { isApproved: true } : {};
        return await prisma.testimonial.findMany({ where, orderBy: { id: 'desc' } });
      } catch (err) {
        console.warn('[ContentRepository.getTestimonials] DB fallback to mem:', err.message);
      }
    }
    const list = mem.testimonials || [];
    return onlyApproved ? list.filter(t => t.isApproved) : list;
  }

  async createTestimonial(data) {
    if (prisma) {
      try {
        return await prisma.testimonial.create({ data });
      } catch (err) {
        console.warn('[ContentRepository.createTestimonial] DB fallback to mem:', err.message);
      }
    }
    const t = { id: Date.now(), ...data, createdAt: new Date() };
    mem.testimonials.push(t);
    return t;
  }

  async updateTestimonialApproval(id, isApproved) {
    if (prisma) {
      try {
        return await prisma.testimonial.update({
          where: { id: Number(id) },
          data: { isApproved: Boolean(isApproved) }
        });
      } catch (err) {
        console.warn('[ContentRepository.updateTestimonialApproval] DB fallback to mem:', err.message);
      }
    }
    const t = mem.testimonials.find(x => x.id === Number(id));
    if (t) {
      t.isApproved = Boolean(isApproved);
      return t;
    }
    return null;
  }

  async deleteTestimonial(id) {
    if (prisma) {
      try {
        await prisma.testimonial.delete({ where: { id: Number(id) } });
        return true;
      } catch (err) {
        console.warn('[ContentRepository.deleteTestimonial] DB fallback to mem:', err.message);
      }
    }
    mem.testimonials = mem.testimonials.filter(t => t.id !== Number(id));
    return true;
  }
}

module.exports = new ContentRepository();
