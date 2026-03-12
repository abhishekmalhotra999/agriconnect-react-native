import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/product';
import MarqueeText from '../../UI/MarqueeText';

type ProductInfoProps = {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <View style={styles.content}>
      <View style={styles.titleRow}>
        <MarqueeText text={product.name} textStyle={styles.title} />
        <Text style={styles.categoryBadge}>{product.category || 'General'}</Text>
      </View>
      
      <View style={styles.metaRow}>
        <Text style={styles.inStock}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Text>
        <Text style={styles.rating}>{product.rating.toFixed(1)}
          <Text style={styles.ratingCount}> ({product.ratingCount} reviews)</Text>
        </Text>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: normalize(16),
  },
  titleRow: {
    marginTop: normalize(4),
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XLARGE,
    color: COLORS.darkText,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    marginTop: normalize(6),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
    backgroundColor: '#F3F5FA',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    color: '#60697C',
  },
  descriptionLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.darkText,
    marginBottom: normalize(6),
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    lineHeight: normalize(20),
  },
  metaRow: {
    marginTop: normalize(10),
  },
  inStock: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
    color: '#17965D',
  },
  rating: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginTop: normalize(4),
  },
  ratingCount: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.grey,
  },
  descriptionCard: {
    marginTop: normalize(14),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#ECEFF4',
    backgroundColor: '#FBFCFE',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(12),
  },
});

export default ProductInfo;