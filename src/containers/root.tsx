import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  Image,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
} from 'react-native';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {navigationRef} from '../navigation/navigationService';
import {AuthProvider, userContext} from '../contexts/UserContext';
import {OnboardingProvider, useOnboarding} from '../contexts/OnboardingContext';
// import TabBar from './TabBar';
import {normalize} from '../utils/util';
import OnBoarding from '../screens/OnBoarding';
// Vendor Screens //
import Dashboard from '../screens/Vendor/Dashboard';
import Orders from '../screens/Vendor/Orders';
import OrderDetails from '../screens/Vendor/Orders/show';
import MyProducts from '../screens/Vendor/MyProducts';
import MyProductDetails from '../screens/Vendor/MyProducts/show';
import ManageMyProduct from '../screens/Vendor/MyProducts/manage';

// Customer Screens
import Home from '../screens/Customer/Home';
import Learn from '../screens/Customer/Learn';
import Courses from '../screens/Customer/Learn/Courses';
import Blogs from '../screens/Customer/Blogs';
import Chats from '../screens/Common/Chats';
import ChatRoom from '../screens/Common/Chats/ChatRoom';
import Products from '../screens/Customer/Products';
import ProductDetails from '../screens/Customer/Products/show';
import Services from '../screens/Customer/Services';
import ServiceDetails from '../screens/Customer/Services/show';
import MyServiceRequests from '../screens/Customer/Services/requests';
import ServiceRequestDetails from '../screens/Customer/Services/request.show';
import Profile from '../screens/Common/Profile';
// import MyAccount from '../screens/Common/Profile/MyAccount';
import Cart from '../screens/Customer/Cart';
import InAppNotifications from '../screens/Common/Notifications';
import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import Otp from '../screens/Auth/Otp';
import Welcome from '../screens/Auth/Welcome';
import FirmDetail from '../screens/Auth/FirmDetail';
import PersonalDetail from '../screens/Auth/PersonalDetail';
import {
  blogsIcon,
  blogsIconActive,
  chatsIcon,
  chatsIconActive,
  homeIcon,
  homeIconActive,
  learnIcon,
  learnIconActive,
} from '../constants/images';
import {COLORS, FONTS, FONT_SIZES} from '../themes/styles';
import {useScrollContext, ScrollProvider} from '../contexts/ScrollContext';
import {Product} from '../models/Product';
import {Order} from '../models/order';
import {User} from '../models/user';
import MyAccount from '../screens/Common/Profile/MyAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {authActions} from '../store/slices/auth.slice';
import {useAppSelector} from '../store/storage';
import Lesson from '../screens/Customer/Learn/Lesson';
import LessonDetail from '../screens/Customer/Learn/LessonDetail';
import ComingSoon from '../screens/ComingSoon';
import PrivacyPolicy from '../screens/Common/Profile/PrivacyPolicy';
import HelpCenter from '../screens/Common/Profile/HelpCenter';
import FarmerOnboardingScreen from '../screens/Vendor/FarmerOnboarding';
import {getUserPreferences} from '../api/preferences.api';
import {
  resolveCustomerBottomTabInitialRoute,
  resolveRootFlowView,
} from './rootFlow';
import Loading from '../components/UI/Loading';

type CustomerRootStackParamList = {
  Home: {
    registerScrollRef: (ref: React.RefObject<ScrollView>) => void;
  };
  HOME_TAB: undefined;
  Learn: undefined;
  Blogs: undefined;
  BLOGS_TAB: undefined;
  Chats: undefined;
  CHATS_TAB: undefined;
  SELLER_TAB: undefined;
  Products: undefined;
  ProductDetails: {product: Product};
  ChatRoom: {chatId: number};
  Cart: undefined;
};

type HomeStackParamList = {
  Home: {
    registerScrollRef: (ref: React.RefObject<ScrollView>) => void;
  };
};

type LearnStackParamList = {
  LearnStack: undefined;
  Courses: undefined;
  Lesson: undefined;
  LessonDetail: undefined;
};

type BlogStackParamList = {
  Blogs: undefined;
};

