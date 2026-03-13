import apiClient from './apiClient';
import {Product} from '../models/Product';
import {Order} from '../models/order';
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
  avg_rating?: number;
  review_count?: number;
  reviews_count?: number;
  total_reviews?: number;
  totalReviews?: number;
  reviewsCount?: number;
  ratingsCount?: number;
  rating?: number;
  rating_count?: number;
  ratingCount?: number;
  averageRating?: number;
  average_rating?: number;
  reviewStats?: {
    reviewCount?: number;
    count?: number;
    avgRating?: number;
    average?: number;
  };
  review_stats?: {
    review_count?: number;
    count?: number;
    avg_rating?: number;
    average?: number;
  };
  review_summary?: {
    count?: number;
    average?: number;
  };
  ratings?: {
    count?: number;
    average?: number;
  };
  reviews?: Array<{rating?: number}>;
};

type MarketplaceIncomingOrder = {
  id: string | number;
  name?: string;
  amount?: string | number;
  quantity?: number;
  image_url?: string | null;
  status?: string;
  raw_status?: string;
  created_at?: string;
  requester_name?: string;
  requester_phone?: string;
  requester_email?: string;
  message?: string;
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

const marketplaceFallbackImages = [
  require('../../assets/images/dump/Regenerative-agriculture-farmer.jpg'),
  require('../../assets/images/dump/so-many-vegetables-this-field_181624-18619 (1).jpg'),
  require('../../assets/images/dump/smart-agriculture-iot-with-hand-planting-tree-background_538 (3).jpg'),
];

const fallbackImage = comingSoon;

const getMarketplaceFallbackImage = (seed: number) => {
  const list = marketplaceFallbackImages;
  return list[Math.abs(Number(seed || 0)) % list.length] || fallbackImage;
};

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

const toFiniteNumber = (...values: Array<number | string | null | undefined>) => {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return 0;
};

const toReviewMetrics = (item: MarketplaceProduct) => {
  const reviewStats = item.reviewStats || item.review_stats || item.review_summary || item.ratings || {};

  const directCount = toFiniteNumber(
    item.reviewCount,
    item.review_count,
    item.reviews_count,
    item.total_reviews,
    item.totalReviews,
    item.reviewsCount,
    item.rating_count,
    item.ratingCount,
    item.ratingsCount,
    (reviewStats as any).reviewCount,
    (reviewStats as any).review_count,
    (reviewStats as any).count,
  );
  const directAverage = toFiniteNumber(
    item.avgRating,
    item.avg_rating,
    item.averageRating,
    item.average_rating,
    item.rating,
    (reviewStats as any).avgRating,
    (reviewStats as any).avg_rating,
    (reviewStats as any).average,
  );

  if (directCount > 0 || directAverage > 0) {
    return {
      rating: Number.isFinite(directAverage) ? directAverage : 0,
      ratingCount: Number.isFinite(directCount) ? directCount : 0,
    };
  }

  const reviews = Array.isArray(item.reviews) ? item.reviews : [];
  if (reviews.length === 0) {
    return {rating: 0, ratingCount: 0};
  }

  const total = reviews.reduce((sum, row) => sum + Number(row?.rating || 0), 0);
  return {
    rating: Number((total / reviews.length).toFixed(1)),
    ratingCount: reviews.length,
  };
};

const mapMarketplaceProduct = (item: MarketplaceProduct): Product => {
  const imageUrl = normalizeAssetUrl(item.main_picture_url || item.thumbnail_url);
  const description = String(item.description || '').trim();
  const stockCount = Number(item.stock_quantity || 0);
  const metrics = toReviewMetrics(item);

  return {
    id: item.id,
    name: item.title || 'Untitled Product',
    price: toDisplayPrice(item.unit_price),
    discountedPrice: toDisplayPrice(
      item.sale_price ?? item.discounted_price ?? item.offer_price ?? item.unit_price,
    ),
    shortDescription: description.slice(0, 120),
    description,
    image: imageUrl ? {uri: imageUrl} : getMarketplaceFallbackImage(item.id),
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
    rating: metrics.rating,
    ratingCount: metrics.ratingCount,
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

const mapMarketplaceIncomingOrder = (item: MarketplaceIncomingOrder): Order => {
  const imageUrl = normalizeAssetUrl(item.image_url);
  const amountValue =
    typeof item.amount === 'string'
      ? item.amount
      : `R${Number(item.amount || 0) || 0}`;

  return {
    id: item.id,
    name: String(item.name || 'Marketplace Order Request'),
    amount: amountValue,
    quantity: Number(item.quantity || 1) || 1,
    image: imageUrl ? {uri: imageUrl} : fallbackImage,
    status: String(item.status || 'New'),
    createdAt: String(item.created_at || '').slice(0, 10),
    requesterName: String(item.requester_name || ''),
    requesterPhone: String(item.requester_phone || ''),
    requesterEmail: String(item.requester_email || ''),
    message: String(item.message || ''),
    rawStatus: String(item.raw_status || 'new'),
    emailDeliveryStatus: undefined,
  };
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
  galleryUrls?: string[];
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

  if (Array.isArray(payload.galleryUrls)) {
    formData.append('gallery_urls', JSON.stringify(payload.galleryUrls));
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

const parseGalleryUrls = (source?: string[] | string | null): string[] => {
  if (!source) {
    return [];
  }

  if (Array.isArray(source)) {
    return source.map(item => String(item || '').trim()).filter(Boolean);
  }

  if (typeof source === 'string') {
    const value = source.trim();
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item || '').trim()).filter(Boolean);
      }
    } catch (_error) {
      return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    }
  }

  return [];
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
    const galleryUrls = parseGalleryUrls(payload.gallery_urls)
      .map(item => normalizeAssetUrl(item))
      .filter((item): item is string => Boolean(item));
    return {
      product: mapMarketplaceProduct(payload),
      images: toGalleryImages(payload),
      galleryUrls,
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

export const deleteMarketplaceProduct = (productId: number) => {
  return apiClient
    .delete(`/api/marketplace/products/${productId}`)
    .then(() => true)
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};

export const createMarketplaceOrderRequest = (
  productId: number,
  payload?: {
    quantity?: number;
    message?: string;
    requesterName?: string;
    requesterPhone?: string;
    requesterEmail?: string;
  },
) => {
  return apiClient
    .post(`/api/marketplace/products/${productId}/order-requests`, {
      quantity: Number(payload?.quantity || 1),
      message: payload?.message || undefined,
      requester_name: payload?.requesterName || undefined,
      requester_phone: payload?.requesterPhone || undefined,
      requester_email: payload?.requesterEmail || undefined,
    })
    .then(response => response.data)
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};

export const getIncomingMarketplaceOrders = () => {
  return apiClient
    .get('/api/marketplace/products/incoming-orders')
    .then(response => {
      const rows = Array.isArray(response.data) ? response.data : [];
      return rows.map((item: MarketplaceIncomingOrder) =>
        mapMarketplaceIncomingOrder(item),
      );
    })
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};
