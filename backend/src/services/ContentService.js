const contentRepository = require('../repositories/ContentRepository');

class ContentService {
  // Banners
  async getActiveBanners() {
    return await contentRepository.getBanners({ onlyActive: true });
  }

  async getAllBanners() {
    return await contentRepository.getBanners({ onlyActive: false });
  }

  async createBanner(data) {
    return await contentRepository.createBanner({
      title: data.title || '',
      imageUrl: data.imageUrl || '',
      link: data.link || '',
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      sortOrder: Number(data.sortOrder || 0)
    });
  }

  async deleteBanner(id) {
    return await contentRepository.deleteBanner(id);
  }

  // Galleries
  async getActiveGalleries() {
    return await contentRepository.getGalleries({ onlyActive: true });
  }

  async getAllGalleries() {
    return await contentRepository.getGalleries({ onlyActive: false });
  }

  async createGallery(data) {
    return await contentRepository.createGallery({
      title: data.title || '',
      imageUrl: data.imageUrl || '',
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      sortOrder: Number(data.sortOrder || 0)
    });
  }

  async deleteGallery(id) {
    return await contentRepository.deleteGallery(id);
  }

  // Testimonials
  async getApprovedTestimonials() {
    return await contentRepository.getTestimonials({ onlyApproved: true });
  }

  async getAllTestimonials() {
    return await contentRepository.getTestimonials({ onlyApproved: false });
  }

  async submitTestimonial(data) {
    if (!data.name || !data.name.trim() || !data.message || !data.message.trim()) {
      const err = new Error('Nama dan pesan ulasan wajib diisi');
      err.status = 400;
      throw err;
    }
    const rating = Math.min(5, Math.max(1, Number(data.rating || 5)));
    return await contentRepository.createTestimonial({
      name: data.name.trim(),
      rating,
      message: data.message.trim(),
      isApproved: false // Memerlukan persetujuan admin terlebih dahulu
    });
  }

  async setTestimonialApproval(id, isApproved) {
    return await contentRepository.updateTestimonialApproval(id, isApproved);
  }

  async deleteTestimonial(id) {
    return await contentRepository.deleteTestimonial(id);
  }
}

module.exports = new ContentService();
