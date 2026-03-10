import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Root from './src/containers/root';
import {Product} from './src/models/Product';
import {Category} from './src/models/Category';
// import { fetchProductCategories } from './src/services/apiMain';
import {ProductsProvider} from './src/contexts/ProductsContext';
import {ProductCategoriesProvider} from './src/contexts/ProductCategoriesContext';
import {Provider} from 'react-redux';
import store from './src/store/storage';
import useIsOffline from './src/hooks/useIsOffline';
import NoConnection from './src/screens/NoConnection';
// import Loading from './src/components/UI/Loading';

function App(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const isoffLine = useIsOffline();

  const loadInitialData = useCallback(async (): Promise<void> => {
    try {
      // const data = await fetchProductCategories();
      setProductCategories([]);
      setProducts([]);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (isoffLine) {
    return <NoConnection />;
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ProductsProvider initialProducts={products}>
          <ProductCategoriesProvider
            initialProductCategories={productCategories}>
            <Root />
          </ProductCategoriesProvider>
        </ProductsProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