type ProductStackParamList = {
  Products: undefined;
  ProductDetails: {product: Product};
  Services: undefined;
  ServiceDetails: {product: Product};
  MyServiceRequests: undefined;
  ServiceRequestDetails: {order: Order};
};

type VendorRootStackParamList = {
  Dashboard: undefined;
  DASHBOARD_TAB: undefined;
  Orders: undefined;
  MY_PRODUCTS: undefined;
  RECEIVED_ORDERS: undefined;
  Chats: undefined;
  CHATS_TAB: undefined;
};

type DashboardStackParamList = {
  Dashboard: undefined;
  MyProducts: undefined;
  MyProductDetails: {product: Product};
  ManageMyProduct: {product?: Product};
};

type MyProductStackParamList = {
  MyProducts: undefined;
  MyProductDetails: {product: Product};
  ManageMyProduct: {product?: Product};
};

type OrderStackParamList = {
  Orders: undefined;
  OrderDetails: {order: Order};
};

type AuthStackParamList = {
  Welcome: undefined;
  Signup: undefined;
  Login: undefined;
  Otp: {user: User};
  FirmDetail: undefined;
  PersonalDetail: undefined;
};

type OnboardingStackParamList = {
  OnBoarding: undefined;
};

type HeaderStackParamList = {
  InAppNotifications: undefined;
  Profile: undefined;
  Cart: undefined;
};

type ChatStackParamList = {
  Chats: undefined;
  ChatRoom: {chatId: number};
};
type ProfileStachParamList = {
  ProfileHome: undefined;
  MyAccount: undefined;
  PrivacyPolicy: undefined;
  HelpCenter: undefined;
};

const Tab = createBottomTabNavigator<CustomerRootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const HeaderStack = createStackNavigator<HeaderStackParamList>();
const ChatStack = createStackNavigator<ChatStackParamList>();
const LearnStack = createStackNavigator<LearnStackParamList>();
const ProductsStack = createStackNavigator<ProductStackParamList>();
const BlogStack = createStackNavigator<BlogStackParamList>();

const VendorTab = createBottomTabNavigator<VendorRootStackParamList>();
const DashboardStack = createStackNavigator<DashboardStackParamList>();
const MyProductsStack = createStackNavigator<MyProductStackParamList>();
const ProfileStack = createStackNavigator<ProfileStachParamList>();
const OrdersStack = createStackNavigator<OrderStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();

const transitionX: {cardStyleInterpolator: StackCardStyleInterpolator} = {
  cardStyleInterpolator: ({current, layouts}) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};
const ProfileStackNavigation = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{headerShown: false, ...transitionX}}>
      <ProfileStack.Screen name="ProfileHome" component={Profile} />
      <ProfileStack.Screen name="MyAccount" component={MyAccount} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <ProfileStack.Screen name="HelpCenter" component={HelpCenter} />
    </ProfileStack.Navigator>
  );
};

const HomeStackNavigation = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false, ...transitionX}}>
      <HomeStack.Screen name="Home" component={Home} />
      <ProductsStack.Screen name="Products" component={Products} />
      <ProductsStack.Screen name="ProductDetails" component={ProductDetails} />
      <ProductsStack.Screen name="Services" component={Services} />
      <ProductsStack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
      />
      <ProductsStack.Screen
        name="MyServiceRequests"
        component={MyServiceRequests}
      />
      <ProductsStack.Screen
        name="ServiceRequestDetails"
        component={ServiceRequestDetails}
      />
      <HeaderStack.Screen name="Cart" component={Cart} />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
        // component={ComingSoon}
      />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
    </HomeStack.Navigator>
  );
};

const ChatStackNavigation = () => {
  return (
    <ChatStack.Navigator screenOptions={{headerShown: false, ...transitionX}}>
      <ChatStack.Screen name="Chats" component={Chats} />
      <ChatStack.Screen name="ChatRoom" component={ChatRoom} />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
      />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
    </ChatStack.Navigator>
  );
};

const BlogStackNavigation = () => {
  return (
    <BlogStack.Navigator screenOptions={{headerShown: false, ...transitionX}}>
      <BlogStack.Screen name="Blogs" component={Blogs} />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
      />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
    </BlogStack.Navigator>
  );
};

