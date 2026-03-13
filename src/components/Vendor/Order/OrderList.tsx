import React from 'react';
import { StyleSheet } from 'react-native';
import OrderItem from './OrderItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { Order } from '../../../models/order';

interface OrderListProps {
  orderLists: Order[];
  onPress: (order: Order) => void;
  onQuickStatusUpdate?: (
    order: Order,
    status: 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'resolved' | 'closed',
  ) => void;
  updatingOrderId?: string | number | null;
}

const OrderList: React.FC<OrderListProps> = ({ 
  orderLists,
  onPress,
  onQuickStatusUpdate,
  updatingOrderId,
}) => {
  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={orderLists}
      renderItem={({ item }) => (
        <OrderItem
          onPress={() => onPress(item)}
          item={item}
          onQuickStatusUpdate={onQuickStatusUpdate}
          isUpdating={String(updatingOrderId || '') === String(item.id)}
        />
      )}
      separatorStyle={styles.separator}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: normalize(10),
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(120),
  },
  separator: {
    paddingBottom: normalize(10),
  }
});

export default OrderList;