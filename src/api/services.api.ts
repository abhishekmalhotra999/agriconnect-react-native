import apiClient from './apiClient';
import {Product} from '../models/Product';
import {Order} from '../models/order';
import {comingSoon} from '../constants/images';
import axios from 'axios';

type ServiceCategory = {
  id: number;
  name: string;
};

type ServiceListing = {
  id: number;
  title: string;
  description?: string | null;
  service_category_id?: number | null;
  service_area?: string | null;
  contact_email?: string | null;
  main_picture_url?: string | null;
  thumbnail_url?: string | null;
  gallery_urls?: string[] | string | null;
  is_active?: boolean;
  category?: ServiceCategory | null;
  avgRating?: number;
  reviewCount?: number;
  technician?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
  };
};

export type ServiceReview = {
  id: number;
  rating: number;
  comment?: string | null;
  reviewer?: {
    id?: number;
    name?: string | null;
  } | null;
};

export type ServiceCategoryOption = {
  id: number;
  name: string;
};

type ServiceListingFilters = {
  categoryId?: number | null;
  search?: string;
};

type ServiceRequest = {
  id: number;
  message: string;
  status: string;
  email_delivery_status?: string;
  requester_name: string;
  requester_phone: string;
  created_at: string;
  listing?: {
    title?: string;
    main_picture_url?: string | null;
    thumbnail_url?: string | null;
  };
};

const serviceFallbackImages = [
  require('../../assets/images/dump/au-eu-action-agenda-banner-555x325px_0.jpg'),
  require('../../assets/images/dump/Agricultural-Technology-in-Africa-1.jpg'),
  require('../../assets/images/dump/tractor-working-green-field_23-2151983626.jpg'),
];

const fallbackImage = comingSoon;

const getServiceFallbackImage = (seed: number) => {
  const list = serviceFallbackImages;
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

const mapServiceListingToProduct = (item: ServiceListing): Product => {
  const imageUrl = normalizeAssetUrl(item.main_picture_url || item.thumbnail_url);
  const description = String(item.description || '').trim();

  return {
    id: item.id,
    name: item.title || 'Untitled Service',
    price: 'R0',
    discountedPrice: 'R0',
    shortDescription: description.slice(0, 120),
    description,
    image: imageUrl ? {uri: imageUrl} : getServiceFallbackImage(item.id),
    imageUrl: imageUrl || undefined,
    category: item.category?.name || 'Service',
    categoryId: item.category?.id || item.service_category_id || null,
    status: item.is_active ? 'published' : 'draft',
    inStock: item.is_active !== false,
    rating: Number(item.avgRating || 0),
    ratingCount: Number(item.reviewCount || 0),
    serviceArea: String(item.service_area || '').trim() || undefined,
    contactEmail:
      String(item.contact_email || item.technician?.email || '').trim() || undefined,
    sellerName: String(item.technician?.name || '').trim() || undefined,
    sellerPhone: String(item.technician?.phone || '').trim() || undefined,
  };
};

const mapServiceRequestToOrder = (item: ServiceRequest): Order => {
  const imageUrl = normalizeAssetUrl(
    item.listing?.main_picture_url || item.listing?.thumbnail_url,
  );

  const rawStatus = String(item.status || 'pending').toLowerCase();
  const statusLabelMap: Record<string, string> = {
    new: 'Pending',
    pending: 'Pending',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  };

  return {
    id: item.id,
    name: item.listing?.title || item.requester_name || 'Service Request',
    amount: 'R0',
    quantity: 1,
    image: imageUrl ? {uri: imageUrl} : fallbackImage,
    status: statusLabelMap[rawStatus] || 'Pending',
    createdAt: String(item.created_at || '').slice(0, 10),
    requesterName: item.requester_name || '',
    requesterPhone: item.requester_phone || '',
    requesterEmail: '',
    message: item.message || '',
    emailDeliveryStatus: String(item.email_delivery_status || '').trim() || undefined,
    rawStatus,
  };
};

type UpsertServiceListingPayload = {
  title: string;
  description?: string;
  serviceCategoryId?: number | null;
  serviceArea?: string;
  contactEmail?: string;
  isActive: boolean;
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
  galleryUrls?: string[];
};

type CreateServiceRequestPayload = {
  serviceListingId: number;
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string;
  message: string;
};

const buildUpsertPayload = (payload: UpsertServiceListingPayload) => {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('description', payload.description || '');
  if (payload.serviceCategoryId !== undefined) {
    formData.append('service_category_id', String(payload.serviceCategoryId || ''));
  }
  formData.append('service_area', payload.serviceArea || '');
  formData.append('contact_email', payload.contactEmail || '');
  formData.append('is_active', String(payload.isActive));

  if (payload.mainPictureUrl) {
    formData.append('main_picture_url', payload.mainPictureUrl);
  }

  if (payload.mainPictureFile?.uri) {
    formData.append('main_picture_file', {
      uri: payload.mainPictureFile.uri,
      type: payload.mainPictureFile.type || 'image/jpeg',
      name: payload.mainPictureFile.fileName || 'service-thumbnail.jpg',
    } as any);
  }

  if (Array.isArray(payload.galleryUrls)) {
    formData.append('gallery_urls', JSON.stringify(payload.galleryUrls));
  }

  if (Array.isArray(payload.galleryFiles)) {
    payload.galleryFiles.forEach((file, index) => {
      if (!file?.uri) return;
      formData.append('gallery_files', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || `service-gallery-${index + 1}.jpg`,
      } as any);
    });
  }

  return formData;
};

