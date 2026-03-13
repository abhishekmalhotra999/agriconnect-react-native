import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

interface CartItemProps {
  name: string;
  price: string;
  unitPriceLabel?: string;
  lineTotalLabel?: string;
  imageUrl: ImageSourcePropType;
  quantity?: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  onRemove?: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  unitPriceLabel,
  lineTotalLabel,
  imageUrl,
  quantity = 1,
  onDecrease,
  onIncrease,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.detailsWrap}>
          <Image source={imageUrl} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={2}>
              {name}
            </Text>
            <Text style={styles.subText}>Unit: {unitPriceLabel || price}</Text>
          </View>
        </View>
        <View style={styles.amountCol}>
          <Text style={styles.amountLabel}>Line Total</Text>
          <Text style={styles.price}>{lineTotalLabel || price}</Text>
        </View>
      </View>
      <View style={[styles.inline, styles.controlsRow]}>
        <TouchableOpacity style={styles.addMoreItemLink} onPress={onRemove}>
          <Text style={styles.addMoreItem}>{'Remove item'}</Text>
        </TouchableOpacity>
        <View style={[styles.inline, styles.buttons]}>
          <TouchableOpacity style={styles.button} onPress={onDecrease}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{Math.max(1, Number(quantity || 1))}</Text>
          <TouchableOpacity style={styles.button} onPress={onIncrease}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: normalize(12),
    backgroundColor: '#fff',
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: '#E6EBF3',
    marginBottom: normalize(12),
    shadowColor: '#1D2433',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(10),
    marginRight: normalize(10),
    backgroundColor: '#F2F4F8',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailsWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  amountCol: {
    marginLeft: normalize(10),
    alignItems: 'flex-end',
  },
  amountLabel: {
    color: '#8A93A6',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  addMoreItemLink: {
    flex: 1,
  },
  controlsRow: {
    paddingTop: normalize(10),
  },
  name: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  },
  subText: {
    marginTop: normalize(2),
    color: '#7E8798',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  price: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
  },
  addMoreItem: {
    color: '#5F6778',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    textDecorationLine: 'underline',
  },
  buttons: {
    backgroundColor: '#2F3340',
    borderRadius: 30,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.LARGE,
  },
  quantityText: {
    marginHorizontal: 10,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
});

export default CartItem;