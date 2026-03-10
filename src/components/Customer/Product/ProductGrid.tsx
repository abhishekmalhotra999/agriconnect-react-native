import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ProductCard from './ProductCard';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/Product';
import NavigationService from '../../../navigation/navigationService';

const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...';

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

const ProductGrid = () => {
  
  function viewList() {
    NavigationService.navigate('Products');
  }

  function showProduct(product: Product) {
    NavigationService.navigate('ProductDetails', { product })
  }

  return (
    <View style={styles.listContainer}>
      <View style={[styles.inline, styles.spacing]}>
        <Text style={styles.title}>Browse Products</Text>
        <Pressable onPress={viewList}>
          <Text style={styles.moreText}>More</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {products.map((product, index) => (
          <ProductCard onPress={() => showProduct(product)} key={index} product={product}/>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: normalize(10),
    paddingBottom: normalize(100),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.heading,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacing: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(16),
  },
  moreText: {
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    textDecorationLine: 'underline',
  },
});

export default ProductGrid;
