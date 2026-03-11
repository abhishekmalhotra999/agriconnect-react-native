import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Product} from '../../../models/Product';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';

type ProductItemProps = {
  item: Product;
  onPress: (product: Product) => void;
};

const ProductItem: React.FC<ProductItemProps> = ({item, onPress}) => {
  const rating = Number(item.rating || 0).toFixed(1);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onPress(item)}
      style={styles.card}>
      <View style={styles.imageShell}>
        <Image source={item.image as any} style={styles.productImage} resizeMode="cover" />
        <View style={styles.wishlistCircle}>
          <Image
            source={require('../../../../assets/icons/heart.png')}
            style={styles.wishlistIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.categoryBadge} numberOfLines={1}>
            {item.category || 'General'}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.shortDescription || item.description || 'No description available'}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.originalPrice} numberOfLines={1}>
            {item.price}
          </Text>
          <Text style={styles.salePrice} numberOfLines={1}>
            {item.discountedPrice}
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.offerText}>Offer price</Text>
          <View style={styles.stockPill}>
            <Text style={styles.stockText}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Text>
          </View>
        </View>

        <View style={styles.badgesRow}>
          <Text style={[styles.metaBadge, styles.successBadge]}>Verified seller</Text>
          <Text style={[styles.metaBadge, styles.neutralBadge]}>
            <Image
              source={require('../../../../assets/icons/star.png')}
              style={styles.starIcon}
              resizeMode="contain"
            />{' '}
            {rating} ({item.ratingCount || 0})
          </Text>
        </View>

        <Text style={styles.tapHint}>Tap to view details</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    backgroundColor: COLORS.white,
    borderRadius: normalize(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    elevation: 5,
    shadowColor: '#1D2230',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  imageShell: {
    margin: normalize(8),
    borderRadius: normalize(16),
    overflow: 'hidden',
    borderWidth: 0.4,
    borderColor: '#D4DAE5',
    backgroundColor: '#F6F8FC',
  },
  productImage: {
    width: '100%',
    height: normalize(126),
    backgroundColor: '#F8F9FB',
  },
  wishlistCircle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(10),
    width: normalize(30),
    height: normalize(30),
    borderRadius: normalize(15),
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistIcon: {
    width: normalize(14),
    height: normalize(14),
    opacity: 0.92,
  },
  content: {
    paddingHorizontal: normalize(11),
    paddingBottom: normalize(10),
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    marginRight: normalize(6),
  },
  categoryBadge: {
    maxWidth: normalize(74),
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
    backgroundColor: '#F5F6FA',
    color: '#616A7D',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    textAlign: 'center',
  },
  description: {
    marginTop: normalize(4),
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    lineHeight: normalize(15),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(8),
    marginBottom: normalize(6),
  },
  originalPrice: {
    color: '#8A8F9D',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    textDecorationLine: 'line-through',
    marginRight: normalize(6),
  },
  salePrice: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
  offerText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  stockPill: {
    paddingHorizontal: normalize(7),
    paddingVertical: normalize(2),
    borderRadius: normalize(10),
    backgroundColor: COLORS.primaryLight,
  },
  stockText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(7),
    gap: normalize(4),
  },
  metaBadge: {
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    overflow: 'hidden',
  },
  successBadge: {
    color: '#1B8B5A',
    backgroundColor: '#E9F7F0',
  },
  neutralBadge: {
    color: '#5D6473',
    backgroundColor: '#F1F3F7',
  },
  starIcon: {
    width: normalize(11),
    height: normalize(11),
  },
  tapHint: {
    marginTop: normalize(7),
    color: '#8D93A0',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
});

export default ProductItem;