// const HeaderStackNavigation = () => {
//   return (
//     <>
//       <HeaderStack.Screen name="InAppNotifications" component={InAppNotifications} />
//       <HeaderStack.Screen name="Profile" component={Profile} />
//     </>
//   );
// };

const LearnStackNavigation = () => {
  return (
    <LearnStack.Navigator screenOptions={{headerShown: false, ...transitionX}}>
      {/* @ts-ignore */}
      <LearnStack.Screen name="LearnStack" component={Learn} />
      <LearnStack.Screen name="Courses" component={Courses} />
      <LearnStack.Screen name="Lesson" component={Lesson} />
      <LearnStack.Screen name="LessonDetail" component={LessonDetail} />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
      />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
    </LearnStack.Navigator>
  );
};

const ProductsStackNavigation = () => {
  return (
    <ProductsStack.Navigator screenOptions={{headerShown: false, ...transitionX}}>
      <ProductsStack.Screen name="Products" component={Products} />
      <ProductsStack.Screen name="ProductDetails" component={ProductDetails} />
      <ProductsStack.Screen name="Services" component={Services} />
      <ProductsStack.Screen name="ServiceDetails" component={ServiceDetails} />
      <ProductsStack.Screen
        name="MyServiceRequests"
        component={MyServiceRequests}
      />
      <ProductsStack.Screen
        name="ServiceRequestDetails"
        component={ServiceRequestDetails}
      />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
      />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
    </ProductsStack.Navigator>
  );
};

// VENDOR STACK NAVIGATIONS //
const DashboardStackNavigation = () => {
  return (
    <DashboardStack.Navigator
      screenOptions={{headerShown: false, ...transitionX}}>
      <DashboardStack.Screen name="Dashboard" component={Dashboard} />
      <DashboardStack.Screen name="MyProducts" component={MyProducts} />
      <DashboardStack.Screen
        name="MyProductDetails"
        component={MyProductDetails}
      />
      <DashboardStack.Screen
        name="ManageMyProduct"
        component={ManageMyProduct}
      />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
      />
    </DashboardStack.Navigator>
  );
};

const MyProductsStackNavigation = () => {
  return (
    <MyProductsStack.Navigator
      screenOptions={{headerShown: false, ...transitionX}}>
      <MyProductsStack.Screen name="MyProducts" component={MyProducts} />
      <MyProductsStack.Screen
        name="MyProductDetails"
        component={MyProductDetails}
      />
      <MyProductsStack.Screen
        name="ManageMyProduct"
        component={ManageMyProduct}
      />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
      />
    </MyProductsStack.Navigator>
  );
};

const OrdersStackNavigation = () => {
  return (
    <OrdersStack.Navigator screenOptions={{headerShown: false, ...transitionX}}>
      <OrdersStack.Screen name="Orders" component={Orders} />
      <OrdersStack.Screen name="OrderDetails" component={OrderDetails} />
      <HeaderStack.Screen name="Profile" component={ProfileStackNavigation} />
      <HeaderStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
      />
    </OrdersStack.Navigator>
  );
};

// VENDOR STACK NAVIGATIONS //

// AUTH STACK NAVIGATIONS //
const AuthStackScreenNavigation = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false, ...transitionX}}>
      <AuthStack.Screen name="Welcome" component={Welcome} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Otp" component={Otp} />
      <AuthStack.Screen name="PersonalDetail" component={PersonalDetail} />
      <AuthStack.Screen name="FirmDetail" component={FirmDetail} />
    </AuthStack.Navigator>
  );
};
// AUTH STACK NAVIGATIONS //

const OnboardingStackScreenNavigation = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{headerShown: false}}>
      <OnboardingStack.Screen name="OnBoarding" component={OnBoarding} />
    </OnboardingStack.Navigator>
  );
};

