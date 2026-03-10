import React from 'react';
import { StyleSheet } from 'react-native';
import { normalize } from '../../../utils/util';
import { Order } from '../../../models/order';
import Item from '../../UI/Item';

type OrderInfoProps = {
  order: Order;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  return (
    <>
    {Object.entries(order).map(([key, value]) => (
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

export default OrderInfo;