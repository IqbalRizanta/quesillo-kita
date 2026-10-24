const productService = require('../services/ProductService');

class ProductController {
  async getPublicProducts(req, res, next) {
    try {
      const { search = '', bestseller } = req.query;
      const products = await productService.getPublicProducts({
        search: String(search),
        bestSellerOnly: Boolean(bestseller)
      });
      return res.json(products);
    } catch (err) {
      next(err);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      return res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async getAdminProducts(req, res, next) {
    try {
      const products = await productService.getAllForAdmin();
      return res.json(products);
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req, res, next) {
    try {
      const { name, description, price, stock, imageUrl, category, isBestSeller, isActive } = req.body || {};
      const product = await productService.createProduct({
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
        isBestSeller,
        isActive
      });
      return res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { name, description, price, stock, imageUrl, category, isBestSeller, isActive } = req.body || {};
      const product = await productService.updateProduct(req.params.id, {
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
        isBestSeller,
        isActive
      });
      return res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      return res.json({ ok: true, message: 'Produk berhasil dihapus' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
