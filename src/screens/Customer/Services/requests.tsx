import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Header from '../../../containers/header';
import {COLORS} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import {MyServiceRequestsScreenProps} from '../../../navigation/types';
import OrderList from '../../../components/Vendor/Order/OrderList';
import ErrorText from '../../../components/UI/ErrorText';
import {Order} from '../../../models/order';
import {getMyServiceRequests} from '../../../api/services.api';
import Filters from '../../../components/UI/Filters';

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
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getMyServiceRequests();
        if (mounted) {
          setRequests(result);
        }
      } catch (_error) {
        if (mounted) {
          setError('Unable to load your requests right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      mounted = false;
    };
  }, []);

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
      <View style={styles.content}>
        <Filters
          options={statusOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        {loading ? (
          <ActivityIndicator style={styles.loader} color={COLORS.primary} />
        ) : filteredRequests.length === 0 ? (
          <ErrorText text="No requests found for the selected filter." />
        ) : (
          <OrderList
            orderLists={filteredRequests}
            onPress={order => navigation.navigate('ServiceRequestDetails', {order})}
          />
        )}
        {!!error && <ErrorText text={error} />}
      </View>
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
    paddingHorizontal: normalize(16),
  },
  loader: {
    paddingTop: normalize(20),
  },
});

export default MyServiceRequests;
