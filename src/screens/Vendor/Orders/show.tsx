import React from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import { OrderDetailsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Order } from '../../../models/order';
import FastImage from '@d11/react-native-fast-image';
import {updateTechnicianServiceRequestStatus} from '../../../api/services.api';
import ErrorText from '../../../components/UI/ErrorText';
import AppImage from '../../../components/UI/AppImage';

const OrderDetails: React.FC<OrderDetailsScreenProps> = ({ route }) => {
  const { order }: { order: Order } = route.params;
  const [detailOrder, setDetailOrder] = React.useState<Order>(order);
  const [updatingTo, setUpdatingTo] = React.useState<string>('');
  const [error, setError] = React.useState('');

  const rawStatus = String(detailOrder.rawStatus || '').toLowerCase();
  const statusLabel = detailOrder.status || 'Unknown';

  const statusTone = React.useMemo(() => {
    if (rawStatus === 'new') {
      return {bg: '#FFF4E3', text: '#DB8200'};
    }

    if (rawStatus === 'accepted' || rawStatus === 'in_progress') {
      return {bg: '#EAF5FF', text: '#2B74C7'};
    }

    if (rawStatus === 'completed' || rawStatus === 'resolved' || rawStatus === 'closed') {
      return {bg: '#EAF7F0', text: '#19915D'};
    }

    if (rawStatus === 'rejected' || rawStatus === 'cancelled') {
      return {bg: '#FFEDED', text: '#C14B4B'};
    }

    return {bg: '#F2F4F8', text: '#5F6D80'};
  }, [rawStatus]);

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

  const summaryRows = [
    {label: 'Created', value: detailOrder.createdAt || '-'},
    {label: 'Price', value: detailOrder.amount || '-'},
    {label: 'Quantity', value: String(detailOrder.quantity || 0)},
    {label: 'Raw Status', value: detailOrder.rawStatus || '-'},
  ];

  const renderInfoRow = (label: string, value: string, allowWrap = false) => {
    return (
      <View style={styles.infoRow} key={label}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text
          style={[styles.infoValue, allowWrap && styles.infoValueWrap]}
          numberOfLines={allowWrap ? 4 : 1}>
          {value || '-'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header goBack={true} title={detailOrder.name} icons={false} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        <View style={styles.card}>
          <View style={styles.heroRow}>
            <AppImage
              source={detailOrder.image}
              style={styles.productImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.heroTextWrap}>
              <Text style={styles.orderName} numberOfLines={2}>{detailOrder.name}</Text>
              <View style={[styles.statusPill, {backgroundColor: statusTone.bg}]}> 
                <Text style={[styles.statusText, {color: statusTone.text}]}>{statusLabel}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryGrid}>
            {summaryRows.map(row => (
              <View style={styles.summaryCard} key={row.label}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Request Details</Text>
          <View style={styles.infoBlock}>
            {renderInfoRow('Requester', detailOrder.requesterName || '-')}
            {renderInfoRow('Phone', detailOrder.requesterPhone || '-')}
            {renderInfoRow('Email', detailOrder.requesterEmail || '-', true)}
            {renderInfoRow('Message', detailOrder.message || '-', true)}
            {renderInfoRow('Email Delivery', detailOrder.emailDeliveryStatus || 'unknown')}
          </View>

          {actionOptions.length > 0 ? (
            <View style={styles.actionsWrap}>
              {actionOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  testID={`status-action-${option.value}`}
                  style={[
                    styles.actionButton,
                    option.value === 'rejected' ? styles.actionButtonDanger : null,
                  ]}
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
        </View>
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
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#E8EDF4',
    backgroundColor: COLORS.white,
    padding: normalize(14),
    shadowColor: '#13263E',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: normalize(82),
    height: normalize(82),
    borderRadius: normalize(12),
    backgroundColor: COLORS.lightGrey,
  },
  heroTextWrap: {
    marginLeft: normalize(12),
    flex: 1,
  },
  orderName: {
    color: COLORS.darkText,
    fontSize: normalize(18),
    fontWeight: '700',
    marginBottom: normalize(8),
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: normalize(14),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
  },
  statusText: {
    fontSize: normalize(11),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    color: COLORS.darkText,
    fontSize: normalize(13),
    fontWeight: '700',
    marginTop: normalize(16),
    marginBottom: normalize(8),
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48.5%',
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#EBEFF5',
    backgroundColor: '#FAFCFF',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(9),
    marginBottom: normalize(8),
  },
  summaryLabel: {
    color: '#7A8798',
    fontSize: normalize(10),
    marginBottom: normalize(4),
  },
  summaryValue: {
    color: COLORS.darkText,
    fontSize: normalize(15),
    fontWeight: '700',
  },
  infoBlock: {
    borderWidth: 1,
    borderColor: '#EDF1F7',
    borderRadius: normalize(10),
    backgroundColor: '#FCFDFF',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  infoLabel: {
    color: '#7B8798',
    fontSize: normalize(12),
    width: '34%',
  },
  infoValue: {
    color: '#354256',
    fontSize: normalize(12),
    width: '66%',
    textAlign: 'right',
  },
  infoValueWrap: {
    lineHeight: normalize(18),
  },
  actionsWrap: {
    marginTop: normalize(14),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: normalize(18),
    backgroundColor: COLORS.primary,
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(9),
    marginRight: normalize(8),
    marginBottom: normalize(8),
  },
  actionButtonDanger: {
    backgroundColor: '#CF5C5C',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: normalize(12),
    fontWeight: '600',
  },
});

export default OrderDetails;