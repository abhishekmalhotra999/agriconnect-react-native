import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = 'agri:marketplace:cart:v1';
const PLACED_ORDERS_STORAGE_KEY = 'agri:marketplace:placed-orders:v1';

export type CartLineItem = {
  productId: string;
  name: string;
  unitPrice: number;
  priceLabel: string;
  imageUrl?: string;
  quantity: number;
};

export type PlacedMarketplaceOrder = {
  id: string;
  createdAt: string;
  totalAmount: number;
  totalAmountLabel: string;
  status: 'Placed';
  items: CartLineItem[];
};

type ProductLike = {
  id: string | number;
  name?: string;
  price?: string;
  unitPrice?: number;
  imageUrl?: string;
};

const parseCurrencyNumber = (value?: string) => {
  const parsed = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (amount: number) => `R${Math.max(0, Number(amount || 0)).toFixed(2).replace(/\.00$/, '')}`;

const safeJsonParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch {
    return fallback;
  }
};

export const getCartItems = async (): Promise<CartLineItem[]> => {
  const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
  const parsed = safeJsonParse<CartLineItem[]>(raw, []);
  return Array.isArray(parsed) ? parsed : [];
};

const saveCartItems = async (items: CartLineItem[]) => {
  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const clearCartItems = async () => {
  await saveCartItems([]);
};

export const addProductToCart = async (
  product: ProductLike,
  quantity = 1,
): Promise<CartLineItem[]> => {
  const productId = String(product?.id || '').trim();
  if (!productId) {
    return getCartItems();
  }

  const safeQty = Math.max(1, Number(quantity || 1));
  const existing = await getCartItems();
  const unitPrice =
    Number.isFinite(Number(product.unitPrice)) && Number(product.unitPrice) > 0
      ? Number(product.unitPrice)
      : parseCurrencyNumber(product.price);

  const next = [...existing];
  const index = next.findIndex(item => String(item.productId) === productId);

  if (index >= 0) {
    const current = next[index];
    next[index] = {
      ...current,
      quantity: current.quantity + safeQty,
      unitPrice: current.unitPrice || unitPrice,
      priceLabel: current.priceLabel || formatCurrency(current.unitPrice || unitPrice),
      imageUrl: current.imageUrl || product.imageUrl,
    };
  } else {
    next.push({
      productId,
      name: String(product.name || 'Marketplace Item'),
      quantity: safeQty,
      unitPrice,
      priceLabel: formatCurrency(unitPrice),
      imageUrl: product.imageUrl,
    });
  }

  await saveCartItems(next);
  return next;
};

export const updateCartItemQuantity = async (
  productId: string,
  quantity: number,
): Promise<CartLineItem[]> => {
  const safeQty = Math.max(0, Number(quantity || 0));
  const existing = await getCartItems();
  const next = existing
    .map(item =>
      String(item.productId) === String(productId)
        ? {
            ...item,
            quantity: safeQty,
          }
        : item,
    )
    .filter(item => item.quantity > 0);

  await saveCartItems(next);
  return next;
};

export const removeCartItem = async (productId: string): Promise<CartLineItem[]> => {
  const existing = await getCartItems();
  const next = existing.filter(item => String(item.productId) !== String(productId));
  await saveCartItems(next);
  return next;
};

export const getCartTotals = (items: CartLineItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.unitPrice || 0) * Number(item.quantity || 0)),
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const delivery = subtotal > 0 ? 20 : 0;
  const total = subtotal + delivery;

  return {
    subtotal,
    delivery,
    total,
    totalItems,
    subtotalLabel: formatCurrency(subtotal),
    deliveryLabel: formatCurrency(delivery),
    totalLabel: formatCurrency(total),
  };
};

export const getPlacedMarketplaceOrders = async (): Promise<PlacedMarketplaceOrder[]> => {
  const raw = await AsyncStorage.getItem(PLACED_ORDERS_STORAGE_KEY);
  const parsed = safeJsonParse<PlacedMarketplaceOrder[]>(raw, []);
  return Array.isArray(parsed) ? parsed : [];
};

const savePlacedMarketplaceOrders = async (orders: PlacedMarketplaceOrder[]) => {
  await AsyncStorage.setItem(PLACED_ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export const addPlacedMarketplaceOrder = async (
  payload: Pick<PlacedMarketplaceOrder, 'items' | 'totalAmount' | 'totalAmountLabel'>,
) => {
  const existing = await getPlacedMarketplaceOrders();
  const nextOrder: PlacedMarketplaceOrder = {
    id: `po-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Placed',
    items: payload.items,
    totalAmount: payload.totalAmount,
    totalAmountLabel: payload.totalAmountLabel,
  };

  const next = [nextOrder, ...existing];
  await savePlacedMarketplaceOrders(next);
  return nextOrder;
};
