import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Order } from '../../../models/order';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import FastImage from '@d11/react-native-fast-image';

type OrderItemProps = {
  item: Order;
  onPress: (order: Order) => void;
  onQuickStatusUpdate?: (
    order: Order,
    status: 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'resolved' | 'closed',
  ) => void;
  isUpdating?: boolean;
}

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
    <TouchableOpacity 
      onPress={() => onPress(item)} 
      style={[styles.courseContainer, styles.card]}
      >
      <Image
        // @ts-ignore
        source={item.image}
        style={styles.orderImage}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.details}>
        <View style={styles.flexStart}>
          <Text style={styles.orderTitle} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <View style={[styles.inline, styles.flexStart]}>
          <Text style={styles.orderText}>{'Price:'} {item.amount}</Text>
          <Text style={styles.orderText}>{'Quantity:'} {item.quantity}</Text>
        </View>
        <View style={[styles.inline, styles.flexEnd]}>
          <Text style={styles.orderText}>{item.createdAt}</Text>
          <View style={styles.stockWrapper}>
            <Text style={styles.stockText}>{item.status}</Text>
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: normalize(12),
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    minHeight: normalize(90),
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderImage: {
    width: normalize(90),
    height: '100%',
    borderTopLeftRadius: normalize(12),
    borderBottomLeftRadius: normalize(12),
  },
  details: {
    flex: 1,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    justifyContent: 'space-between',
  },
  orderTitle: {
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  },
  orderText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
  },
  stockWrapper: {
    paddingHorizontal: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    marginLeft: 5,
    marginBottom: normalize(2),
  },
  stockText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
  flexStart: {
    flex: 1, 
    alignItems: 'flex-start',
  },
  flexEnd: {
    flex: 1, 
    alignItems: 'flex-end',
  },
  quickActionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(2),
  },
  quickActionChip: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(3),
    marginRight: normalize(6),
    marginTop: normalize(4),
  },
  quickActionText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
});

export default OrderItem;