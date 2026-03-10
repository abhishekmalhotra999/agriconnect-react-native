import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Product } from '../../../models/Product';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import FastImage from '@d11/react-native-fast-image';

type ProductCardProps = {
  product: Product;
  onPress: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(product)} style={styles.card}>
      <View style={styles.imageCard}>
        <Image 
          source={product.image} 
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{product.price}</Text>
          <View style={styles.ratingContainer}>
            <Image source={require('../../../../assets/icons/star.png')} style={styles.starIcon} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.ratingCount}>({product.ratingCount})</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.heartIconContainer]}>
        <Image source={require('../../../../assets/icons/heart.png')} style={styles.heartIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imageCard: {
    paddingHorizontal: Platform.select({
      ios: normalize(14),
      android: normalize(12),
    }),
    paddingVertical: Platform.select({
      ios: 0,
      android: normalize(12),
    }),
    borderWidth: 0.3,
    backgroundColor: COLORS.border,
    borderColor: COLORS.grey,
    borderRadius: normalize(22),
  },
  image: {
    width: '100%',
    height: normalize(140),
    borderRadius: normalize(23),
  },
  info: {
    padding: 10,
  },
  name: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.heading
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.heading,
    marginVertical: 4,
  },
  rating: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.heading,
  },
  ratingCount: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIconContainer: {
    backgroundColor: COLORS.transparent,
    padding: 8,
    borderRadius: 50,
    position: 'absolute',
    top: 22,
    right: 22,
  },
  heartIcon: {
    width: 16,
    height: 14,
    resizeMode: 'contain',
  },
  starIcon: {
    width: 16,
    height: 14,
    resizeMode: 'contain',
    marginBottom: 3.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default ProductCard;