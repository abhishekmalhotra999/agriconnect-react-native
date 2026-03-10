import React, { createContext, useState } from 'react';
import { ProductProviderProps } from '../navigation/types';
import { Product } from '../models/Product';

interface ProductsContextProps {
  products: Product[];
  handleSetProducts: (data: Product[]) => void;
}

export const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const ProductsProvider: React.FC<ProductProviderProps> = ({ 
  children,
  initialProducts,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleSetProducts = (data: Product[]) => {
    setProducts(data)
  }

  return (
    <ProductsContext.Provider value={{ 
      products,
      handleSetProducts
    }}>
      {children}
    </ProductsContext.Provider>
  );
};