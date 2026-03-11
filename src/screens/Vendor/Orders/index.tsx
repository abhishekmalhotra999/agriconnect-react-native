import React, {useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
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
import {getServiceRequestsForTechnician} from '../../../api/services.api';
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

  const normalizedRole =
    (user?.accountType || user?.profile?.professionType || '').toLowerCase?.() ||
    '';
  const isTechnician = normalizedRole === 'technician';

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;

      const loadOrders = async () => {
        if (!isTechnician) {
          setOrders([]);
          return;
        }

        try {
          setLoading(true);
          setError('');
          const result = await getServiceRequestsForTechnician();
          if (mounted) {
            setOrders(result);
          }
        } catch (loadError: any) {
          if (mounted) {
            setError(loadError?.message || 'Unable to load requests.');
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      loadOrders();

      return () => {
        mounted = false;
      };
    }, [isTechnician]),
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

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView 
        headerHeight={headerHeight()}
        headerContent={(
          <>
          <SearchBar
            placeholder={isTechnician ? 'Find service requests' : 'Find orders'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          </>
        )}
      >
        {isTechnician && (
          <Filters
            options={technicianOptions}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}
        {!!error && <ErrorText text={error} />}
        {!isTechnician ? (
          <ErrorText text="Orders are currently available for technician accounts." />
        ) : loading ? (
          <ActivityIndicator style={styles.loader} color={COLORS.primary} />
        ) : filteredOrders.length === 0 ? (
          <ErrorText text="No service requests found for your filters." />
        ) : (
          <OrderList orderLists={filteredOrders} onPress={editOrder} />
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
});

export default Orders;