import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useIsOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('internet state', state);
      setIsOffline(!state.isConnected || !state.isInternetReachable);
    });
    return () => unsubscribe();
  }, []);

  return isOffline;
}
