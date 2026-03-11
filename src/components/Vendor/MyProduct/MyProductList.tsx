import React from 'react';
import { StyleSheet } from 'react-native';
import MyProductItem from './MyProductItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/Product';

interface MyProductListProps {
  myProductLists: Product[];
  onPress: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onTogglePublish?: (product: Product) => void;
  showPublishToggle?: boolean;
  togglingProductId?: number | string | null;
}

const MyProductList: React.FC<MyProductListProps> = ({ 
  myProductLists,
  onPress,
  onEdit,
  onTogglePublish,
  showPublishToggle = true,
  togglingProductId,
}) => {
  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={myProductLists}
      numColumns={2}
      renderItem={({ item }) => (
        <MyProductItem
          onPress={() => onPress(item)}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
          showPublishToggle={showPublishToggle}
          toggling={String(togglingProductId) === String(item.id)}
          item={item}
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

export default MyProductList;