import React from 'react';
import { StyleSheet } from 'react-native';
import MyProductItem from './MyProductItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { Product } from '../../../models/Product';

interface MyProductListProps {
  myProductLists: Product[];
  onPress: (product: Product) => void;
}

const MyProductList: React.FC<MyProductListProps> = ({ 
  myProductLists,
  onPress
}) => {
  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={myProductLists}
      renderItem={({ item }) => (
        <MyProductItem onPress={() => onPress(item)} item={item}/>
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

export default MyProductList;