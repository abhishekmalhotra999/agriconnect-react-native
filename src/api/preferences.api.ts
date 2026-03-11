import apiClient from './apiClient';

export type FarmerOnboarding = {
  completed?: boolean;
  completedAt?: number;
  storeName?: string;
  storeTagline?: string;
  businessType?: string;
  serviceArea?: string;
  contactPhone?: string;
  contactEmail?: string;
};

export type UserPreferencesResponse = {
  farmerOnboarding?: FarmerOnboarding;
  sellerStatus?: 'pending' | 'approved' | 'rejected';
  sellerStatusReason?: string | null;
  savedItems?: Array<{
    type: 'product' | string;
    id: string;
    title?: string;
    subtitle?: string;
    image?: string;
    link?: string;
  }>;
  recentItems?: Array<{
    type: 'product' | string;
    id: string;
    title?: string;
    subtitle?: string;
    image?: string;
    link?: string;
  }>;
};

export const getUserPreferences = async (): Promise<UserPreferencesResponse> => {
  const response = await apiClient.get('/api/users/preferences');
  return response.data;
};

export const saveFarmerOnboarding = async (
  farmerOnboarding: FarmerOnboarding,
): Promise<UserPreferencesResponse> => {
  const response = await apiClient.put('/api/users/preferences', {
    farmerOnboarding,
  });

  return response.data;
};

type PreferenceItem = {
  type: 'product' | string;
  id: string;
  title?: string;
  subtitle?: string;
  image?: string;
  link?: string;
};

const saveUserPreferences = async (
  payload: Partial<UserPreferencesResponse>,
): Promise<UserPreferencesResponse> => {
  const response = await apiClient.put('/api/users/preferences', payload);
  return response.data;
};

export const isProductSaved = async (productId: number | string) => {
  const preferences = await getUserPreferences();
  const targetId = String(productId);
  const savedItems = Array.isArray(preferences.savedItems)
    ? preferences.savedItems
    : [];
  return savedItems.some(
    item => String(item.id) === targetId && String(item.type) === 'product',
  );
};

export const toggleSavedProduct = async (item: PreferenceItem) => {
  const preferences = await getUserPreferences();
  const savedItems = Array.isArray(preferences.savedItems)
    ? [...preferences.savedItems]
    : [];
  const targetId = String(item.id);

  const existingIndex = savedItems.findIndex(
    savedItem =>
      String(savedItem.id) === targetId && String(savedItem.type) === 'product',
  );

  let nextSavedItems = savedItems;
  let nextState = true;

  if (existingIndex >= 0) {
    nextSavedItems = savedItems.filter((_, index) => index !== existingIndex);
    nextState = false;
  } else {
    nextSavedItems = [item, ...savedItems].slice(0, 100);
    nextState = true;
  }

  await saveUserPreferences({savedItems: nextSavedItems});
  return nextState;
};

export const trackRecentProduct = async (item: PreferenceItem) => {
  const preferences = await getUserPreferences();
  const recentItems = Array.isArray(preferences.recentItems)
    ? [...preferences.recentItems]
    : [];
  const targetId = String(item.id);

  const deduped = recentItems.filter(
    recentItem =>
      !(String(recentItem.id) === targetId && String(recentItem.type) === 'product'),
  );

  const nextRecentItems = [item, ...deduped].slice(0, 30);
  await saveUserPreferences({recentItems: nextRecentItems});
};
