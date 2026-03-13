import React, {useMemo, useState, useCallback} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
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
import {useFocusEffect} from '@react-navigation/native';
import {userContext} from '../../../contexts/UserContext';
import {
  getServiceRequestsForTechnician,
  updateTechnicianServiceRequestStatus,
} from '../../../api/services.api';
import {getIncomingMarketplaceOrders} from '../../../api/marketplace.api';
import ErrorText from '../../../components/UI/ErrorText';

const technicianOptions = [
  'All',
  'New',
  'Pending',
  'Accepted',
  'In Progress',
  'Completed',
  'Resolved',
  'Closed',
  'Rejected',
  'Cancelled',
];

const normalizeStatus = (value: string) => {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '_');
};

const Orders: React.FC<OrdersScreenProps> = ({ navigation }) => {
  useStatusBarStyle('dark-content', 'light-content');
  const {user} = userContext();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | number | null>(null);

  const normalizedRole =
    (user?.accountType || user?.profile?.professionType || '').toLowerCase?.() ||
    '';
  const isTechnician = normalizedRole === 'technician';
  const isFarmer = normalizedRole === 'farmer';
  const isSeller = isTechnician || isFarmer;

  const loadOrders = useCallback(async () => {
    if (!isSeller) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const result = isTechnician
        ? await getServiceRequestsForTechnician()
        : await getIncomingMarketplaceOrders();
      setOrders(result);
    } catch (loadError: any) {
      setError(loadError?.message || 'Unable to load requests.');
    } finally {
      setLoading(false);
    }
  }, [isSeller, isTechnician]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  const filteredOrders = useMemo(() => {
    const query = String(searchQuery || '').trim().toLowerCase();

    return orders
      .filter(item => {
        if (activeFilter === 'All') {
          return true;
        }

        const matchesLabel =
          normalizeStatus(String(item.status || '')) === normalizeStatus(activeFilter);
        const matchesRaw =
          normalizeStatus(String(item.rawStatus || '')) === normalizeStatus(activeFilter);
        return matchesLabel || matchesRaw;
      })
      .filter(item => {
        if (!query) {
          return true;
        }

        return [
          item.name,
          item.requesterName,
          item.requesterPhone,
          item.requesterEmail,
          item.message,
          item.status,
          item.rawStatus,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);
      });
  }, [activeFilter, orders, searchQuery]);

  function editOrder(order: Order) {
    navigation.navigate('OrderDetails', { order })
  }

  const updateOrderStatus = useCallback(
    async (
      order: Order,
      nextStatus: 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'resolved' | 'closed',
    ) => {
      try {
        setUpdatingOrderId(order.id);
        setError('');
        setSuccess('');
        const nextOrder = await updateTechnicianServiceRequestStatus(
          Number(order.id),
          nextStatus,
        );

        setOrders(prev =>
          prev.map(item =>
            String(item.id) === String(order.id)
              ? {
                  ...item,
                  ...nextOrder,
                }
              : item,
          ),
        );
        setSuccess(`Request updated: ${nextOrder.status}`);
      } catch (statusError: any) {
        setError(statusError?.message || 'Unable to update request status.');
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [],
  );

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView 
        headerHeight={headerHeight()}
        onRefresh={loadOrders}
        refreshMessage="Refreshing requests"
        headerContent={(
          <>
          <SearchBar
            placeholder={isTechnician ? 'Find service requests' : 'Find marketplace orders'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          </>
        )}
      >
        {isSeller && (
          <Filters
            options={technicianOptions}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}
        {!!error && <ErrorText text={error} />}
        {!!success && <Text style={styles.successText}>{success}</Text>}
        {!isSeller ? (
          <ErrorText text="Orders are currently available for seller accounts." />
        ) : loading ? (
          <ActivityIndicator style={styles.loader} color={COLORS.primary} />
        ) : filteredOrders.length === 0 ? (
          <ErrorText
            text={
              isTechnician
                ? 'No service requests found for your filters.'
                : 'No marketplace orders found for your filters.'
            }
          />
        ) : (
          <OrderList
            orderLists={filteredOrders}
            onPress={editOrder}
            onQuickStatusUpdate={isTechnician ? updateOrderStatus : undefined}
            updatingOrderId={updatingOrderId}
          />
        )}
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
  loader: {
    marginTop: normalize(20),
  },
  successText: {
    marginTop: normalize(10),
    color: COLORS.darkGreen,
    fontSize: normalize(11),
  },
});

export default Orders;