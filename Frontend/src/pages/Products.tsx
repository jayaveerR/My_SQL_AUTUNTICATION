import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { productService } from '../services/product.service';
import type { Product, Category } from '../types/product';
import { ProductCard } from '../components/products/ProductCard';
import { ProductSkeleton } from '../components/ui/ProductSkeleton';
import { slideUp } from '../ux/transitions';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // Update URL params
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await productService.getCategories();
      if (res.success) setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts({
        category: selectedCategory,
        search: searchQuery
      });
      if (res.success) setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      variants={slideUp}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto px-6 md:px-10 py-12 w-full flex flex-col md:flex-row gap-10 relative z-10"
    >
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Filter size={20} className="text-[#E3EF26]" />
            Filters
          </h2>
          
          {/* Categories */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Categories</h3>
            <button
              onClick={() => setSelectedCategory('')}
              className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === '' ? 'bg-[#E3EF26] text-black font-bold' : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.slug ? 'bg-[#E3EF26] text-black font-bold' : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Products'}
            </h1>
            <p className="text-neutral-400 text-sm">
              Showing {products.length} result{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="appearance-none bg-black/40 border border-[#076653]/40 rounded-lg py-2 pl-4 pr-10 text-white text-sm focus:outline-none focus:border-[#E3EF26]/50">
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel border-[#076653]/30">
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-neutral-400">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
              className="mt-6 text-[#E3EF26] hover:underline font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default Products;
