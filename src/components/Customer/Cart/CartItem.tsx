import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

interface CartItemProps {
  name: string;
  price: string;
  imageUrl: ImageSourcePropType;
}

const CartItem: React.FC<CartItemProps> = ({ name, price, imageUrl }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inline}>
        <View style={[styles.details, styles.inline]}>
          <Image source={imageUrl} style={styles.image} />
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>
      <View style={[styles.inline, styles.spacing]}>
        <TouchableOpacity style={styles.addMoreItemLink} onPress={() => {}}>
          <Text style={styles.addMoreItem}>{'Add more items'}</Text>
        </TouchableOpacity>
        <View style={[styles.inline, styles.buttons]}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>1</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    marginBottom: normalize(20),
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  addMoreItemLink: {
    flex: 1,
  },
  spacing: {
    paddingTop: 10,
  },
  name: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.LARGE,
  },
  price: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.LARGE,
  },
  addMoreItem: {
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    textDecorationLine: 'underline',
  },
  buttons: {
    backgroundColor: COLORS.darkText,
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