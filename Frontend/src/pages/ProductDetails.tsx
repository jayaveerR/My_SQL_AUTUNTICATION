import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Truck, ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { productService } from '../services/product.service';
import type { Product } from '../types/product';
import { ImageGallery } from '../components/products/ImageGallery';
import { Button } from '../ui/Button';
import { slideUp } from '../ux/transitions';
import { Loader } from '../ui/Loader';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) fetchProduct(slug);
  }, [slug]);

  const fetchProduct = async (productSlug: string) => {
    setIsLoading(true);
    try {
      const res = await productService.getProductBySlug(productSlug);
      if (res.success) setProduct(res.data);
    } catch (error) {
      console.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Product Not Found</h2>
        <Link to="/products" className="text-[#E3EF26] hover:underline">Return to Catalog</Link>
      </div>
    );
  }

  const price = Number(product.price).toFixed(2);
  const rating = Number(product.averageRating).toFixed(1);

  return (
    <motion.div 
      variants={slideUp}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto px-6 md:px-10 py-12 w-full relative z-10"
    >
      <Link to="/products" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Gallery */}
        <div className="w-full">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-6">
            {product.brand && (
              <span className="text-[#E3EF26] font-bold tracking-widest uppercase text-xs mb-2 block">
                {product.brand}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-[#E3EF26]">
                <Star fill="currentColor" size={18} />
                <span className="font-bold text-base">{rating}</span>
                <span className="text-neutral-400 font-normal">({product.totalReviews} reviews)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-600" />
              <span className="text-neutral-400">{product.category.name}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-end gap-4 mb-2">
              <span className="text-5xl font-black text-white">${price}</span>
              <span className="text-xl text-neutral-500 line-through mb-1">${(Number(price) * 1.2).toFixed(2)}</span>
            </div>
            {product.stock > 0 ? (
              <span className="text-green-400 font-medium text-sm">In Stock - {product.stock} available</span>
            ) : (
              <span className="text-red-400 font-medium text-sm">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-invert mb-10 max-w-none">
            <p className="text-neutral-300 text-lg leading-relaxed">{product.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-black/40 border border-[#076653]/40 rounded-lg overflow-hidden h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                >-</button>
                <span className="w-12 text-center font-bold text-lg text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-full flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                >+</button>
              </div>
              <Button 
                className="flex-1 !h-14 text-lg font-bold shadow-[0_0_20px_rgba(227,239,38,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </Button>
              <button className="w-14 h-14 shrink-0 rounded-lg bg-black/40 border border-[#076653]/40 flex items-center justify-center text-neutral-400 hover:text-red-400 hover:border-red-400/50 transition-colors">
                <Heart size={24} />
              </button>
            </div>
          </div>

          {/* Seller & Trust Info */}
          <div className="flex flex-col gap-4 p-6 glass-panel border-[#076653]/30">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#076653]/30 flex items-center justify-center font-bold text-[#E3EF26]">
                  {product.seller.storeName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Sold by {product.seller.storeName}</h4>
                  {product.seller.isVerified && (
                    <span className="text-[#E3EF26] text-xs font-medium flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified Seller
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Truck size={16} className="text-neutral-300" /> Free Global Shipping
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-600" />
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <ShieldCheck size={16} className="text-neutral-300" /> 30-Day Returns
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
