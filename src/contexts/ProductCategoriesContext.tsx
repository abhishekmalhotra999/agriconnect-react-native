import React, { createContext, useState, useContext } from 'react';
import { ProductCategoryProviderProps } from '../navigation/types';
import { Category } from '../models/Category';

interface ProductCategoriesContextProps {
  productCategories: Category[];
  setProductCategories: (categories: Category[]) => void;
}

const ProductCategoriesContext = createContext<ProductCategoriesContextProps | undefined>(undefined);

export const ProductCategoriesProvider: React.FC<ProductCategoryProviderProps> = ({ children, initialProductCategories }) => {
  const [productCategories, setProductCategories] = useState<Category[]>(initialProductCategories);
  
  return (
    <ProductCategoriesContext.Provider value={{ productCategories: initialProductCategories, setProductCategories }}>
      {children}
    </ProductCategoriesContext.Provider>
  );
};

export const useProductCategories = () => {
  const context = useContext(ProductCategoriesContext);

  console.log("context", context)
  if (!context) {
    throw new Error('useProductCategories must be used within a ProductCategoriesProvider');
  }
  return context;
};
