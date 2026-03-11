import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from '../models/Product';
import { Category } from '../models/category';
import { Order } from '../models/order';
import { User } from '../models/user';

// { [key: string]: string | number; };
export type CustomerStackParamList = {
  OnBoarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Otp: { user: User };
  PersonalDetail: undefined;
  FirmDetail: {
    accountType: string;
    personalDetails?: {
      email: string;
      address: string;
      password: string;
      confirmPassword: string;
      phone: string;
      name: string;
      professionType: string;
    };
  };
  Home: {
    registerScrollRef: (ref: React.RefObject<ScrollView>) => void;
  };
  Learn: undefined;
  Courses: undefined;
  Blogs: undefined;
  Chats: undefined;
  ChatRoom: { chatId: number };
  Profile: undefined;
  MyAccount: undefined;
  InAppNotifications: undefined;
  Cart: undefined;
  Products: undefined;
  ProductDetails: { product: Product };
  Services: undefined;
  ServiceDetails: { product: Product };
  MyServiceRequests: undefined;
  ServiceRequestDetails: { order: Order };
};

export type VendorStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  OrderDetails: { order: Order };
  MyProducts: undefined;
  MyProductDetails: { product: Product };
  ManageMyProduct: { product?: Product };
}

// Auth navigation props
export type OnBoardingScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'OnBoarding'>;
export type WelcomeScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Welcome'>;
export type SignupScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Signup'>;
export type LoginScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Login'>;
export type OtpScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Otp'>;
export type PersonalDetailScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'PersonalDetail'>;
export type FirmDetailScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'FirmDetail'>;

// Vendor Route props //
export type DashboardScreenNavigationProp = StackNavigationProp<VendorStackParamList, 'Dashboard'>;
export type OrdersScreenNavigationProp = StackNavigationProp<VendorStackParamList, 'Orders'>;
export type OrderDetailsScreenNavigationProp = StackNavigationProp<VendorStackParamList, 'OrderDetails'>;
export type MyProductsScreenNavigationProp = StackNavigationProp<VendorStackParamList, 'MyProducts'>;
export type MyProductDetailsScreenNavigationProp = StackNavigationProp<VendorStackParamList, 'MyProductDetails'>;
export type ManageMyProductScreenNavigationProp = StackNavigationProp<VendorStackParamList, 'ManageMyProduct'>;


// Customer navigation props
export type HomeScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Home'>;
export type LearnScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Learn'>;
export type CoursesScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Courses'>;
export type BlogsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Blogs'>;
export type ChatsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Chats'>;
export type ChatRoomScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'ChatRoom'>;
export type ProfileScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Profile'>;
export type MyAccountScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'MyAccount'>;
export type CartScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Cart'>;
export type InAppNotificationsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'InAppNotifications'>;
export type ProductsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Products'>;
export type ProductDetailsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'ProductDetails'>;
export type ServicesScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Services'>;
export type ServiceDetailsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'ServiceDetails'>;
export type MyServiceRequestsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'MyServiceRequests'>;
export type ServiceRequestDetailsScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'ServiceRequestDetails'>;


// Auth route props
export type OnBoardingScreenRouteProp = RouteProp<CustomerStackParamList, 'OnBoarding'>;
export type WelcomeScreenRouteProp = RouteProp<CustomerStackParamList, 'Welcome'>;
export type SignupScreenRouteProp = RouteProp<CustomerStackParamList, 'Signup'>;
export type LoginScreenRouteProp = RouteProp<CustomerStackParamList, 'Login'>;
export type OtpScreenRouteProp = RouteProp<CustomerStackParamList, 'Otp'>;
export type PersonalDetailScreenRouteProp = RouteProp<CustomerStackParamList, 'PersonalDetail'>;
export type FirmDetailScreenRouteProp = RouteProp<CustomerStackParamList, 'FirmDetail'>;

// Vendor Route props //
export type DashboardScreenRouteProp = RouteProp<VendorStackParamList, 'Dashboard'>;
export type OrdersScreenRouteProp = RouteProp<VendorStackParamList, 'Orders'>;
export type OrderDetailsScreenRouteProp = RouteProp<VendorStackParamList, 'OrderDetails'>;
export type MyProductsScreenRouteProp = RouteProp<VendorStackParamList, 'MyProducts'>;
export type MyProductDetailsScreenRouteProp = RouteProp<VendorStackParamList, 'MyProductDetails'>;
export type ManageMyProductScreenRouteProp = RouteProp<VendorStackParamList, 'ManageMyProduct'>;

