import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

function navigate(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    console.error('Navigation reference is not set.');
  }
}

function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  } else {
    console.error('Navigation reference is not set.');
  }
}

export default {
  navigate,
  goBack,
};