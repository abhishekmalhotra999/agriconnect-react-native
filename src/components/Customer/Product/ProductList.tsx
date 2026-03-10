import React from 'react';
import { StyleSheet } from 'react-native';
import ProductItem from './ProductItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Product } from '../../../models/Product';

interface ProductListProps {
  productLists: Product[];
  onPress: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  productLists,
  onPress
}) => {
  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={productLists}
      renderItem={({ item }) => (
        <ProductItem onPress={() => onPress(item)} item={item}/>
      )}
      separatorStyle={styles.separator}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: normalize(15),
    paddingBottom: normalize(120),
  },
  separator: {
    paddingBottom: normalize(8),
  }
});

export default ProductList;