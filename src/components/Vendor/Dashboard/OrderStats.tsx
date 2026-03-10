import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

const OrderStats: React.FC = () => {
  return (
    <>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>4</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Completed</Text>
        <Text style={styles.value}>1</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pending</Text>
        <Text style={[styles.value, styles.positive]}>2</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Processing</Text>
        <Text style={[styles.value, styles.positive]}>0</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cancelled</Text>
        <Text style={[styles.value, styles.negative]}>0</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Refunded</Text>
        <Text style={[styles.value, styles.negative]}>0</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>On Hold</Text>
        <Text style={[styles.value, styles.negative]}>1</Text>
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