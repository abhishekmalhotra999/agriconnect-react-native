import React from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TouchableOpacity} from 'react-native';
import { OrderDetailsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Order } from '../../../models/order';
import Card from '../../../components/UI/Card';
import OrderInfo from '../../../components/Vendor/Order/OrderInfo';
import FastImage from '@d11/react-native-fast-image';
import Separator from '../../../components/UI/Separator';
import Item from '../../../components/UI/Item';
import {updateTechnicianServiceRequestStatus} from '../../../api/services.api';
import ErrorText from '../../../components/UI/ErrorText';

const OrderDetails: React.FC<OrderDetailsScreenProps> = ({ route }) => {
  const { order }: { order: Order } = route.params;
  const [detailOrder, setDetailOrder] = React.useState<Order>(order);
  const [updatingTo, setUpdatingTo] = React.useState<string>('');
  const [error, setError] = React.useState('');

  const rawStatus = String(detailOrder.rawStatus || '').toLowerCase();

  const actionOptions = React.useMemo(() => {
    if (rawStatus === 'new') {
      return [
        {label: 'Accept', value: 'accepted'},
        {label: 'Reject', value: 'rejected'},
      ];
    }

    if (rawStatus === 'accepted') {
      return [
        {label: 'Start Work', value: 'in_progress'},
        {label: 'Close', value: 'closed'},
      ];
    }

    if (rawStatus === 'in_progress') {
      return [
        {label: 'Complete', value: 'completed'},
        {label: 'Resolve', value: 'resolved'},
      ];
    }

    if (rawStatus === 'completed') {
      return [{label: 'Resolve', value: 'resolved'}];
    }

    if (rawStatus === 'resolved') {
      return [{label: 'Close', value: 'closed'}];
    }

    return [];
  }, [rawStatus]);

  const onUpdateStatus = async (nextStatus: any) => {
    try {
      setUpdatingTo(nextStatus);
      setError('');
      const nextOrder = await updateTechnicianServiceRequestStatus(
        Number(detailOrder.id),
        nextStatus,
      );
      setDetailOrder(nextOrder);
    } catch (statusError: any) {
      setError(String(statusError?.message || 'Unable to update request status.'));
    } finally {
      setUpdatingTo('');
    }
  };

  return (
    <View style={styles.container}>
      <Header goBack={true} title={detailOrder.name}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        <Card style={{ borderRadius: normalize(12) }}>
          <Image
            source={detailOrder.image}
            style={styles.productImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <OrderInfo order={detailOrder}/>
          <View style={styles.extraSection}>
            <Text style={styles.extraTitle}>Request Details</Text>
            <Item label="requester" value={detailOrder.requesterName || '-'} />
            <Item label="phone" value={detailOrder.requesterPhone || '-'} />
            <Item label="email" value={detailOrder.requesterEmail || '-'} />
            <Item label="message" value={detailOrder.message || '-'} />
            <Item label="email delivery" value={detailOrder.emailDeliveryStatus || 'unknown'} />
            <Item label="raw status" value={detailOrder.rawStatus || '-'} />
          </View>
          {actionOptions.length > 0 ? (
            <View style={styles.actionsWrap}>
              {actionOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  testID={`status-action-${option.value}`}
                  style={styles.actionButton}
                  onPress={() => onUpdateStatus(option.value)}
                  disabled={updatingTo.length > 0}>
                  <Text style={styles.actionButtonText}>
                    {updatingTo === option.value ? 'Updating...' : option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          {!!error && <ErrorText text={error} />}
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
  actionsWrap: {
    marginTop: normalize(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: normalize(14),
    backgroundColor: COLORS.primary,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(7),
    marginRight: normalize(8),
    marginBottom: normalize(8),
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: normalize(11),
    fontWeight: '600',
  },
});

export default OrderDetails;