import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

const Summary: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Invoice</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Original Price</Text>
          <Text style={styles.value}>R100</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={[styles.value, styles.positive]}>+R40</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>GST</Text>
          <Text style={[styles.value, styles.positive]}>+R18</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, styles.negative]}>-R20</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R138</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: normalize(20),
  },
  heading: {
    color: COLORS.eerieBlack,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: 10,
  },
  card: {
    paddingHorizontal: 12,
    paddingTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalRow: {
    paddingTop: 5,
  },
  label: {
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.4,
  },
  value: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.6,
  },
  positive: {
    color: COLORS.red,
  },
  negative: {
    color: COLORS.darkText,
  },
  totalLabel: {
    color: COLORS.darkGreen,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.LARGE,
  },
  totalValue: {
    color: COLORS.darkGreen,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.LARGE,
    letterSpacing: 0.6,
  },
});

export default Summary;