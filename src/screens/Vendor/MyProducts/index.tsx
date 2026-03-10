import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { MyProductsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import MyProductList from '../../../components/Vendor/MyProduct/MyProductList';
import SearchBar from '../../../components/UI/SearchBar';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import { useScrollContext } from '../../../contexts/ScrollContext';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Product } from '../../../models/Product';

const products = [
  {
    id: 1,
    name: 'Berries',
    price: 'R500',
    discountedPrice: 'R400',
    description: 'This is the long description for product.',
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
    description: 'This is the long description for product.',
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
    description: 'This is the long description for product.',
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
    description: 'This is the long description for product.',
    shortDescription: 'This is the short description.',
    image: require('../../../../assets/images/tomatos.png'),
    category: 'Fruits',
    inStock: true,
    rating: 4.7,
    ratingCount: 874,
  },
];

const MyProducts: React.FC<MyProductsScreenProps> = ({ navigation }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();

  function editProduct(product: Product) {
    navigation.navigate('MyProductDetails', { product })
  }

  useEffect(() => {
    registerScrollRef('Products', scrollViewRef);
  }, [registerScrollRef]);

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView
        ref={scrollViewRef}
        headerHeight={normalize(50)}
        headerContent={(
          <>
          <SearchBar hasFilter={true} placeholder="Search products.." />
          </>
        )}
      > 
        <MyProductList 
          myProductLists={products} 
          onPress={editProduct}
          />
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

export default MyProducts;
