import apiClient from './apiClient';
import {Product} from '../models/Product';
import {comingSoon} from '../constants/images';
import axios from 'axios';

type MarketplaceCategory = {
  id: number;
  name: string;
};

type MarketplaceProduct = {
  id: number;
  title: string;
  description?: string | null;
  gallery_urls?: string[] | string | null;
  main_picture_url?: string | null;
  thumbnail_url?: string | null;
  unit_price?: number | string | null;
  sale_price?: number | string | null;
  discounted_price?: number | string | null;
  offer_price?: number | string | null;
  stock_quantity?: number | string | null;
  status?: string | null;
  category?: MarketplaceCategory | null;
  farmer?: {
    id?: number;
    name?: string | null;
    phone?: string | null;
  } | null;
  avgRating?: number;
  reviewCount?: number;
};

export type MarketplaceReview = {
  id: number;
  rating: number;
  comment?: string | null;
  reviewer?: {
    id?: number;
    name?: string | null;
  } | null;
};

const fallbackImage = comingSoon;

const normalizeAssetUrl = (value?: string | null): string | null => {
  if (!value) return null;
  if (value.indexOf('http://') === 0 || value.indexOf('https://') === 0) {
    return value;
  }

  const base = String(apiClient.defaults.baseURL || '').replace(/\/$/, '');
  if (!base) return null;
  return `${base}${value.indexOf('/') === 0 ? value : `/${value}`}`;
};

const toDisplayPrice = (value?: number | string | null): string => {
  const amount = Number(value || 0);
  if (isNaN(amount)) {
    return 'R0';
  }
  return `R${amount}`;
};

const mapMarketplaceProduct = (item: MarketplaceProduct): Product => {
  const imageUrl = normalizeAssetUrl(item.main_picture_url || item.thumbnail_url);
  const description = String(item.description || '').trim();
  const stockCount = Number(item.stock_quantity || 0);

  return {
    id: item.id,
    name: item.title || 'Untitled Product',
    price: toDisplayPrice(item.unit_price),
    discountedPrice: toDisplayPrice(
      item.sale_price ?? item.discounted_price ?? item.offer_price ?? item.unit_price,
    ),
    shortDescription: description.slice(0, 120),
    description,
    image: imageUrl ? {uri: imageUrl} : fallbackImage,
    imageUrl: imageUrl || undefined,
    category: item.category?.name || 'General',
    categoryId: item.category?.id || null,
    status: item.status || 'draft',
    unitPrice: Number(item.unit_price || 0),
    salePrice: Number(
      item.sale_price ?? item.discounted_price ?? item.offer_price ?? item.unit_price ?? 0,
    ),
    stockQuantity: stockCount,
    inStock: stockCount > 0,
    rating: Number(item.avgRating || 0),
    ratingCount: Number(item.reviewCount || 0),
    sellerName: String(item.farmer?.name || '').trim() || undefined,
    sellerPhone: String(item.farmer?.phone || '').trim() || undefined,
  };
};

const parseApiError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong. Please try again.';
  }

  const payload = error.response?.data as
    | {errors?: string | string[]; message?: string}
    | undefined;

  if (Array.isArray(payload?.errors)) {
    return payload.errors.join(', ');
  }

  if (typeof payload?.errors === 'string') {
    return payload.errors;
  }

  if (typeof payload?.message === 'string') {
    return payload.message;
  }

  return 'Unable to connect to the server.';
};

type UpsertMarketplaceProductPayload = {
  title: string;
  description?: string;
  categoryId?: number | null;
  unitPrice: number;
  salePrice?: number;
  stockQuantity: number;
  status: 'draft' | 'published';
  mainPictureUrl?: string;
  mainPictureFile?: {
    uri: string;
    type?: string;
    fileName?: string;
  };
  galleryFiles?: Array<{
    uri: string;
    type?: string;
    fileName?: string;
  }>;
};

