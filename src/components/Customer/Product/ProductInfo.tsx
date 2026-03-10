import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/product';

type ProductInfoProps = {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <View style={styles.content}>
      <View style={styles.column}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
      </View>
      
      <View style={styles.column}>
        <Text style={styles.inStock}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Text>
        <Text style={styles.rating}>{product.rating}
          <Text style={styles.ratingCount}>({product.ratingCount})</Text>
        </Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: normalize(16),
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MLARGE,
    color: COLORS.darkText,
  },
  category: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.grey,
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.grey,
  },
  inStock: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.orange,
  },
  rating: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.grey,
  },
  ratingCount: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.grey,
  }
});

export default ProductInfo;