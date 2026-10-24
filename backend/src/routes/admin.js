const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateMagicBytes } = require('../middleware/upload');
const productController = require('../controllers/ProductController');
const settingController = require('../controllers/SettingController');
const contentController = require('../controllers/ContentController');
const productService = require('../services/ProductService');
const contentService = require('../services/ContentService');

const router = express.Router();
router.use(authRequired, adminOnly);

// ---- STATS / OVERVIEW ----
router.get('/stats', async (_, res, next) => {
  try {
    const products = await productService.getAllForAdmin();
    const banners = await contentService.getAllBanners();
    const galleries = await contentService.getAllGalleries();
    const testimonials = await contentService.getAllTestimonials();

    res.json({
      productsCount: products.length,
      bannersCount: banners.length,
      galleriesCount: galleries.length,
      testimonialsCount: testimonials.length,
      pendingTestimonials: testimonials.filter(t => !t.isApproved).length
    });
  } catch (err) {
    next(err);
  }
});

// ---- PRODUCTS CRUD ----
router.get('/products', (req, res, next) => productController.getAdminProducts(req, res, next));
router.post('/products', (req, res, next) => productController.createProduct(req, res, next));
router.put('/products/:id', (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/products/:id', (req, res, next) => productController.deleteProduct(req, res, next));

// ---- SETTINGS CMS ----
router.get('/settings', (req, res, next) => settingController.getSettings(req, res, next));
router.put('/settings', (req, res, next) => settingController.updateSettings(req, res, next));
router.post('/upload', upload.single('image'), validateMagicBytes, (req, res) => settingController.uploadImage(req, res));

// ---- BANNERS ----
router.get('/banners', (req, res, next) => contentController.getAdminBanners(req, res, next));
router.post('/banners', (req, res, next) => contentController.createBanner(req, res, next));
router.delete('/banners/:id', (req, res, next) => contentController.deleteBanner(req, res, next));

// ---- GALLERIES ----
router.get('/galleries', (req, res, next) => contentController.getAdminGalleries(req, res, next));
router.post('/galleries', (req, res, next) => contentController.createGallery(req, res, next));
router.delete('/galleries/:id', (req, res, next) => contentController.deleteGallery(req, res, next));

// ---- TESTIMONIALS MODERATION ----
router.get('/testimonials', (req, res, next) => contentController.getAdminTestimonials(req, res, next));
router.patch('/testimonials/:id', (req, res, next) => contentController.updateTestimonialApproval(req, res, next));
router.delete('/testimonials/:id', (req, res, next) => contentController.deleteTestimonial(req, res, next));

module.exports = router;