// vendor tabs //
const VendorBottomTabNavigation: React.FC = () => {
  const {scrollToTop} = useScrollContext();

  return (
    <VendorTab.Navigator
      initialRouteName={'VendorRoot' as keyof VendorRootStackParamList}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
      }}>
      <VendorTab.Screen
        name="DASHBOARD_TAB"
        component={DashboardStackNavigation}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('DASHBOARD_TAB');
            }
          },
        })}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? COLORS.primary : COLORS.grey,
                  },
                ]}>
                Seller
              </Text>
            </>
          ),
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? homeIconActive : homeIcon}
              style={styles.icon}
            />
          ),
        }}
      />
      <VendorTab.Screen
        name="MY_PRODUCTS"
        component={MyProductsStackNavigation}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('MY_PRODUCTS');
            }
          },
        })}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? COLORS.primary : COLORS.grey,
                  },
                ]}>
                Products
              </Text>
            </>
          ),
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? learnIconActive : learnIcon}
              style={styles.icon}
            />
          ),
        }}
      />
      <VendorTab.Screen
        name="RECEIVED_ORDERS"
        component={OrdersStackNavigation}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('RECEIVED_ORDERS');
            }
          },
        })}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? COLORS.primary : COLORS.grey,
                  },
                ]}>
                Orders
              </Text>
            </>
          ),
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? blogsIconActive : blogsIcon}
              style={styles.icon}
            />
          ),
        }}
      />
      <VendorTab.Screen
        name="CHATS_TAB"
        component={ChatStackNavigation}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('CHATS_TAB');
            }
          },
        })}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? COLORS.primary : COLORS.grey,
                  },
                ]}>
                Messages
              </Text>
            </>
          ),
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? chatsIconActive : chatsIcon}
              style={[styles.icon, styles.resizeIcon]}
            />
          ),
        }}
      />
    </VendorTab.Navigator>
  );
};

