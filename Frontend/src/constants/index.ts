export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  PRODUCT_DETAILS: (id: string | number) => `/products/${id}`,
  CART: '/cart',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/initiate',
    VERIFY: '/auth/verify',
    FINALIZE: '/auth/finalize',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id: string | number) => `/products/${id}`,
    FEATURED: '/products/featured',
  },
  CATEGORIES: {
    LIST: '/categories',
  },
};
