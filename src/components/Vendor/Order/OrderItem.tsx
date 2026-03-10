import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Order } from '../../../models/order';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import FastImage from '@d11/react-native-fast-image';

type OrderItemProps = {
  item: Order;
  onPress: (order: Order) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={() => onPress(item)} 
      style={[styles.courseContainer, styles.card]}
      >
      <Image
        // @ts-ignore
        source={item.image}
        style={styles.orderImage}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.details}>
        <View style={styles.flexStart}>
          <Text style={styles.orderTitle}>{item.name}</Text>
        </View>
        <View style={[styles.inline, styles.flexStart]}>
          <Text style={styles.orderText}>{'Price:'} {item.amount}</Text>
          <Text style={styles.orderText}>{'Quantity:'} {item.quantity}</Text>
        </View>
        <View style={[styles.inline, styles.flexEnd]}>
          <Text style={styles.orderText}>{item.createdAt}</Text>
          <View style={styles.stockWrapper}>
            <Text style={styles.stockText}>{item.status}</Text>
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
    height: normalize(90),
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderImage: {
    width: normalize(90),
    height: '100%',
    borderTopLeftRadius: normalize(12),
    borderBottomLeftRadius: normalize(12),
  },
  details: {
    flex: 1,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
  },
  orderTitle: {
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  },
  orderText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
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
  flexStart: {
    flex: 1, 
    alignItems: 'flex-start',
  },
  flexEnd: {
    flex: 1, 
    alignItems: 'flex-end',
  },
});

export default OrderItem;