export const getServiceCategories = () => {
  return apiClient.get('/api/services/categories').then(response => {
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map((item: any) => ({
      id: Number(item.id || 0),
      name: String(item.name || '').trim(),
    })) as ServiceCategoryOption[];
  });
};

export const getServiceListings = (filters?: ServiceListingFilters) => {
  const params: Record<string, any> = {};
  if (filters?.categoryId) {
    params.category_id = filters.categoryId;
  }

  const request = Object.keys(params).length
    ? apiClient.get('/api/services/listings', {params})
    : apiClient.get('/api/services/listings');

  return request.then(response => {
    const rows = Array.isArray(response.data) ? response.data : [];
    const mapped = rows.map(mapServiceListingToProduct);

    const searchQuery = String(filters?.search || '').trim().toLowerCase();
    if (!searchQuery) {
      return mapped;
    }

    return mapped.filter(item => {
      const name = String(item.name || '').toLowerCase();
      const description = String(item.description || item.shortDescription || '').toLowerCase();
      const category = String(item.category || '').toLowerCase();
      const serviceArea = String(item.serviceArea || '').toLowerCase();
      return (
        name.includes(searchQuery) ||
        description.includes(searchQuery) ||
        category.includes(searchQuery) ||
        serviceArea.includes(searchQuery)
      );
    });
  });
};

export const getServiceListingsByCategory = (categoryId: number) => {
  return getServiceListings({categoryId});
};

export const getMyServiceListings = () => {
  return apiClient.get('/api/services/listings/mine').then(response => {
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map(mapServiceListingToProduct);
  });
};

export const getServiceRequestsForTechnician = () => {
  return apiClient.get('/api/services/requests/for-technician').then(response => {
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map(mapServiceRequestToOrder);
  });
};

export const getServiceListingDetail = (listingId: number) => {
  return apiClient.get(`/api/services/listings/${listingId}`).then(response => {
    const row = response.data as ServiceListing;
    const product = mapServiceListingToProduct(row);
    const imageRows = Array.isArray(row.gallery_urls)
      ? row.gallery_urls
      : typeof row.gallery_urls === 'string'
      ? [row.gallery_urls]
      : [];
    const images = imageRows
      .map(value => normalizeAssetUrl(value))
      .filter((value): value is string => Boolean(value))
      .map(uri => ({uri}));

    return {
      product: {
        ...product,
        serviceArea: String(row.service_area || '').trim() || undefined,
        contactEmail: String(row.contact_email || row.technician?.email || '').trim() || undefined,
      },
      images,
      contactEmail: row.contact_email || row.technician?.email || '',
      technicianName: row.technician?.name || '',
    };
  });
};

export const getServiceListingReviews = (listingId: number) => {
  return apiClient.get(`/api/services/listings/${listingId}/reviews`).then(response => {
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map((item: any) => ({
      id: Number(item.id || 0),
      rating: Number(item.rating || 0),
      comment: item.comment || null,
      reviewer: item.reviewer || null,
    })) as ServiceReview[];
  });
};

export const createServiceListingReview = (
  listingId: number,
  payload: {rating: number; comment?: string | null},
) => {
  return apiClient
    .post(`/api/services/listings/${listingId}/reviews`, {
      rating: payload.rating,
      comment: payload.comment || null,
    })
    .then(response => response.data)
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};

export const createServiceRequest = (payload: CreateServiceRequestPayload) => {
  return apiClient
    .post('/api/services/requests', {
      service_listing_id: payload.serviceListingId,
      requester_name: payload.requesterName,
      requester_phone: payload.requesterPhone,
      requester_email: payload.requesterEmail || undefined,
      message: payload.message,
    })
    .then(response => response.data)
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};

export const getMyServiceRequests = () => {
  return apiClient.get('/api/services/requests/mine').then(response => {
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map(mapServiceRequestToOrder);
  });
};

export const createServiceListing = (payload: UpsertServiceListingPayload) => {
  return apiClient
    .post('/api/services/listings', buildUpsertPayload(payload), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => mapServiceListingToProduct(response.data as ServiceListing))
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};

export const updateServiceListing = (
  listingId: number,
  payload: UpsertServiceListingPayload,
) => {
  return apiClient
    .put(`/api/services/listings/${listingId}`, buildUpsertPayload(payload), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => mapServiceListingToProduct(response.data as ServiceListing))
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};