// Customer route props
export type HomeScreenRouteProp = RouteProp<CustomerStackParamList, 'Home'>;
export type LearnScreenRouteProp = RouteProp<CustomerStackParamList, 'Learn'>;
export type CoursesScreenRouteProp = RouteProp<CustomerStackParamList, 'Courses'>;
export type BlogsScreenRouteProp = RouteProp<CustomerStackParamList, 'Blogs'>;
export type ChatsScreenRouteProp = RouteProp<CustomerStackParamList, 'Chats'>;
export type ChatRoomScreenRouteProp = RouteProp<CustomerStackParamList, 'ChatRoom'>;
export type ProfileScreenRouteProp = RouteProp<CustomerStackParamList, 'Profile'>;
export type MyAccountScreenRouteProp = RouteProp<CustomerStackParamList, 'MyAccount'>;
export type CartScreenRouteProp = RouteProp<CustomerStackParamList, 'Cart'>;
export type InAppNotificationsScreenRouteProp = RouteProp<CustomerStackParamList, 'InAppNotifications'>;
export type ProductsScreenRouteProp = RouteProp<CustomerStackParamList, 'Products'>;
export type ProductDetailsScreenRouteProp = RouteProp<CustomerStackParamList, 'ProductDetails'>;
export type ServicesScreenRouteProp = RouteProp<CustomerStackParamList, 'Services'>;
export type ServiceDetailsScreenRouteProp = RouteProp<CustomerStackParamList, 'ServiceDetails'>;
export type MyServiceRequestsScreenRouteProp = RouteProp<CustomerStackParamList, 'MyServiceRequests'>;
export type ServiceRequestDetailsScreenRouteProp = RouteProp<CustomerStackParamList, 'ServiceRequestDetails'>;

// ############ Auth ############## //
export interface OnBoardingScreenProps {
  navigation: OnBoardingScreenNavigationProp;
  route: OnBoardingScreenRouteProp;
}

export interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
  route: WelcomeScreenRouteProp;
}

export interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
}

export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

export interface OtpScreenProps {
  navigation: OtpScreenNavigationProp;
  route: OtpScreenRouteProp;
}

export interface PersonalDetailScreenProps {
  navigation: PersonalDetailScreenNavigationProp;
  route: PersonalDetailScreenRouteProp;
}

export interface FirmDetailScreenProps {
  navigation: FirmDetailScreenNavigationProp;
  route: FirmDetailScreenRouteProp;
}

// ############ Vendor ############## //
export interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
  route: DashboardScreenRouteProp;
}

export interface OrdersScreenProps {
  navigation: OrdersScreenNavigationProp;
  route: OrdersScreenRouteProp;
}

export interface OrderDetailsScreenProps {
  navigation: OrderDetailsScreenNavigationProp;
  route: OrderDetailsScreenRouteProp;
}

export interface MyProductsScreenProps {
  navigation: MyProductsScreenNavigationProp;
  route: MyProductsScreenRouteProp;
}

export interface MyProductDetailsScreenProps {
  navigation: MyProductDetailsScreenNavigationProp;
  route: MyProductDetailsScreenRouteProp;
}

export interface ManageMyProductScreenProps {
  navigation: ManageMyProductScreenNavigationProp;
  route: ManageMyProductScreenRouteProp;
}

// ############ Customer ############## //
export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

export interface LearnScreenProps {
  navigation: LearnScreenNavigationProp;
  route: LearnScreenRouteProp;
}

export interface CoursesScreenProps {
  navigation: CoursesScreenNavigationProp;
  route: CoursesScreenRouteProp;
}

export interface BlogsScreenProps {
  navigation: BlogsScreenNavigationProp;
  route: BlogsScreenRouteProp;
}

export interface ChatsScreenProps {
  navigation: ChatsScreenNavigationProp;
  route: ChatsScreenRouteProp;
}

export interface ChatRoomScreenProps {
  navigation: ChatRoomScreenNavigationProp;
  route: ChatRoomScreenRouteProp;
}

export interface ProductsScreenProps {
  navigation: ProductsScreenNavigationProp;
  route: ProductsScreenRouteProp;
}

export interface ProductDetailsScreenProps {
  navigation: ProductDetailsScreenNavigationProp;
  route: ProductDetailsScreenRouteProp;
}

export interface ServicesScreenProps {
  navigation: ServicesScreenNavigationProp;
  route: ServicesScreenRouteProp;
}

export interface ServiceDetailsScreenProps {
  navigation: ServiceDetailsScreenNavigationProp;
  route: ServiceDetailsScreenRouteProp;
}

export interface MyServiceRequestsScreenProps {
  navigation: MyServiceRequestsScreenNavigationProp;
  route: MyServiceRequestsScreenRouteProp;
}

export interface ServiceRequestDetailsScreenProps {
  navigation: ServiceRequestDetailsScreenNavigationProp;
  route: ServiceRequestDetailsScreenRouteProp;
}

export interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

export interface MyAccountScreenProps {
  navigation: MyAccountScreenNavigationProp;
  route: MyAccountScreenRouteProp;
}

export interface CartScreenProps {
  navigation: CartScreenNavigationProp;
  route: CartScreenRouteProp;
}

export interface InAppNotificationsScreenProps {
  navigation: InAppNotificationsScreenNavigationProp;
  route: InAppNotificationsScreenRouteProp;
}

// Others //
export interface HeaderProps {
  title: string;
  onPress?: () => void;
  goBack?: boolean;
}

export interface ProductProviderProps {
  children: ReactNode;
  initialProducts: Product[];
}

export interface ProductCategoryProviderProps {
  children: ReactNode;
  initialProductCategories: Category[];
}