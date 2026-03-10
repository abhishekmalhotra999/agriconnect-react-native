import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ProductsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import ProductList from '../../../components/Customer/Product/ProductList';
import SearchBar from '../../../components/UI/SearchBar';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import { useScrollContext } from '../../../contexts/ScrollContext';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Product } from '../../../models/Product';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';

const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

const products = [
  {
    id: 1,
    name: 'Berries',
    price: 'R500',
    discountedPrice: 'R400',
    description: description,
    shortDescription: 'This is the short description.',
    image: require('../../../../assets/images/berries.png'),
    category: 'Fruits',
    inStock: true,
    rating: 4.5,
    ratingCount: 672,
  },
  {
    id: 2,
    name: 'Tulsi',
    price: 'R100',
    discountedPrice: 'R80',
    description: description,
    shortDescription: 'This is the short description.',
    image: require('../../../../assets/images/tulsi.png'),
    category: 'Herbs',
    inStock: true,
    rating: 4.9,
    ratingCount: 324,
  },
  {
    id: 3,
    name: 'Milk',
    price: 'R70',
    discountedPrice: 'R40',
    description: description,
    shortDescription: 'This is the short description.',
    image: require('../../../../assets/images/milk.png'),
    category: 'Grains',
    inStock: false,
    rating: 4.9,
    ratingCount: 560,
  },
  {
    id: 4,
    name: 'Tomatoes',
    price: 'R50',
    discountedPrice: 'R30',
    description: description,
    shortDescription: 'This is the short description.',
    image: require('../../../../assets/images/tomatos.png'),
    category: 'Fruits',
    inStock: true,
    rating: 4.7,
    ratingCount: 874,
  },
];

const Products: React.FC<ProductsScreenProps> = ({ navigation }) => {
  useStatusBarStyle('light-content', 'dark-content');
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();

  function show(product: Product) {
    navigation.navigate('ProductDetails', { product })
  }

  useEffect(() => {
    registerScrollRef('Products', scrollViewRef);
  }, [registerScrollRef]);

  return (
    <View style={styles.container}>
    <Header goBack={true} title='Products'/>
    <AnimatedHeaderScrollView
      ref={scrollViewRef}
      headerHeight={normalize(50)}
      headerContent={(
        <>
        <SearchBar hasFilter={true} placeholder="Search products.." />
        </>
      )}
      > 
        <ProductList productLists={products} onPress={show}/>
      </AnimatedHeaderScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default Products;