import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';
import { normalize } from '../../utils/util';

type ItemProps = {
  [key: string]: string | number;
}

const Item: React.FC<ItemProps> = ({ label, value }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  label: {
    flex: 1,
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.4,
    textTransform: 'capitalize',
  },
  value: {
    textAlign: 'right',
    width: normalize(140),
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.6,
  },
});

export default Item;