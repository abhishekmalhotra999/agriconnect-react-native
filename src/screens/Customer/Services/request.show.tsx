import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import Header from '../../../containers/header';
import {ServiceRequestDetailsScreenProps} from '../../../navigation/types';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import Card from '../../../components/UI/Card';
import Item from '../../../components/UI/Item';
import FastImage from '@d11/react-native-fast-image';

const ServiceRequestDetails: React.FC<ServiceRequestDetailsScreenProps> = ({
  route,
}) => {
  const {order} = route.params;

  return (
    <View style={styles.container}>
      <Header goBack title={order.name} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Image
            source={order.image}
            style={styles.productImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Item label="status" value={order.status} />
          <Item label="created" value={order.createdAt} />
          <Item label="requester" value={order.requesterName || '-'} />
          <Item label="phone" value={order.requesterPhone || '-'} />
          {!!order.message && (
            <View style={styles.messageWrapper}>
              <Text style={styles.messageLabel}>Message</Text>
              <Text style={styles.messageText}>{order.message}</Text>
            </View>
          )}
        </Card>
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
  card: {
    borderRadius: normalize(12),
  },
  productImage: {
    width: '100%',
    height: 110,
    borderRadius: normalize(12),
    marginBottom: normalize(8),
  },
  messageWrapper: {
    marginTop: normalize(10),
  },
  messageLabel: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.4,
    marginBottom: normalize(4),
  },
  messageText: {
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
    lineHeight: normalize(20),
  },
});

export default ServiceRequestDetails;
