const contentService = require('../services/ContentService');
const settingService = require('../services/SettingService');

class ContentController {
  // Public promos (promo_text + active banners)
  async getPromos(req, res, next) {
    try {
      const settings = await settingService.getSettings();
      const banners = await contentService.getActiveBanners();
      return res.json({
        promo_text: settings.promo_text || '',
        banners
      });
    } catch (err) {
      next(err);
    }
  }

  // Banners
  async getBanners(req, res, next) {
    try {
      const banners = await contentService.getActiveBanners();
      return res.json(banners);
    } catch (err) {
      next(err);
    }
  }

  async getAdminBanners(req, res, next) {
    try {
      const banners = await contentService.getAllBanners();
      return res.json(banners);
    } catch (err) {
      next(err);
    }
  }

  async createBanner(req, res, next) {
    try {
      const banner = await contentService.createBanner(req.body);
      return res.status(201).json(banner);
    } catch (err) {
      next(err);
    }
  }

  async deleteBanner(req, res, next) {
    try {
      await contentService.deleteBanner(req.params.id);
      return res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }

  // Galleries
  async getGalleries(req, res, next) {
    try {
      const galleries = await contentService.getActiveGalleries();
      return res.json(galleries);
    } catch (err) {
      next(err);
    }
  }

  async getAdminGalleries(req, res, next) {
    try {
      const galleries = await contentService.getAllGalleries();
      return res.json(galleries);
    } catch (err) {
      next(err);
    }
  }

  async createGallery(req, res, next) {
    try {
      const gallery = await contentService.createGallery(req.body);
      return res.status(201).json(gallery);
    } catch (err) {
      next(err);
    }
  }

  async deleteGallery(req, res, next) {
    try {
      await contentService.deleteGallery(req.params.id);
      return res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }

  // Testimonials
  async getTestimonials(req, res, next) {
    try {
      const testimonials = await contentService.getApprovedTestimonials();
      return res.json(testimonials);
    } catch (err) {
      next(err);
    }
  }

  async getAdminTestimonials(req, res, next) {
    try {
      const testimonials = await contentService.getAllTestimonials();
      return res.json(testimonials);
    } catch (err) {
      next(err);
    }
  }

  async submitTestimonial(req, res, next) {
    try {
      const testimonial = await contentService.submitTestimonial(req.body);
      return res.status(201).json({
        ok: true,
        data: testimonial,
        message: 'Terima kasih! Ulasan Anda telah diterima dan akan ditampilkan setelah ditinjau admin.'
      });
    } catch (err) {
      next(err);
    }
  }

  async updateTestimonialApproval(req, res, next) {
    try {
      const { isApproved } = req.body || {};
      const updated = await contentService.setTestimonialApproval(req.params.id, isApproved);
      return res.json({ ok: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async deleteTestimonial(req, res, next) {
    try {
      await contentService.deleteTestimonial(req.params.id);
      return res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContentController();
