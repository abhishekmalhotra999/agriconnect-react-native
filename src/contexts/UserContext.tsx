import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../models/user';
import Loading from '../components/UI/Loading';
import {useAppDispatch} from '../store/storage';
import {authActions} from '../store/slices/auth.slice';

interface UserContextType {
  user: User | null;
  loggedIn: boolean;
  login: (user: User | {user: User}) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const checkLoginStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const normalizedUser = parsedUser?.user || parsedUser;

        setUser(normalizedUser);
        dispatch(authActions.saveUserDetail(normalizedUser));
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // AsyncStorage.removeItem('user');
    checkLoginStatus();
  }, []);

  const login = (userData: User | {user: User}) => {
    setLoading(true);
    setTimeout(() => {
      const normalizedUser = (userData as {user?: User})?.user ||
        (userData as User);

      setUser(normalizedUser);
      setLoggedIn(true);
      AsyncStorage.setItem('user', JSON.stringify(normalizedUser));
      setLoading(false);
    }, 100);
  };

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setLoggedIn(false);
      AsyncStorage.removeItem('user');
      setLoading(false);
    }, 100);
  };

  if (loading) {
    return <Loading visible={loading} />;
  }

  return (
    <UserContext.Provider value={{user, loggedIn, login, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export const userContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('user context must be used within a App provider');
  }
  return context;
};
