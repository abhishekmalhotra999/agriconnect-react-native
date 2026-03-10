import { useEffect } from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useStatusBarStyle = (
  styleOnBlur: StatusBarStyle = 'light-content',
  styleOnFocus: StatusBarStyle = 'dark-content'
): void => {
  const navigation = useNavigation();

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      StatusBar.setBarStyle(styleOnFocus, true);
    });

    const blurListener = navigation.addListener('blur', () => {
      StatusBar.setBarStyle(styleOnBlur, true);
    });

    // Clean up the listeners on unmount
    return () => {
      focusListener();
      blurListener();
    };
  }, [navigation, styleOnFocus, styleOnBlur]);
};

export default useStatusBarStyle;
