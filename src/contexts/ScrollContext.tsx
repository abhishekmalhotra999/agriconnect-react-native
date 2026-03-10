import React, { createContext, useContext, useRef } from 'react';
import { ScrollView } from 'react-native';

type ScrollContextType = {
  registerScrollRef: (tabName: string, ref: React.RefObject<ScrollView>) => void;
  scrollToTop: (tabName: string) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRefs = useRef<{ [key: string]: React.RefObject<ScrollView> }>({});

  const registerScrollRef = (tabName: string, ref: React.RefObject<ScrollView>) => {
    scrollRefs.current[tabName] = ref;
  };

  const scrollToTop = (tabName: string) => {
    const scrollRef = scrollRefs.current[tabName];
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <ScrollContext.Provider value={{ registerScrollRef, scrollToTop }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};