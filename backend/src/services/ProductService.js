const productRepository = require('../repositories/ProductRepository');

class ProductService {
  _generateSlug(name) {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${base}-${Date.now().toString(36)}`;
  }

  async getPublicProducts({ search = '', bestSellerOnly = false } = {}) {
    return await productRepository.findAll({
      onlyActive: true,
      search,
      bestSellerOnly: Boolean(bestSellerOnly)
    });
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product || !product.isActive) {
      const err = new Error('Produk tidak ditemukan atau sedang tidak aktif');
      err.status = 404;
      throw err;
    }
    return product;
  }

  async getAllForAdmin() {
    return await productRepository.findAll({ onlyActive: false });
  }

  async createProduct(data) {
    if (!data.name || !data.name.trim()) {
      const err = new Error('Nama produk wajib diisi');
      err.status = 400;
      throw err;
    }

    const slug = this._generateSlug(data.name);
    return await productRepository.create({
      ...data,
      slug
    });
  }

  async updateProduct(id, data) {
    if (!id) {
      const err = new Error('ID produk tidak valid');
      err.status = 400;
      throw err;
    }
    const updated = await productRepository.update(id, data);
    if (!updated) {
      const err = new Error('Produk tidak ditemukan');
      err.status = 404;
      throw err;
    }
    return updated;
  }

  async deleteProduct(id) {
    if (!id) {
      const err = new Error('ID produk tidak valid');
      err.status = 400;
      throw err;
    }
    return await productRepository.delete(id);
  }
}

module.exports = new ProductService();
