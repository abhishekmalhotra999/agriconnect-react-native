import React from 'react';
import {StyleSheet, View, ScrollView, Image, Text} from 'react-native';
import { OrderDetailsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Order } from '../../../models/Order';
import Card from '../../../components/UI/Card';
import OrderInfo from '../../../components/Vendor/Order/OrderInfo';
import FastImage from '@d11/react-native-fast-image';
import Separator from '../../../components/UI/Separator';
import Item from '../../../components/UI/Item';

const OrderDetails: React.FC<OrderDetailsScreenProps> = ({ route }) => {
  const { order }: { order: Order } = route.params;

  return (
    <View style={styles.container}>
      <Header goBack={true} title={order.name}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        <Card style={{ borderRadius: normalize(12) }}>
          <Image
            source={order.image}
            style={styles.productImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <OrderInfo order={order}/>
          <View style={styles.extraSection}>
            <Text style={styles.extraTitle}>Request Details</Text>
            <Item label="requester" value={order.requesterName || '-'} />
            <Item label="phone" value={order.requesterPhone || '-'} />
            <Item label="email" value={order.requesterEmail || '-'} />
            <Item label="message" value={order.message || '-'} />
            <Item label="email delivery" value={order.emailDeliveryStatus || 'unknown'} />
            <Item label="raw status" value={order.rawStatus || '-'} />
          </View>
        </Card>
        <Separator/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: normalize(16),
    paddingBottom: normalize(120),
  },
  imageCardStyle: {
    paddingHorizontal: 0,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: normalize(12),
  },
  separator: {
    paddingRight: normalize(10),
  },
  extraSection: {
    marginTop: normalize(10),
  },
  extraTitle: {
    color: COLORS.darkText,
    fontSize: normalize(12),
    marginBottom: normalize(6),
  },
});

export default OrderDetails;