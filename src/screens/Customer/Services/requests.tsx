import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Header from '../../../containers/header';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import {MyServiceRequestsScreenProps} from '../../../navigation/types';
import OrderList from '../../../components/Vendor/Order/OrderList';
import ErrorText from '../../../components/UI/ErrorText';
import {Order} from '../../../models/order';
import {getMyServiceRequests} from '../../../api/services.api';
import Filters from '../../../components/UI/Filters';
import Loading from '../../../components/UI/Loading';

const statusOptions = [
  'All',
  'Pending',
  'Accepted',
  'In Progress',
  'Completed',
  'Rejected',
  'Cancelled',
];

const normalizeStatus = (value: string) => {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '_');
};

const MyServiceRequests: React.FC<MyServiceRequestsScreenProps> = ({navigation}) => {
  const [requests, setRequests] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getMyServiceRequests();
      setRequests(result);
    } catch {
      setError('Unable to load your requests right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadRequests();
    } finally {
      setRefreshing(false);
    }
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    if (activeFilter === 'All') {
      return requests;
    }

    return requests.filter(item => {
      return normalizeStatus(item.status) === normalizeStatus(activeFilter);
    });
  }, [activeFilter, requests]);

  return (
    <View style={styles.container}>
      <Header goBack title="My Requests" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Loading visible={refreshing} inline message="Refreshing requests" />
        <Filters
          options={statusOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        {loading ? (
          <ActivityIndicator style={styles.loader} color={COLORS.primary} />
        ) : filteredRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by browsing technicians and sending your first service request.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Services')}>
              <Text style={styles.emptyButtonText}>Browse Services</Text>
            </Pressable>
          </View>
        ) : (
          <OrderList
            orderLists={filteredRequests}
            onPress={order => navigation.navigate('ServiceRequestDetails', {order})}
          />
        )}
        {!loading && filteredRequests.length > 0 && (
          <Text style={styles.hintText}>Open a request to see timeline and delivery status.</Text>
        )}
        {!!error && <ErrorText text={error} />}
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
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: normalize(16),
  },
  loader: {
    paddingTop: normalize(20),
  },
  emptyCard: {
    marginTop: normalize(24),
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(12),
    padding: normalize(14),
  },
  emptyTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: normalize(4),
  },
  emptySubtitle: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    marginBottom: normalize(10),
  },
  emptyButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: normalize(16),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
  },
  emptyButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  hintText: {
    marginTop: normalize(10),
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
});

export default MyServiceRequests;
