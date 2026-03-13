import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {Order} from '../../../models/order';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import AppImage from '../../UI/AppImage';

type OrderItemProps = {
  item: Order;
  onPress: (order: Order) => void;
  onQuickStatusUpdate?: (
    order: Order,
    status:
      | 'accepted'
      | 'rejected'
      | 'in_progress'
      | 'completed'
      | 'resolved'
      | 'closed',
  ) => void;
  isUpdating?: boolean;
};

const getQuickActions = (rawStatus?: string) => {
  const normalized = String(rawStatus || '').toLowerCase();

  if (normalized === 'new') {
    return [
      {label: 'Accept', value: 'accepted' as const},
      {label: 'Reject', value: 'rejected' as const},
    ];
  }

  if (normalized === 'accepted') {
    return [
      {label: 'Start', value: 'in_progress' as const},
      {label: 'Close', value: 'closed' as const},
    ];
  }

  if (normalized === 'in_progress') {
    return [
      {label: 'Complete', value: 'completed' as const},
      {label: 'Resolve', value: 'resolved' as const},
    ];
  }

  if (normalized === 'completed') {
    return [{label: 'Resolve', value: 'resolved' as const}];
  }

  if (normalized === 'resolved') {
    return [{label: 'Close', value: 'closed' as const}];
  }

  return [];
};

const OrderItem: React.FC<OrderItemProps> = ({
  item,
  onPress,
  onQuickStatusUpdate,
  isUpdating,
}) => {
  const quickActions = getQuickActions(item.rawStatus);

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.leftCluster}>
          <AppImage
            // @ts-ignore
            source={item.image}
            style={styles.orderImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.titleWrap}>
            <Text style={styles.orderTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.metaText}>{item.createdAt}</Text>
          </View>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Price</Text>
          <Text style={styles.metricValue}>{item.amount}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Quantity</Text>
          <Text style={styles.metricValue}>{item.quantity}</Text>
        </View>
      </View>

      {quickActions.length > 0 && !!onQuickStatusUpdate && (
        <View style={styles.quickActionsWrap}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.value}
              testID={`order-quick-action-${item.id}-${action.value}`}
              style={styles.quickActionChip}
              disabled={isUpdating}
              onPress={() => onQuickStatusUpdate(item, action.value)}>
              <Text style={styles.quickActionText}>
                {isUpdating ? 'Updating...' : action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!!item.requesterName && (
        <View style={styles.requesterRow}>
          <Text style={styles.requesterText} numberOfLines={1}>
            Requested by {item.requesterName}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#E9EEF5',
    backgroundColor: COLORS.white,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(12),
    shadowColor: '#13263E',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderImage: {
    width: normalize(52),
    height: normalize(52),
    borderRadius: normalize(10),
    backgroundColor: COLORS.lightGrey,
  },
  titleWrap: {
    marginLeft: normalize(10),
    flex: 1,
  },
  orderTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
  },
  metaText: {
    marginTop: normalize(2),
    color: '#7D8794',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  statusPill: {
    borderRadius: normalize(12),
    backgroundColor: '#FFF3DF',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
  },
  statusPillText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: normalize(10),
  },
  metricCard: {
    flex: 1,
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#EBEFF5',
    backgroundColor: '#FBFCFE',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    marginRight: normalize(8),
  },
  metricLabel: {
    color: '#778395',
    fontSize: FONT_SIZES.XSMALL,
    fontFamily: FONTS.regular,
    marginBottom: normalize(3),
  },
  metricValue: {
    color: COLORS.darkText,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONTS.semiBold,
  },
  quickActionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(10),
  },
  quickActionChip: {
    backgroundColor: '#EAF4FF',
    borderRadius: normalize(13),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    marginRight: normalize(6),
    marginTop: normalize(4),
  },
  quickActionText: {
    color: '#2D74B8',
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
  requesterRow: {
    marginTop: normalize(10),
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    paddingTop: normalize(8),
  },
  requesterText: {
    color: '#7B8695',
    fontSize: FONT_SIZES.XSMALL,
    fontFamily: FONTS.regular,
  },
});

export default OrderItem;
