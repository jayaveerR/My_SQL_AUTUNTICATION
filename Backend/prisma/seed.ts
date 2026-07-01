import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clean up existing data (Optional, handle with care in production)
  // await prisma.review.deleteMany();
  // await prisma.productImage.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.sellerProfile.deleteMany();
  
  // 2. Create Categories
  console.log('Creating categories...');
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics' },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: { name: 'Fashion', slug: 'fashion' },
  });

  const home = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: { name: 'Home & Garden', slug: 'home-garden' },
  });

  // 3. Create a Seller User
  console.log('Creating seller user...');
  const sellerPassword = await bcrypt.hash('password123', 10);
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@ecommhub.com' },
    update: {},
    create: {
      email: 'seller@ecommhub.com',
      password: sellerPassword,
      firstName: 'Premium',
      lastName: 'Seller',
      role: 'SELLER',
      isVerified: true,
      sellerProfile: {
        create: {
          storeName: 'Tech Haven',
          description: 'The best electronics on the market.',
          isVerified: true,
        }
      }
    },
    include: { sellerProfile: true }
  });

  if (!sellerUser.sellerProfile) {
    throw new Error('Seller profile creation failed');
  }

  // 4. Create Products
  console.log('Creating products...');
  const products = [
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5',
      brand: 'Sony',
      description: 'Industry leading noise canceling with two processors control 8 microphones for unprecedented noise cancellation. With Auto NC Optimizer, noise canceling is automatically optimized based on your wearing conditions and environment.',
      price: 348.00,
      stock: 50,
      isPublished: true,
      categoryId: electronics.id,
      sellerId: sellerUser.sellerProfile.id,
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      name: 'MacBook Pro 14-inch M2 Pro',
      slug: 'macbook-pro-14-m2-pro',
      brand: 'Apple',
      description: 'Take on demanding projects with the M2 Pro or M2 Max chip. M2 Pro has up to 12 CPU cores, up to 19 GPU cores, and up to 32GB unified memory.',
      price: 1999.00,
      stock: 15,
      isPublished: true,
      categoryId: electronics.id,
      sellerId: sellerUser.sellerProfile.id,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      name: 'Minimalist Modern Sofa',
      slug: 'minimalist-modern-sofa',
      brand: 'IKEA',
      description: 'Clean lines and a simple design make this sofa a perfect fit for any modern living room. Durable fabric and comfortable cushions.',
      price: 899.99,
      stock: 5,
      isPublished: true,
      categoryId: home.id,
      sellerId: sellerUser.sellerProfile.id,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      name: 'Premium Leather Jacket',
      slug: 'premium-leather-jacket',
      brand: 'AllSaints',
      description: 'A classic biker jacket made from premium leather. Features asymmetric zip fastening and metal hardware.',
      price: 495.00,
      stock: 20,
      isPublished: true,
      categoryId: fashion.id,
      sellerId: sellerUser.sellerProfile.id,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000'
      ]
    }
  ];

  for (const prod of products) {
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          brand: prod.brand,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          isPublished: prod.isPublished,
          categoryId: prod.categoryId,
          sellerId: prod.sellerId,
          averageRating: 4.5,
          totalReviews: 12,
          images: {
            create: prod.images.map((url, index) => ({
              url,
              isDefault: index === 0,
              order: index
            }))
          }
        }
      });
      console.log(`Created product: ${prod.name}`);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
