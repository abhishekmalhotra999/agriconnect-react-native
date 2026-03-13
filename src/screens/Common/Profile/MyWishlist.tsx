import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../../containers/header';
import AppImage from '../../../components/UI/AppImage';
import ErrorText from '../../../components/UI/ErrorText';
import {getUserPreferences, toggleSavedPreference} from '../../../api/preferences.api';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';

type SavedItem = {
  type: string;
  id: string;
  title?: string;
  subtitle?: string;
  image?: string;
  link?: string;
};

type FilterType = 'all' | 'product' | 'service' | 'course';

const FILTERS: FilterType[] = ['all', 'product', 'service', 'course'];

const MyWishlist: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const loadSavedItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const preferences = await getUserPreferences();
      const incoming = Array.isArray(preferences.savedItems)
        ? preferences.savedItems
        : [];

      const normalized = incoming
        .filter(item => item?.id !== undefined)
        .map(item => ({
          type: String(item.type || 'product').toLowerCase(),
          id: String(item.id),
          title: item.title,
          subtitle: item.subtitle,
          image: item.image,
          link: item.link,
        }));

      setSavedItems(normalized);
    } catch (_error) {
      setError('Unable to load your wishlist right now.');
      setSavedItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSavedItems();
    }, [loadSavedItems]),
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return savedItems;
    }

    return savedItems.filter(item => String(item.type) === activeFilter);
  }, [activeFilter, savedItems]);

  const removeSavedItem = async (item: SavedItem) => {
    const key = `${item.type}-${item.id}`;
    if (savingIds[key]) {
      return;
    }

    const current = [...savedItems];
    setSavingIds(prev => ({...prev, [key]: true}));
    setSavedItems(prev =>
      prev.filter(
        row => !(String(row.id) === String(item.id) && String(row.type) === String(item.type)),
      ),
    );

    try {
      const nextState = await toggleSavedPreference(item.type, {
        type: item.type,
        id: String(item.id),
        title: item.title,
        subtitle: item.subtitle,
        image: item.image,
        link: item.link,
      });

      if (nextState) {
        setSavedItems(current);
      }
    } catch {
      setSavedItems(current);
      setError('Unable to update wishlist item. Please try again.');
    } finally {
      setSavingIds(prev => ({...prev, [key]: false}));
    }
  };

  return (
    <View style={styles.container}>
      <Header goBack title="My Wishlist" icons={false} />
      <View style={styles.filtersRow}>
        {FILTERS.map(filter => {
          const active = activeFilter === filter;
          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, active && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {!!error && <ErrorText text={error} />}
        {loading ? (
          <ActivityIndicator style={styles.loader} color={COLORS.primary} />
        ) : filteredItems.length === 0 ? (
          <Text style={styles.emptyText}>No saved items in this wishlist yet.</Text>
        ) : (
          filteredItems.map(item => {
            const saveKey = `${item.type}-${item.id}`;
            return (
              <View style={styles.card} key={saveKey}>
                <AppImage
                  source={item.image ? {uri: item.image} : null}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.body}>
                  <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title || 'Saved item'}
                    </Text>
                    <Text style={styles.typeBadge} numberOfLines={1}>
                      {String(item.type || 'item')}
                    </Text>
                  </View>
                  {!!item.subtitle && (
                    <Text style={styles.subtitle} numberOfLines={2}>
                      {item.subtitle}
                    </Text>
                  )}
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => removeSavedItem(item)}
                    disabled={Boolean(savingIds[saveKey])}>
                    <Text style={styles.removeBtnText}>
                      {savingIds[saveKey] ? 'Removing...' : 'Remove'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
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
    paddingTop: normalize(10),
    paddingBottom: normalize(120),
  },
  loader: {
    paddingTop: normalize(18),
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
    paddingHorizontal: normalize(16),
    paddingTop: normalize(10),
  },
  filterChip: {
    borderRadius: normalize(20),
    borderWidth: 1,
    borderColor: '#D8E1EE',
    backgroundColor: '#F8FAFD',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(12),
  },
  filterChipActive: {
    borderColor: '#BFD0EA',
    backgroundColor: '#EAF2FF',
  },
  filterChipText: {
    color: '#54617A',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  filterChipTextActive: {
    color: '#1F4E93',
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E7EDF6',
    borderRadius: normalize(14),
    backgroundColor: '#FFFFFF',
    padding: normalize(10),
    marginBottom: normalize(10),
  },
  image: {
    width: normalize(82),
    height: normalize(82),
    borderRadius: normalize(10),
    backgroundColor: '#EEF2F8',
  },
  body: {
    flex: 1,
    marginLeft: normalize(10),
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: '#1C2533',
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    marginRight: normalize(8),
  },
  typeBadge: {
    color: '#657286',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    backgroundColor: '#F1F5FB',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
  },
  subtitle: {
    marginTop: normalize(6),
    color: '#6F7A8E',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  removeBtn: {
    marginTop: normalize(8),
    alignSelf: 'flex-start',
    borderRadius: normalize(8),
    backgroundColor: '#FFECEE',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(10),
  },
  removeBtnText: {
    color: '#C83345',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  emptyText: {
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: normalize(24),
  },
});

export default MyWishlist;