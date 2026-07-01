import axios from 'axios';
import type { Product, Category, PaginatedResponse } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productService = {
  getProducts: async (params?: ProductQueryParams) => {
    const response = await axios.get<PaginatedResponse<Product>>(`${API_URL}/products`, {
      params,
    });
    return response.data;
  },

  getProductBySlug: async (slug: string) => {
    const response = await axios.get<{ success: boolean; data: Product }>(`${API_URL}/products/${slug}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get<{ success: boolean; data: Category[] }>(`${API_URL}/categories`);
    return response.data;
  }
};
