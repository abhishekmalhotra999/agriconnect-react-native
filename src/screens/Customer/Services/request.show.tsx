import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../../containers/header';
import {ServiceRequestDetailsScreenProps} from '../../../navigation/types';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import Card from '../../../components/UI/Card';
import Item from '../../../components/UI/Item';
import FastImage from '@d11/react-native-fast-image';
import {Order} from '../../../models/order';
import {cancelMyServiceRequest} from '../../../api/services.api';
import ErrorText from '../../../components/UI/ErrorText';

const ServiceRequestDetails: React.FC<ServiceRequestDetailsScreenProps> = ({
  route,
}) => {
  const {order} = route.params;
  const [detailOrder, setDetailOrder] = React.useState<Order>(order);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const rawStatus = String(detailOrder.rawStatus || '').toLowerCase();
  const canCancel = ['new', 'pending', 'accepted'].includes(rawStatus);

  const onCancelRequest = async () => {
    try {
      setBusy(true);
      setError('');
      setSuccess('');
      const nextOrder = await cancelMyServiceRequest(Number(detailOrder.id));
      setDetailOrder(nextOrder);
      setSuccess('Request cancelled successfully.');
    } catch (cancelError: any) {
      setError(String(cancelError?.message || 'Unable to cancel request right now.'));
    } finally {
      setBusy(false);
    }
  };

  const timeline = [
    {
      label: 'New',
      done: ['new', 'pending', 'accepted', 'in_progress', 'completed', 'resolved', 'closed', 'cancelled'].includes(rawStatus),
    },
    {
      label: 'In Progress',
      done: ['in_progress', 'completed', 'resolved', 'closed'].includes(rawStatus),
    },
    {
      label: 'Resolved',
      done: ['resolved', 'closed', 'completed'].includes(rawStatus),
    },
    {
      label: 'Closed',
      done: rawStatus === 'closed',
    },
    {
      label: 'Cancelled',
      done: rawStatus === 'cancelled',
    },
  ];

  return (
    <View style={styles.container}>
      <Header goBack title={detailOrder.name} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Image
            source={detailOrder.image}
            style={styles.productImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Item label="status" value={detailOrder.status} />
          <Item label="created" value={detailOrder.createdAt} />
          <Item label="requester" value={detailOrder.requesterName || '-'} />
          <Item label="phone" value={detailOrder.requesterPhone || '-'} />
          <Item label="email" value={detailOrder.requesterEmail || '-'} />
          <Item
            label="email delivery"
            value={detailOrder.emailDeliveryStatus || 'unknown'}
          />
          {!!detailOrder.message && (
            <View style={styles.messageWrapper}>
              <Text style={styles.messageLabel}>Message</Text>
              <Text style={styles.messageText}>{detailOrder.message}</Text>
            </View>
          )}
          {canCancel && (
            <TouchableOpacity
              testID="cancel-request-button"
              style={styles.cancelButton}
              disabled={busy}
              onPress={onCancelRequest}>
              <Text style={styles.cancelButtonText}>{busy ? 'Cancelling...' : 'Cancel Request'}</Text>
            </TouchableOpacity>
          )}
          {!!success && <Text style={styles.successText}>{success}</Text>}
          {!!error && <ErrorText text={error} />}
          <View style={styles.timelineContainer}>
            {timeline.map(step => (
              <View key={step.label} style={[styles.timelineStep, step.done && styles.timelineStepDone]}>
                <Text style={[styles.timelineText, step.done && styles.timelineTextDone]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
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
  timelineContainer: {
    marginTop: normalize(12),
  },
  cancelButton: {
    marginTop: normalize(10),
    alignSelf: 'flex-start',
    borderRadius: normalize(16),
    backgroundColor: COLORS.red,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(7),
  },
  cancelButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  successText: {
    marginTop: normalize(8),
    color: COLORS.darkGreen,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  timelineStep: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(20),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    alignSelf: 'flex-start',
    marginBottom: normalize(6),
  },
  timelineStepDone: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}20`,
  },
  timelineText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  timelineTextDone: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
});

export default ServiceRequestDetails;