const buildUpsertPayload = (payload: UpsertMarketplaceProductPayload) => {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('description', payload.description || '');
  formData.append('category_id', String(payload.categoryId || ''));
  formData.append('unit_price', String(payload.unitPrice));
  if (payload.salePrice !== undefined) {
    formData.append('sale_price', String(payload.salePrice));
  }
  formData.append('stock_quantity', String(payload.stockQuantity));
  formData.append('status', payload.status);

  if (payload.mainPictureUrl) {
    formData.append('main_picture_url', payload.mainPictureUrl);
  }

  if (payload.mainPictureFile?.uri) {
    formData.append('main_picture_file', {
      uri: payload.mainPictureFile.uri,
      type: payload.mainPictureFile.type || 'image/jpeg',
      name: payload.mainPictureFile.fileName || 'thumbnail.jpg',
    } as any);
  }

  if (Array.isArray(payload.galleryFiles)) {
    payload.galleryFiles.forEach((file, index) => {
      if (!file?.uri) return;
      formData.append('gallery_files', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || `gallery-${index + 1}.jpg`,
      } as any);
    });
  }

  return formData;
};

const toGalleryImages = (item: MarketplaceProduct) => {
  const source = item.gallery_urls;
  let gallery: string[] = [];

  if (Array.isArray(source)) {
    gallery = source as string[];
  } else if (typeof source === 'string') {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) {
        gallery = parsed;
      }
    } catch (_error) {
      gallery = source
        .split(',')
        .map(itemUrl => itemUrl.trim())
        .filter(Boolean);
    }
  }

  const normalizedGallery = gallery
    .map(itemUrl => normalizeAssetUrl(itemUrl))
    .filter(Boolean)
    .map(itemUrl => ({uri: itemUrl as string}));

  if (normalizedGallery.length > 0) {
    return normalizedGallery;
  }

  const fallbackMain = normalizeAssetUrl(
    item.main_picture_url || item.thumbnail_url,
  );

  return fallbackMain ? [{uri: fallbackMain}] : [fallbackImage];
};

export const getMarketplaceProducts = () => {
  return apiClient.get('/api/marketplace/products').then(response => {
    const products = Array.isArray(response.data) ? response.data : [];
    return products.map(mapMarketplaceProduct);
  });
};

export const getMarketplaceProductsByCategory = (categoryId: number) => {
  return apiClient
    .get('/api/marketplace/products', {
      params: {category_id: categoryId},
    })
    .then(response => {
      const products = Array.isArray(response.data) ? response.data : [];
      return products.map(mapMarketplaceProduct);
    });
};

export const getMyMarketplaceProducts = () => {
  return apiClient.get('/api/marketplace/products/mine').then(response => {
    const products = Array.isArray(response.data) ? response.data : [];
    return products.map(mapMarketplaceProduct);
  });
};

export const getMarketplaceProductDetail = (id: number) => {
  return apiClient.get(`/api/marketplace/products/${id}`).then(response => {
    const payload = (response.data || {}) as MarketplaceProduct;
    return {
      product: mapMarketplaceProduct(payload),
      images: toGalleryImages(payload),
    };
  });
};

export const getMarketplaceProductReviews = (productId: number) => {
  return apiClient
    .get(`/api/marketplace/products/${productId}/reviews`)
    .then(response => {
      const reviews = Array.isArray(response.data) ? response.data : [];
      return reviews.map((item: any) => ({
        id: Number(item.id || 0),
        rating: Number(item.rating || 0),
        comment: item.comment || null,
        reviewer: item.reviewer || null,
      })) as MarketplaceReview[];
    });
};

export const createMarketplaceProductReview = (
  productId: number,
  payload: {rating: number; comment?: string | null},
) => {
  return apiClient
    .post(`/api/marketplace/products/${productId}/reviews`, {
      rating: payload.rating,
      comment: payload.comment || null,
    })
    .then(response => response.data)
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};

export const createMarketplaceProduct = (
  payload: UpsertMarketplaceProductPayload,
) => {
  return apiClient
    .post('/api/marketplace/products', buildUpsertPayload(payload), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => mapMarketplaceProduct(response.data as MarketplaceProduct))
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};

export const updateMarketplaceProduct = (
  productId: number,
  payload: UpsertMarketplaceProductPayload,
) => {
  return apiClient
    .put(`/api/marketplace/products/${productId}`, buildUpsertPayload(payload), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => mapMarketplaceProduct(response.data as MarketplaceProduct))
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};