// customer tabs //
const BottomTabNavigation: React.FC<{
  showSellerTab?: boolean;
  initialRouteName?: keyof CustomerRootStackParamList;
}> = ({showSellerTab = false, initialRouteName = 'Learn'}) => {
  const {scrollToTop} = useScrollContext();

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
      }}>
      <Tab.Screen
        name="HOME_TAB"
        component={HomeStackNavigation}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('HOME_TAB');
            }
          },
        })}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <>
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? COLORS.primary : COLORS.grey,
                    },
                  ]}>
                  Home
                </Text>
              </>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={focused ? homeIconActive : homeIcon}
                style={styles.icon}
              />
            ),
            tabBarStyle: ['Profile', 'MyAccount'].includes(routeName)
              ? {display: 'none'}
              : styles.tabBarStyle,
          };
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStackNavigation}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('Learn');
            }
          },
        })}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Learn';
          return {
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <>
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? COLORS.primary : COLORS.grey,
                    },
                  ]}>
                  Learn
                </Text>
              </>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={focused ? learnIconActive : learnIcon}
                style={styles.icon}
              />
            ),
            tabBarStyle: [
              'Lesson',
              'Courses',
              'Profile',
              'MyAccount',
              'LessonDetail',
            ].includes(routeName)
              ? {display: 'none'}
              : styles.tabBarStyle,
          };
        }}
      />
      <Tab.Screen
        name="BLOGS_TAB"
        component={showSellerTab ? ProductsStackNavigation : ComingSoon}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('BLOGS_TAB');
            }
          },
        })}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? COLORS.primary : COLORS.grey,
                  },
                ]}>
                {showSellerTab ? 'Marketplace' : "What's New"}
              </Text>
            </>
          ),
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? blogsIconActive : blogsIcon}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CHATS_TAB"
        // component={ChatStackNavigation}
        component={ComingSoon}
        listeners={({navigation}) => ({
          tabPress: e => {
            const isAlreadyFocused = navigation.isFocused();
            if (isAlreadyFocused) {
              scrollToTop('CHATS_TAB');
            }
          },
        })}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? COLORS.primary : COLORS.grey,
                  },
                ]}>
                Messages
              </Text>
            </>
          ),
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? chatsIconActive : chatsIcon}
              style={[styles.icon, styles.resizeIcon]}
            />
          ),
        }}
      />
      {showSellerTab ? (
        <Tab.Screen
          name="SELLER_TAB"
          component={DashboardStackNavigation}
          listeners={({navigation}) => ({
            tabPress: () => {
              const isAlreadyFocused = navigation.isFocused();
              if (isAlreadyFocused) {
                scrollToTop('DASHBOARD_TAB');
              }
            },
          })}
          options={({route}) => {
            const routeName = getFocusedRouteNameFromRoute(route);
            return {
              headerShown: false,
              tabBarLabel: ({focused}) => (
                <>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: focused ? COLORS.primary : COLORS.grey,
                      },
                    ]}>
                    Seller
                  </Text>
                </>
              ),
              tabBarIcon: ({focused}) => (
                <Image
                  source={focused ? homeIconActive : homeIcon}
                  style={styles.icon}
                />
              ),
              tabBarStyle: ['Profile', 'MyAccount'].includes(routeName)
                ? {display: 'none'}
                : styles.tabBarStyle,
            };
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const {onBoarded} = useOnboarding();
  const {user, loggedIn} = userContext();
  const [checkingFarmerSetup, setCheckingFarmerSetup] = useState(false);
  const [farmerOnboardingCompleted, setFarmerOnboardingCompleted] =
    useState(true);
  const normalizedRole =
    (user?.accountType || user?.profile?.professionType || '')
      .toLowerCase?.() || '';
  const isSellerRole =
    normalizedRole === 'vendor' ||
    normalizedRole === 'farmer' ||
    normalizedRole === 'technician';
  const isFarmerRole = normalizedRole === 'farmer';
  const rootFlowView = resolveRootFlowView({
    onBoarded,
    loggedIn,
    normalizedRole,
    farmerOnboardingCompleted,
  });

  useEffect(() => {
    let cancelled = false;

    if (!loggedIn || !isFarmerRole) {
      setCheckingFarmerSetup(false);
      setFarmerOnboardingCompleted(true);
      return;
    }

    setCheckingFarmerSetup(true);
    getUserPreferences()
      .then(result => {
        if (!cancelled) {
          setFarmerOnboardingCompleted(
            Boolean(result?.farmerOnboarding?.completed),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFarmerOnboardingCompleted(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingFarmerSetup(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isFarmerRole, loggedIn]);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <NavigationContainer ref={navigationRef}>
        {checkingFarmerSetup ? <Loading visible /> : null}
        {rootFlowView === 'ONBOARDING' ? <OnboardingStackScreenNavigation /> : null}
        {rootFlowView === 'AUTH' ? <AuthStackScreenNavigation /> : null}
        {rootFlowView === 'FARMER_SETUP' ? (
          <FarmerOnboardingScreen
            onCompleted={() => setFarmerOnboardingCompleted(true)}
          />
        ) : null}
        {rootFlowView === 'FARMER_TABS' ? (
          <BottomTabNavigation
            showSellerTab
            initialRouteName={resolveCustomerBottomTabInitialRoute(
              rootFlowView,
            )}
          />
        ) : null}
        {rootFlowView === 'SELLER_TABS' ? <VendorBottomTabNavigation /> : null}
        {rootFlowView === 'CUSTOMER_TABS' ? <BottomTabNavigation /> : null}
      </NavigationContainer>
    </>
  );
};

const Root: React.FC = () => {
  const dispatch = useDispatch();
  const authToken = useAppSelector(state => state.auth.authToken);
  useEffect(() => {
    if (!authToken) {
      AsyncStorage.getItem('authToken')
        .then(token => {
          console.log('saving auth token', token);
          dispatch(authActions.saveAuthToken({authToken: token}));
        })
        .catch(console.log);
    }
  }, [authToken]);
  return (
    <ScrollProvider>
      <OnboardingProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </OnboardingProvider>
    </ScrollProvider>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: Platform.select({
      ios: normalize(14),
      android: normalize(4),
    }),
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderRadius: 30,
    height: normalize(65),
    position: 'absolute',
    bottom: normalize(15),
    borderTopColor: COLORS.white,
    // alignItems: 'center',
  },
  tabBarItemStyle: {
    // backgroundColor: 'blue',
    // top: Platform.select({
    //   ios: normalize(4),
    //   android: normalize(-18),
    // }),
  },
  icon: {
    width: 21,
    height: 21,
    // marginTop: Platform.select({
    //   ios: normalize(0),
    //   android: normalize(30),
    // }),
    resizeMode: 'contain',
  },
  resizeIcon: {
    width: 24,
    height: 24,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.grey,
    // top: 14,
  },
});

export default Root;
