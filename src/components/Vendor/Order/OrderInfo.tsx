import React from 'react';
import { StyleSheet } from 'react-native';
import { normalize } from '../../../utils/util';
import { Order } from '../../../models/order';
import Item from '../../UI/Item';

type OrderInfoProps = {
  order: Order;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  const summaryRows: Array<{label: string; value: string | number}> = [
    {label: 'status', value: order.status || '-'},
    {label: 'created', value: order.createdAt || '-'},
    {label: 'price', value: order.amount || '-'},
    {label: 'quantity', value: Number(order.quantity || 0) || 0},
  ];

  return (
    <>
      {summaryRows.map(row => (
        <Item key={row.label} label={row.label} value={row.value} />
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