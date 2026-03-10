import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';

type ItemHeaderProps = {
  [key: string]: string | number;
}

const ItemHeader: React.FC<ItemHeaderProps> = ({ label, value }) => {
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
    paddingBottom: 5,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  label: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
  },
  value: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.6,
  },
});

export default ItemHeader;