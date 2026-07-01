export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  subCategories?: Category[];
}

export interface ProductImage {
  id: number;
  url: string;
  isDefault: boolean;
  order: number;
}

export interface ProductSeller {
  id: number;
  storeName: string;
  isVerified: boolean;
  description?: string;
  logoUrl?: string;
}

export interface ProductReview {
  id: number;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand?: string;
  description: string;
  price: string | number;
  stock: number;
  averageRating: string | number;
  totalReviews: number;
  isPublished: boolean;
  images: ProductImage[];
  category: {
    name: string;
    slug: string;
  };
  seller: ProductSeller;
  reviews?: ProductReview[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
