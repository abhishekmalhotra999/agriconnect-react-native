import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Platform } from 'react-native';
import { OrdersScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { COLORS } from '../../../themes/styles';
import { normalize, headerHeight } from '../../../utils/util';
import SearchBar from '../../../components/UI/SearchBar';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import OrderList from '../../../components/Vendor/Order/OrderList';
import Filters from '../../../components/UI/Filters';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import { Order } from '../../../models/order';

const options = ['All', 'In Transit', 'Confirmed', 'Cancelled', 'Delivered'];

const orders = [
  {
    id: 1,
    name: 'Berries',
    amount: 'R500',
    quantity: 2,
    status: 'Confirmed',
    image: require('../../../../assets/images/berries.png'),
    createdAt: '22 Jan, 2024',
  },
  {
    id: 2,
    name: 'Tulsi',
    amount: 'R100',
    quantity: 5,
    status: 'In Transit',
    image: require('../../../../assets/images/tulsi.png'),
    createdAt: '12 Feb, 2024',
  },
  {
    id: 3,
    name: 'Milk',
    amount: 'R70',
    quantity: 5,
    status: 'Delivered',
    image: require('../../../../assets/images/milk.png'),
    createdAt: '12 Feb, 2024',
  },
  {
    id: 4,
    name: 'Tomatoes',
    amount: 'R50',
    quantity: 5,
    status: 'Cancelled',
    image: require('../../../../assets/images/tomatos.png'),
    createdAt: '09 Feb, 2024',
  },
];

const Orders: React.FC<OrdersScreenProps> = ({ navigation }) => {
  useStatusBarStyle('dark-content', 'light-content');
  const [activeFilter, setActiveFilter] = useState('All');

  function editOrder(order: Order) {
    navigation.navigate('OrderDetails', { order })
  }

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView 
        headerHeight={headerHeight()}
        headerContent={(
          <>
          <SearchBar placeholder="Find Orders" />
          </>
        )}
      >
        <Filters 
          options={options}
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          />
        <OrderList orderLists={orders} onPress={editOrder} />
      </AnimatedHeaderScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imageCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(20),
    marginBottom: normalize(35),
    paddingHorizontal: normalize(16),
  },
});

export default Orders;