import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

type OrderStatsProps = {
  totalProducts: number;
  published: number;
  draft: number;
  lowStock: number;
  outOfStock: number;
  totalStockUnits: number;
};

const OrderStats: React.FC<OrderStatsProps> = ({
  totalProducts,
  published,
  draft,
  lowStock,
  outOfStock,
  totalStockUnits,
}) => {
  return (
    <>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Products</Text>
        <Text style={styles.totalValue}>{totalProducts}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Published</Text>
        <Text style={styles.value}>{published}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Draft</Text>
        <Text style={styles.value}>{draft}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Low Stock (0-5)</Text>
        <Text style={[styles.value, styles.positive]}>{lowStock}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Out of Stock</Text>
        <Text style={[styles.value, styles.negative]}>{outOfStock}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Stock Units</Text>
        <Text style={[styles.value, styles.negative]}>{totalStockUnits}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  totalRow: {
    paddingBottom: 5,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  label: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.4,
  },
  value: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.6,
  },
  positive: {
    color: COLORS.red,
  },
  negative: {
    color: COLORS.grey,
  },
  totalLabel: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
  },
  totalValue: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.6,
  },
});

export default OrderStats;