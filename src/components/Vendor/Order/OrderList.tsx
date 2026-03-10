import React from 'react';
import { StyleSheet } from 'react-native';
import OrderItem from './OrderItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { Order } from '../../../models/order';

interface OrderListProps {
  orderLists: Order[];
  onPress: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ 
  orderLists,
  onPress
}) => {
  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={orderLists}
      renderItem={({ item }) => (
        <OrderItem onPress={() => onPress(item)} item={item}/>
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

export default OrderList;