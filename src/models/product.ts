export interface Product {
  id: any;
  name: string;
  price: string;
  discountedPrice: string;
  image: any;
  category: string;
  categoryId?: number | null;
  status?: string;
  unitPrice?: number;
  salePrice?: number;
  stockQuantity?: number;
  imageUrl?: string;
  shortDescription: string;
  description: string;
  inStock: boolean;
  rating: number;
  ratingCount: number;
  sellerName?: string;
  sellerPhone?: string;
}