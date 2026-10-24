const prisma = require('../lib/prisma');
const { mem } = require('../lib/store');

class ProductRepository {
  async findAll({ onlyActive = false, search = '', bestSellerOnly = false } = {}) {
    if (prisma) {
      try {
        const where = {};
        if (onlyActive) where.isActive = true;
        if (bestSellerOnly) where.isBestSeller = true;
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ];
        }

        const products = await prisma.product.findMany({
          where,
          include: { category: true },
          orderBy: { id: 'asc' }
        });

        return products.map(p => ({
          ...p,
          category: p.category?.name || ''
        }));
      } catch (err) {
        console.warn('[ProductRepository.findAll] DB fallback to mem:', err.message);
      }
    }

    let result = mem.products;
    if (onlyActive) result = result.filter(p => p.isActive);
    if (bestSellerOnly) result = result.filter(p => p.isBestSeller);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => (p.name + p.description).toLowerCase().includes(q));
    }
    return result;
  }

  async findBySlug(slug) {
    if (prisma) {
      try {
        const product = await prisma.product.findUnique({
          where: { slug },
          include: { category: true }
        });
        if (product) {
          return { ...product, category: product.category?.name || '' };
        }
      } catch (err) {
        console.warn('[ProductRepository.findBySlug] DB fallback to mem:', err.message);
      }
    }
    return mem.products.find(p => p.slug === slug) || null;
  }

  async findById(id) {
    if (prisma) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: Number(id) },
          include: { category: true }
        });
        if (product) {
          return { ...product, category: product.category?.name || '' };
        }
      } catch (err) {
        console.warn('[ProductRepository.findById] DB fallback to mem:', err.message);
      }
    }
    return mem.products.find(p => p.id === Number(id)) || null;
  }

  async create(productData) {
    const { name, slug, description, price, stock, imageUrl, category, isBestSeller, isActive } = productData;

    if (prisma) {
      try {
        let categoryId = null;
        if (category) {
          const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const cat = await prisma.category.upsert({
            where: { slug: catSlug },
            update: {},
            create: { name: category, slug: catSlug }
          });
          categoryId = cat.id;
        }

        const created = await prisma.product.create({
          data: {
            name,
            slug,
            description,
            price: Number(price),
            stock: Number(stock),
            imageUrl,
            categoryId,
            isBestSeller: Boolean(isBestSeller),
            isActive: Boolean(isActive)
          },
          include: { category: true }
        });

        return { ...created, category: created.category?.name || category || '' };
      } catch (err) {
        console.warn('[ProductRepository.create] DB fallback to mem:', err.message);
      }
    }

    const newProduct = {
      id: Date.now(),
      name,
      slug,
      description: description || '',
      price: Number(price || 0),
      stock: Number(stock || 0),
      imageUrl: imageUrl || '',
      category: category || '',
      isBestSeller: Boolean(isBestSeller),
      isActive: Boolean(isActive)
    };
    mem.products.push(newProduct);
    return newProduct;
  }

  async update(id, productData) {
    const { name, description, price, stock, imageUrl, category, isBestSeller, isActive } = productData;

    if (prisma) {
      try {
        let categoryId = undefined;
        if (category) {
          const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const cat = await prisma.category.upsert({
            where: { slug: catSlug },
            update: { name: category },
            create: { name: category, slug: catSlug }
          });
          categoryId = cat.id;
        }

        const updated = await prisma.product.update({
          where: { id: Number(id) },
          data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            imageUrl,
            ...(categoryId !== undefined && { categoryId }),
            isBestSeller: Boolean(isBestSeller),
            isActive: Boolean(isActive)
          },
          include: { category: true }
        });

        return { ...updated, category: updated.category?.name || category || '' };
      } catch (err) {
        console.warn('[ProductRepository.update] DB fallback to mem:', err.message);
      }
    }

    const idx = mem.products.findIndex(p => p.id === Number(id));
    if (idx >= 0) {
      mem.products[idx] = {
        ...mem.products[idx],
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl !== undefined ? imageUrl : mem.products[idx].imageUrl,
        category: category || mem.products[idx].category,
        isBestSeller: Boolean(isBestSeller),
        isActive: Boolean(isActive)
      };
      return mem.products[idx];
    }
    return null;
  }

  async delete(id) {
    if (prisma) {
      try {
        await prisma.product.delete({ where: { id: Number(id) } });
        return true;
      } catch (err) {
        console.warn('[ProductRepository.delete] DB fallback to mem:', err.message);
      }
    }
    mem.products = mem.products.filter(p => p.id !== Number(id));
    return true;
  }

  async count() {
    if (prisma) {
      try {
        return await prisma.product.count();
      } catch (err) {
        console.warn('[ProductRepository.count] DB fallback to mem:', err.message);
      }
    }
    return mem.products.length;
  }
}

module.exports = new ProductRepository();
