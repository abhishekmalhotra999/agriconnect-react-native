import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingContextData {
  onBoarded: boolean;
  completeOnBoarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextData | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [onBoarded, setOnBoarded] = useState<boolean>(false);

  useEffect(() => {
    const checkOnBoardingStatus = async () => {
      const isOnBoarded = await AsyncStorage.getItem('onBoarded');
      setOnBoarded(isOnBoarded === 'true');
    };

    // AsyncStorage.removeItem('onBoarded');
    checkOnBoardingStatus();
  }, []);

  const completeOnBoarding = async () => {
    await AsyncStorage.setItem('onBoarded', 'true');
    setOnBoarded(true);
  };

  return (
    <OnboardingContext.Provider value={{ onBoarded, completeOnBoarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};