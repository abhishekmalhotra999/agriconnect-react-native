import React from 'react';
import { StyleSheet } from 'react-native';
import ProductItem from './ProductItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/Product';

interface ProductListProps {
  productLists: Product[];
  onPress: (product: Product) => void;
  cardVariant?: 'default' | 'service';
  wishlistById?: Record<string, boolean>;
  onToggleWishlist?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  productLists,
  onPress,
  cardVariant = 'default',
  wishlistById,
  onToggleWishlist,
}) => {
  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={productLists}
      numColumns={2}
      renderItem={({ item }) => (
        <ProductItem
          onPress={() => onPress(item)}
          item={item}
          variant={cardVariant}
          isWishlisted={Boolean(wishlistById?.[String(item.id)])}
          onToggleWishlist={onToggleWishlist}
        />
      )}
      separatorStyle={styles.separator}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={styles.columnWrapper}
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
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default ProductList;