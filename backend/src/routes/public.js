const express = require('express');
const productController = require('../controllers/ProductController');
const settingController = require('../controllers/SettingController');
const contentController = require('../controllers/ContentController');
const { testimonialLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Settings & Info Toko
router.get('/settings', (req, res, next) => settingController.getSettings(req, res, next));

// Produk & Menu
router.get('/products', (req, res, next) => productController.getPublicProducts(req, res, next));
router.get('/products/:slug', (req, res, next) => productController.getProductBySlug(req, res, next));

// Banners & Promos
router.get('/promos', (req, res, next) => contentController.getPromos(req, res, next));
router.get('/banners', (req, res, next) => contentController.getBanners(req, res, next));

// Galeri Foto
router.get('/galleries', (req, res, next) => contentController.getGalleries(req, res, next));

// Testimoni Publik
router.get('/testimonials', (req, res, next) => contentController.getTestimonials(req, res, next));
router.post('/testimonials', testimonialLimiter, (req, res, next) => contentController.submitTestimonial(req, res, next));

module.exports = router;
