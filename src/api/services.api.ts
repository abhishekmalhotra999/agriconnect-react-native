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

type ServiceRequest = {
  id: number;
  message: string;
  status: string;
  requester_name: string;
  requester_phone: string;
  created_at: string;
  listing?: {
    title?: string;
    main_picture_url?: string | null;
    thumbnail_url?: string | null;
  };
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
    image: imageUrl ? {uri: imageUrl} : fallbackImage,
    imageUrl: imageUrl || undefined,
    category: item.category?.name || 'Service',
    categoryId: item.category?.id || null,
    status: item.is_active ? 'published' : 'draft',
    inStock: item.is_active !== false,
    rating: Number(item.avgRating || 0),
    ratingCount: Number(item.reviewCount || 0),
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
  };
};

type UpsertServiceListingPayload = {
  title: string;
  description?: string;
  serviceArea?: string;
  contactEmail?: string;
  isActive: boolean;
  mainPictureUrl?: string;
};

type CreateServiceRequestPayload = {
  serviceListingId: number;
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string;
  message: string;
};

const buildUpsertPayload = (payload: UpsertServiceListingPayload) => {
  return {
    title: payload.title,
    description: payload.description || '',
    service_area: payload.serviceArea || '',
    contact_email: payload.contactEmail || '',
    is_active: payload.isActive,
    main_picture_url: payload.mainPictureUrl || undefined,
  };
};

export const getServiceListings = () => {
  return apiClient.get('/api/services/listings').then(response => {
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map(mapServiceListingToProduct);
  });
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
      product,
      images,
      contactEmail: row.contact_email || row.technician?.email || '',
      technicianName: row.technician?.name || '',
    };
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
    .post('/api/services/listings', buildUpsertPayload(payload))
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
    .put(`/api/services/listings/${listingId}`, buildUpsertPayload(payload))
    .then(response => mapServiceListingToProduct(response.data as ServiceListing))
    .catch(error => {
      throw new Error(parseApiError(error));
    });
};
