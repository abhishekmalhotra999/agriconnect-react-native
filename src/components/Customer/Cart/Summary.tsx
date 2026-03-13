import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

type SummaryProps = {
  totalItems: number;
  subtotalLabel: string;
  deliveryLabel: string;
  totalLabel: string;
};

const Summary: React.FC<SummaryProps> = ({
  totalItems,
  subtotalLabel,
  deliveryLabel,
  totalLabel,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Invoice</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Items</Text>
          <Text style={styles.value}>{totalItems}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{subtotalLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={[styles.value, styles.positive]}>+{deliveryLabel}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{totalLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: normalize(12),
    marginBottom: normalize(20),
  },
  heading: {
    color: COLORS.eerieBlack,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: 10,
  },
  card: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(12),
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: '#E6EBF3',
    backgroundColor: '#FCFDFE',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  totalRow: {
    paddingTop: normalize(8),
    borderTopWidth: 1,
    borderTopColor: '#E9EDF4',
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