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
  const rawStatus = String(order.rawStatus || '').toLowerCase();

  const timeline = [
    {
      label: 'New',
      done: ['new', 'pending', 'accepted', 'in_progress', 'completed', 'resolved', 'closed'].includes(rawStatus),
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
  ];

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
          <Item label="email" value={order.requesterEmail || '-'} />
          <Item
            label="email delivery"
            value={order.emailDeliveryStatus || 'unknown'}
          />
          {!!order.message && (
            <View style={styles.messageWrapper}>
              <Text style={styles.messageLabel}>Message</Text>
              <Text style={styles.messageText}>{order.message}</Text>
            </View>
          )}
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
    gap: normalize(6),
  },
  timelineStep: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(20),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    alignSelf: 'flex-start',
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
