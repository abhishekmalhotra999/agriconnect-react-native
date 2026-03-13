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
  notifications?: UserNotification[];
  recentItems?: Array<{
    type: 'product' | string;
    id: string;
    title?: string;
    subtitle?: string;
    image?: string;
    link?: string;
  }>;
};

export type UserNotification = {
  id?: string | number;
  title?: string;
  message?: string;
  body?: string;
  text?: string;
  type?: string;
  source?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string | number;
  timestamp?: string | number;
  link?: string;
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

export type PreferenceItemType = 'product' | 'service' | 'course' | string;

type PreferenceItem = {
  type: PreferenceItemType;
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

export const getUserNotifications = async (): Promise<UserNotification[]> => {
  const preferences = await getUserPreferences();
  return Array.isArray(preferences.notifications) ? preferences.notifications : [];
};

export const markAllNotificationsAsRead = async (
  notifications: UserNotification[],
): Promise<UserPreferencesResponse> => {
  const normalized = notifications.map(notification => ({
    ...notification,
    read: true,
    isRead: true,
  }));

  return saveUserPreferences({notifications: normalized});
};

export const isProductSaved = async (productId: number | string) => {
  return isPreferenceSaved('product', productId);
};

export const isPreferenceSaved = async (
  itemType: PreferenceItemType,
  itemId: number | string,
) => {
  const preferences = await getUserPreferences();
  const targetId = String(itemId);
  const savedItems = Array.isArray(preferences.savedItems)
    ? preferences.savedItems
    : [];
  return savedItems.some(
    item => String(item.id) === targetId && String(item.type) === String(itemType),
  );
};

export const toggleSavedProduct = async (item: PreferenceItem) => {
  return toggleSavedPreference('product', item);
};

export const toggleSavedPreference = async (
  itemType: PreferenceItemType,
  item: PreferenceItem,
) => {
  const preferences = await getUserPreferences();
  const savedItems = Array.isArray(preferences.savedItems)
    ? [...preferences.savedItems]
    : [];
  const targetId = String(item.id);

  const existingIndex = savedItems.findIndex(
    savedItem =>
      String(savedItem.id) === targetId &&
      String(savedItem.type) === String(itemType),
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
  return trackRecentPreference('product', item);
};

export const trackRecentPreference = async (
  itemType: PreferenceItemType,
  item: PreferenceItem,
) => {
  const preferences = await getUserPreferences();
  const recentItems = Array.isArray(preferences.recentItems)
    ? [...preferences.recentItems]
    : [];
  const targetId = String(item.id);

  const deduped = recentItems.filter(
    recentItem =>
      !(
        String(recentItem.id) === targetId &&
        String(recentItem.type) === String(itemType)
      ),
  );

  const nextRecentItems = [item, ...deduped].slice(0, 30);
  await saveUserPreferences({recentItems: nextRecentItems});
};
