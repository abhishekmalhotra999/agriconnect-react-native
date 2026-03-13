import React from 'react';
import { StyleSheet } from 'react-native';
import {useWindowDimensions} from 'react-native';
import MyProductItem from './MyProductItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/Product';

interface MyProductListProps {
  myProductLists: Product[];
  onPress: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onTogglePublish?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showPublishToggle?: boolean;
  togglingProductId?: number | string | null;
  deletingProductId?: number | string | null;
}

const MyProductList: React.FC<MyProductListProps> = ({ 
  myProductLists,
  onPress,
  onEdit,
  onTogglePublish,
  onDelete,
  showPublishToggle = true,
  togglingProductId,
  deletingProductId,
}) => {
  const {width} = useWindowDimensions();
  const isCompactGrid = width >= 700;
  const numColumns = isCompactGrid ? 2 : 1;

  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={myProductLists}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <MyProductItem
          onPress={() => onPress(item)}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
          showPublishToggle={showPublishToggle}
          toggling={String(togglingProductId) === String(item.id)}
          deleting={String(deletingProductId) === String(item.id)}
          compact={isCompactGrid}
          item={item}
        />
      )}
      separatorStyle={styles.separator}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
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

export default MyProductList;