import React, {useRef, useEffect, useMemo, useState, useCallback} from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Platform,
  Text,
} from 'react-native';
import { HomeScreenProps } from '../../navigation/types';
import Header from '../../containers/header';
import SearchBar from '../../components/UI/SearchBar';
import AnimatedHeaderScrollView from '../../components/UI/AnimatedScrollView';
import { useScrollContext } from '../../contexts/ScrollContext';
import { normalize } from '../../utils/util';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';
import useStatusBarStyle from '../../hooks/useStatusBarStyle';
import {getUserPreferences} from '../../api/preferences.api';
import {useAppSelector} from '../../store/storage';
import {userContext} from '../../contexts/UserContext';
import {Product} from '../../models/Product';
import {getMarketplaceProducts} from '../../api/marketplace.api';
import {getServiceListings} from '../../api/services.api';
import Loading from '../../components/UI/Loading';

const searchScopes = [
  'All',
  'Marketplace',
  'Services',
  'Learning',
  'Recent',
  'Quick Actions',
] as const;

type SearchScope = (typeof searchScopes)[number];

const campaigns = [
  {
    id: 'produce',
    title: 'Fresh Harvest Week',
    subtitle: 'Discover seasonal produce and trusted sellers near you.',
    cta: 'Shop Now',
    image: require('../../../assets/images/dump/RS7418_FarmAfrica-Kitui-6_lpr-e1724232960212.jpg'),
    action: 'Products' as const,
  },
  {
    id: 'services',
    title: 'Book Farm Technicians',
    subtitle: 'Repair, diagnostics, and on-site support in minutes.',
    cta: 'Explore Services',
    image: require('../../../assets/images/dump/HELLO-FUTURE-ServicesAgricolesAfrique-1198x500.jpg'),
    action: 'Services' as const,
  },
  {
    id: 'learn',
    title: 'Learn and Grow Faster',
    subtitle: 'Practical courses to improve farm output and quality.',
    cta: 'Continue Learning',
    image: require('../../../assets/images/dump/Sect2_AGRICULTURE-AND-FOOD_HiRes-32.png'),
    action: 'Learn' as const,
  },
];

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  useStatusBarStyle('light-content', 'dark-content');
  const {user} = userContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [highlightsLoading, setHighlightsLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const [recentItems, setRecentItems] = useState<
    Array<{id: string; type?: string; title?: string; subtitle?: string}>
  >([]);
  const [marketplaceHighlights, setMarketplaceHighlights] = useState<Product[]>([]);
  const [serviceHighlights, setServiceHighlights] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [activeSearchScope, setActiveSearchScope] = useState<SearchScope>('All');
  const courses = useAppSelector(state => state.learn.courses);
  const lessonsProgress = useAppSelector(state => state.learn.lessonsProgress);

  const loadPreferences = useCallback(async () => {
    setPreferencesLoading(true);
    try {
      const result = await getUserPreferences();
      const saved = Array.isArray(result?.savedItems) ? result.savedItems : [];
      const recent = Array.isArray(result?.recentItems) ? result.recentItems : [];
      setSavedCount(saved.length);
      setRecentItems(recent.slice(0, 4));
    } catch {
      setSavedCount(0);
      setRecentItems([]);
    } finally {
      setPreferencesLoading(false);
    }
  }, []);

  const loadHighlights = useCallback(async () => {
    setHighlightsLoading(true);
    try {
      const [products, services] = await Promise.all([
        getMarketplaceProducts().catch(() => []),
        getServiceListings().catch(() => []),
      ]);
      setMarketplaceHighlights((products || []).slice(0, 4));
      setServiceHighlights((services || []).slice(0, 3));
    } finally {
      setHighlightsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    await Promise.all([loadPreferences(), loadHighlights()]);
  }, [loadHighlights, loadPreferences]);

  useEffect(() => {
    registerScrollRef('HOME_TAB', scrollViewRef as React.RefObject<ScrollView>);
  }, [registerScrollRef]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    loadHighlights();
  }, [loadHighlights]);

  const quickActions = useMemo(
    () => [
      {
        title: 'Marketplace',
        subtitle: 'Buy from verified farmers',
        action: () => navigation.navigate('Products'),
      },
      {
        title: 'Services',
        subtitle: 'Book certified technicians',
        action: () => navigation.navigate('Services'),
      },
      {
        title: 'My Requests',
        subtitle: 'Track open service jobs',
        action: () => navigation.navigate('MyServiceRequests'),
      },
      {
        title: 'Learning',
        subtitle: 'Continue your course path',
        action: () => navigation.navigate('Learn'),
      },
    ],
    [navigation],
  );

  const learningSnapshot = useMemo(() => {
    if (!Array.isArray(lessonsProgress) || lessonsProgress.length === 0) {
      return {
        totalCoursesInProgress: 0,
        completedLessons: 0,
        totalLessons: 0,
        activeCourseTitle: 'Start your first course',
      };
    }

    const totals = lessonsProgress.reduce(
      (acc, item) => {
        const completed = Number(item?.completedLessons || 0);
        const total = Number(item?.totalLessons || 0);

        return {
          completedLessons: acc.completedLessons + completed,
          totalLessons: acc.totalLessons + total,
        };
      },
      {completedLessons: 0, totalLessons: 0},
    );

    const active = lessonsProgress
      .slice()
      .sort((a, b) => {
        const ratioA = (a.totalLessons || 1) / ((a.completedLessons || 0) + 1);
        const ratioB = (b.totalLessons || 1) / ((b.completedLessons || 0) + 1);
        return ratioA - ratioB;
      })
      .find(item => (item.completedLessons || 0) < (item.totalLessons || 0));

    const activeCourse = courses.find(course => Number(course.id) === Number(active?.courseId));

    return {
      totalCoursesInProgress: lessonsProgress.filter(
        item => (item.completedLessons || 0) < (item.totalLessons || 0),
      ).length,
      completedLessons: totals.completedLessons,
      totalLessons: totals.totalLessons,
      activeCourseTitle: activeCourse?.title || 'Continue learning',
    };
  }, [courses, lessonsProgress]);

  const openRecentItem = (item: {id: string; type?: string; title?: string; subtitle?: string}) => {
    const kind = String(item.type || '').toLowerCase();
    const title = String(item.title || '').toLowerCase();

    if (kind === 'service' || title.indexOf('service') >= 0) {
      navigation.navigate('Services');
      return;
    }

    if (kind === 'course' || title.indexOf('course') >= 0 || title.indexOf('lesson') >= 0) {
      navigation.navigate('Learn');
      return;
    }

    navigation.navigate('Products');
  };

  const dashboardSummary = useMemo(
    () => [
      {
        title: 'Saved',
        value: String(savedCount),
        subtitle: 'bookmarks',
      },
      {
        title: 'Recent',
        value: String(recentItems.length),
        subtitle: 'activities',
      },
      {
        title: 'Learning',
        value: `${learningSnapshot.completedLessons}/${learningSnapshot.totalLessons}`,
        subtitle: 'lessons',
      },
    ],
    [learningSnapshot.completedLessons, learningSnapshot.totalLessons, recentItems.length, savedCount],
  );

  const greetingName = String(user?.name || '').trim() || 'Farmer';

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }

    const items: Array<{
      id: string;
      scope: Exclude<SearchScope, 'All'>;
      title: string;
      subtitle: string;
      onPress: () => void;
    }> = [
      ...quickActions.map(item => ({
        id: `quick-${item.title}`,
        scope: 'Quick Actions' as const,
        title: item.title,
        subtitle: item.subtitle,
        onPress: item.action,
      })),
      ...marketplaceHighlights.map(item => ({
        id: `market-${item.id}`,
        scope: 'Marketplace' as const,
        title: item.name,
        subtitle: `${item.category || 'Product'} ${item.discountedPrice ? `- ${item.discountedPrice}` : ''}`.trim(),
        onPress: () => navigation.navigate('ProductDetails', {product: item}),
      })),
      ...serviceHighlights.map(item => ({
        id: `service-${item.id}`,
        scope: 'Services' as const,
        title: item.name,
        subtitle: item.serviceArea || 'Service listing',
        onPress: () => navigation.navigate('ServiceDetails', {product: item}),
      })),
      ...courses.map(course => ({
        id: `course-${course.id}`,
        scope: 'Learning' as const,
        title: course.title,
        subtitle: course.description || 'Course',
        onPress: () => navigation.navigate('Learn'),
      })),
      ...recentItems.map(item => ({
        id: `recent-${item.type || 'item'}-${item.id}`,
        scope: 'Recent' as const,
        title: item.title || 'Untitled',
        subtitle: item.subtitle || String(item.type || 'recent activity'),
        onPress: () => openRecentItem(item),
      })),
    ];

    return items.filter(item => {
      if (activeSearchScope !== 'All' && item.scope !== activeSearchScope) {
        return false;
      }

      const haystack = `${item.title} ${item.subtitle} ${item.scope}`.toLowerCase();
      return haystack.indexOf(query) >= 0;
    });
  }, [
    activeSearchScope,
    courses,
    marketplaceHighlights,
    navigation,
    quickActions,
    recentItems,
    searchQuery,
    serviceHighlights,
  ]);

  return (
    <View style={styles.container}>
    <Header />
    <AnimatedHeaderScrollView
      ref={scrollViewRef}
      headerHeight={normalize(65)}
      showsVerticalScrollIndicator={false}
      onRefresh={handleRefresh}
      refreshMessage="Refreshing home data"
      headerContent={(
        <>
        <SearchBar
          hasFilter={true}
          placeholder="Search.."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setShowSearchFilters(prev => !prev)}
          isFilterActive={showSearchFilters || activeSearchScope !== 'All'}
        />
        </>
      )}
      >
        {showSearchFilters ? (
          <View style={styles.searchFilterWrap}>
            <FlatList
              horizontal
              data={searchScopes}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.searchFilterListContent}
              renderItem={({item: scope}) => (
                <Pressable
                  style={[
                    styles.searchFilterChip,
                    activeSearchScope === scope && styles.searchFilterChipActive,
                  ]}
                  onPress={() => setActiveSearchScope(scope)}>
                  <Text
                    style={[
                      styles.searchFilterChipText,
                      activeSearchScope === scope && styles.searchFilterChipTextActive,
                    ]}>
                    {scope}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        ) : null}

        {searchQuery.trim() ? (
          <View style={styles.searchResultsSection}>
            <View style={styles.discoveryHeader}>
              <Text style={styles.sectionHeading}>Search Results</Text>
              <Text style={styles.resultCountText}>{searchResults.length} found</Text>
            </View>
            <View style={styles.sectionSurface}>
              {searchResults.length === 0 ? (
                <Text style={styles.emptyRecentText}>No matches in selected scope.</Text>
              ) : (
                searchResults.slice(0, 10).map(item => (
                  <Pressable
                    key={item.id}
                    style={styles.searchResultCard}
                    onPress={item.onPress}>
                    <View style={styles.highlightMetaWrap}>
                      <Text style={styles.highlightPill}>{item.scope}</Text>
                      <Text style={styles.highlightTitle}>{item.title}</Text>
                      <Text numberOfLines={1} style={styles.highlightSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <Text style={styles.highlightArrow}>></Text>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.bannerSection}>
          <FlatList
            data={campaigns}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.bannerListContent}
            renderItem={({item}) => (
              <Pressable
                style={styles.bannerCard}
                onPress={() => navigation.navigate(item.action)}>
                <ImageBackground source={item.image} style={styles.bannerImage} imageStyle={styles.bannerImageStyle}>
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    <View style={styles.bannerCtaWrap}>
                      <Text style={styles.bannerCta}>{item.cta}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Welcome back, {greetingName}</Text>
          <Text style={styles.heroSubtitle}>
            Manage your farm commerce, support, and learning from one place.
          </Text>
          <View style={styles.summaryRow}>
            {dashboardSummary.map(item => (
              <View key={item.title} style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{item.title}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryHint}>{item.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionHeading}>Quick Actions</Text>
          <View style={styles.sectionSurface}>
            <View style={styles.quickActionsGrid}>
            {quickActions.map(item => (
              <Pressable key={item.title} style={styles.quickCard} onPress={item.action}>
                <View style={styles.quickChip}>
                  <Text style={styles.quickChipText}>Open</Text>
                </View>
                <Text style={styles.quickTitle}>{item.title}</Text>
                <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
              </Pressable>
            ))}
            </View>
          </View>
        </View>

        <View style={styles.learningSection}>
          <Text style={styles.sectionHeading}>Learning Snapshot</Text>
          <View style={styles.sectionSurface}>
            <Pressable style={styles.learningCard} onPress={() => navigation.navigate('Learn')}>
              <Text style={styles.learningTitle}>{learningSnapshot.activeCourseTitle}</Text>
              <Text style={styles.learningMeta}>
                {learningSnapshot.completedLessons}/{learningSnapshot.totalLessons} lessons completed
              </Text>
              <Text style={styles.learningMeta}>
                {learningSnapshot.totalCoursesInProgress} course(s) in progress
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionHeading}>Recently Viewed</Text>
          <View style={styles.sectionSurface}>
            {preferencesLoading ? (
              <Loading visible inline message="Loading recent activity" />
            ) : recentItems.length === 0 ? (
              <Text style={styles.emptyRecentText}>Your recent items will appear here.</Text>
            ) : (
              recentItems.map(item => (
                <Pressable
                  key={`${item.type || 'item'}-${item.id}`}
                  style={styles.recentCard}
                  onPress={() => openRecentItem(item)}>
                  <View style={styles.recentMetaWrap}>
                    <Text style={styles.recentType}>{String(item.type || 'item')}</Text>
                    <Text style={styles.recentTitle}>{item.title || 'Untitled'}</Text>
                    {!!item.subtitle && <Text style={styles.recentSubtitle}>{item.subtitle}</Text>}
                  </View>
                  <View style={styles.openBadge}>
                    <Text style={styles.openText}>Open</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>

        <View style={styles.discoverySection}>
          <View style={styles.discoveryHeader}>
            <Text style={styles.sectionHeading}>Service Picks For You</Text>
            <Pressable onPress={() => navigation.navigate('Services')}>
              <Text style={styles.sectionAction}>View all</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.highlightListWrap}>
          <View style={styles.sectionSurface}>
            {highlightsLoading ? (
              <Loading visible inline message="Loading service picks" />
            ) : serviceHighlights.length === 0 ? (
              <Text style={styles.emptyRecentText}>Services will appear here once available.</Text>
            ) : (
              serviceHighlights.map(item => (
                <Pressable
                  key={`service-${item.id}`}
                  style={styles.highlightCard}
                  onPress={() => navigation.navigate('ServiceDetails', {product: item})}>
                  <View style={styles.highlightMetaWrap}>
                    <Text style={styles.highlightPill}>Service</Text>
                    <Text style={styles.highlightTitle}>{item.name}</Text>
                    <Text style={styles.highlightSubtitle}>
                      {item.serviceArea || 'Area to be confirmed'}
                    </Text>
                  </View>
                  <Text style={styles.highlightArrow}>></Text>
                </Pressable>
              ))
            )}
          </View>
        </View>

        <View style={styles.discoverySection}>
          <View style={styles.discoveryHeader}>
            <Text style={styles.sectionHeading}>Marketplace Highlights</Text>
            <Pressable onPress={() => navigation.navigate('Products')}>
              <Text style={styles.sectionAction}>View all</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.highlightListWrap}>
          <View style={styles.sectionSurface}>
            {highlightsLoading ? (
              <Loading visible inline message="Loading market highlights" />
            ) : marketplaceHighlights.length === 0 ? (
              <Text style={styles.emptyRecentText}>Products will appear here once available.</Text>
            ) : (
              marketplaceHighlights.map(item => (
                <Pressable
                  key={`market-${item.id}`}
                  style={styles.highlightCard}
                  onPress={() => navigation.navigate('ProductDetails', {product: item})}>
                  <View style={styles.highlightMetaWrap}>
                    <Text style={styles.highlightPill}>Product</Text>
                    <Text style={styles.highlightTitle}>{item.name}</Text>
                    <Text style={styles.highlightSubtitle}>
                      {item.category} - {item.discountedPrice}
                    </Text>
                  </View>
                  <Text style={styles.highlightArrow}>></Text>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </AnimatedHeaderScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  bannerSection: {
    marginTop: normalize(2),
    marginBottom: normalize(10),
  },
  searchFilterWrap: {
    marginTop: normalize(6),
    marginBottom: normalize(10),
  },
  searchFilterListContent: {
    marginHorizontal: normalize(16),
    paddingRight: normalize(12),
  },
  searchFilterChip: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(14),
    backgroundColor: COLORS.white,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    marginRight: normalize(8),
  },
  searchFilterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  searchFilterChipText: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  searchFilterChipTextActive: {
    color: COLORS.primary,
  },
  searchResultsSection: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(10),
    marginTop: normalize(2),
  },
  searchResultCard: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(10),
    padding: normalize(10),
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  resultCountText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  bannerListContent: {
    paddingHorizontal: normalize(16),
    gap: normalize(10),
  },
  bannerCard: {
    width: normalize(300),
    height: normalize(160),
    borderRadius: normalize(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  bannerImage: {
    flex: 1,
  },
  bannerImageStyle: {
    borderRadius: normalize(14),
  },
  bannerOverlay: {
    flex: 1,
    padding: normalize(14),
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerTitle: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
  },
  bannerSubtitle: {
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    marginTop: normalize(3),
  },
  bannerCtaWrap: {
    alignSelf: 'flex-start',
    marginTop: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: normalize(14),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(3),
  },
  bannerCta: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XXSMALL,
  },
  heroSection: {
    marginHorizontal: normalize(16),
    borderRadius: normalize(14),
    backgroundColor: COLORS.primary,
    padding: normalize(14),
    marginBottom: normalize(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroTitle: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.LARGE,
  },
  heroSubtitle: {
    color: COLORS.white,
    opacity: 0.9,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    marginTop: normalize(2),
    marginBottom: normalize(10),
  },
  summaryRow: {
    flexDirection: 'row',
    gap: normalize(8),
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: normalize(10),
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(8),
  },
  summaryLabel: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XXSMALL,
  },
  summaryValue: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    marginVertical: normalize(2),
  },
  summaryHint: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XXSMALL,
  },
  sectionHeading: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: normalize(8),
  },
  quickActionsSection: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(10),
  },
  sectionSurface: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(14),
    backgroundColor: COLORS.white,
    padding: normalize(10),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
  },
  quickCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(12),
    padding: normalize(12),
    backgroundColor: COLORS.white,
    minHeight: normalize(94),
  },
  quickChip: {
    alignSelf: 'flex-start',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(7),
    paddingVertical: normalize(2),
    backgroundColor: COLORS.primaryLight,
    marginBottom: normalize(4),
  },
  quickChipText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XXSMALL,
  },
  quickTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    marginBottom: normalize(2),
  },
  quickSubtitle: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  recentSection: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(10),
  },
  learningSection: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(10),
  },
  learningCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(10),
    padding: normalize(10),
    backgroundColor: COLORS.primaryLight,
  },
  learningTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    marginBottom: normalize(4),
  },
  learningMeta: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  recentLoader: {
    paddingVertical: normalize(10),
  },
  emptyRecentText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  recentCard: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(10),
    padding: normalize(10),
    marginBottom: normalize(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentMetaWrap: {
    flex: 1,
    paddingRight: normalize(8),
  },
  recentType: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XXSMALL,
    textTransform: 'uppercase',
  },
  recentTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    marginTop: normalize(2),
  },
  recentSubtitle: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    marginTop: normalize(2),
  },
  openText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  openBadge: {
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(3),
  },
  discoverySection: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(2),
  },
  discoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionAction: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  highlightListWrap: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(10),
  },
  highlightCard: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(10),
    padding: normalize(10),
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  highlightMetaWrap: {
    flex: 1,
    paddingRight: normalize(10),
  },
  highlightPill: {
    alignSelf: 'flex-start',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XXSMALL,
    paddingHorizontal: normalize(7),
    paddingVertical: normalize(2),
    borderRadius: normalize(12),
    marginBottom: normalize(5),
  },
  highlightTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
  highlightSubtitle: {
    marginTop: normalize(2),
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  highlightArrow: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
  }
});

export default Home;
