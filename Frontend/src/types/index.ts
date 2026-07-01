export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  role: Role;
  createdAt?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  lastLoginLocation?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sellerId: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}
