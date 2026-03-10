import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewProps } from 'react-native';
import { normalize } from '../../utils/util';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';

interface PriceProps {
  label?: string;
  value: string;
  style?: StyleProp<ViewProps>;
}

const Price: React.FC<PriceProps> = ({
  style,
  label,
  value
}) => {
  return (
    <View 
      style={
        [styles.price, style]
      } 
    >
      {!!label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  price: {
    paddingHorizontal: normalize(10),
    borderBottomColor: COLORS.lightGrey,
  },
  label: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.4,
  },
  value: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.LARGE,
    letterSpacing: 0.4,
  },
});

export default Price;