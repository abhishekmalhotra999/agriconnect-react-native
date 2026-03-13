import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../../containers/header';
import {normalize} from '../../../utils/util';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {
  getPlacedMarketplaceOrders,
  PlacedMarketplaceOrder,
} from '../../../store/cart.storage';
import Loading from '../../../components/UI/Loading';

const formatDate = (iso: string) => {
  const value = String(iso || '').trim();
  if (!value) {
    return '-';
  }

  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return value.slice(0, 10);
  }
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<PlacedMarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPlacedMarketplaceOrders();
      setOrders(response);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  }, [orders]);

  return (
    <View style={styles.container}>
      <Header goBack title="My Orders" icons={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Loading visible={loading} inline message="Loading orders" />
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Orders</Text>
          <Text style={styles.summaryValue}>{orders.length}</Text>
          <Text style={styles.summarySubtext}>Total Spent: R{totalSpent.toFixed(2).replace(/\.00$/, '')}</Text>
        </View>

        {orders.length === 0 && !loading ? (
          <Text style={styles.emptyText}>No placed marketplace orders yet.</Text>
        ) : null}

        {orders.map(order => (
          <View style={styles.orderCard} key={order.id}>
            <View style={styles.rowBetween}>
              <Text style={styles.orderStatus}>{order.status}</Text>
              <Text style={styles.orderAmount}>{order.totalAmountLabel}</Text>
            </View>
            <Text style={styles.orderMeta}>Order ID: {order.id}</Text>
            <Text style={styles.orderMeta}>Date: {formatDate(order.createdAt)}</Text>
            <Text style={styles.orderMeta}>Items: {order.items.length}</Text>
            {order.items.map(item => (
              <Text key={`${order.id}-${item.productId}`} style={styles.itemRow}>
                {item.quantity} x {item.name} ({item.priceLabel})
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(120),
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: '#E7ECF4',
    borderRadius: normalize(12),
    backgroundColor: '#FBFCFE',
    padding: normalize(12),
    marginTop: normalize(6),
  },
  summaryLabel: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
  summaryValue: {
    marginTop: normalize(4),
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.LARGE,
  },
  summarySubtext: {
    marginTop: normalize(4),
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
  emptyText: {
    marginTop: normalize(14),
    color: COLORS.grey,
    fontSize: FONT_SIZES.SMALL,
  },
  orderCard: {
    marginTop: normalize(12),
    borderWidth: 1,
    borderColor: '#E7ECF4',
    borderRadius: normalize(12),
    backgroundColor: COLORS.white,
    padding: normalize(12),
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
  orderAmount: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
  orderMeta: {
    marginTop: normalize(4),
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  itemRow: {
    marginTop: normalize(6),
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
  },
});

export default MyOrders;
