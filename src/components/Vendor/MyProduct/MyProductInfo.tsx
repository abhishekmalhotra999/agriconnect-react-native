import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/product';
import Item from '../../UI/Item';

type MyProductInfoProps = {
  product: Product;
}

const MyProductInfo: React.FC<MyProductInfoProps> = ({ product }) => {
  return (
    <>
    {Object.entries(product).map(([key, value]) => (
      <Item key={key} label={key} value={value}/>
    ))}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
});

export default MyProductInfo;