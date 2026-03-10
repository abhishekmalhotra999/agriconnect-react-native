import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Product } from '../../../models/Product';
import { weightIcon } from '../../../constants/images';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import FastImage from '@d11/react-native-fast-image';

type MyProductItemProps = {
  item: Product;
  onPress: (product: Product) => void;
}

const MyProductItem: React.FC<MyProductItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={() => onPress(item)} 
      style={[styles.courseContainer, styles.card]}
      >
      <Image
        // @ts-ignore
        source={item.image}
        style={styles.productImage}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.productDetailsWrapper}>
        <View style={[styles.inline, styles.flexStart]}>
          <Text style={styles.productTitle}>{item.name}</Text>
          <Image source={weightIcon} style={styles.icon} />
        </View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>{'Price:'} {item.price}</Text>
        <View style={[styles.inline, styles.flexEnd]}>
          <Text style={styles.price}>{'Offer Price:'} {item.discountedPrice}</Text>
          <View style={styles.stockWrapper}>
            <Text style={styles.stockText}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: normalize(12),
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    height: normalize(95),
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: normalize(95),
    height: '100%',
    borderTopLeftRadius: normalize(12),
    borderBottomLeftRadius: normalize(12),
  },
  productDetailsWrapper: {
    flex: 1,
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(10),
  },
  productTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  },
  price: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
  },
  category: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
  stockWrapper: {
    paddingHorizontal: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    marginLeft: 5,
    marginBottom: normalize(2),
  },
  stockText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  flexStart: {
    flex: 1, 
    alignItems: 'flex-start',
  },
  flexEnd: {
    flex: 1, 
    alignItems: 'flex-end',
  }
});

export default MyProductItem;