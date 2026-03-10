import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ChatsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { COLORS } from '../../../themes/styles';
import { headerHeight, normalize } from '../../../utils/util';
import Filters from '../../../components/UI/Filters';
import SearchBar from '../../../components/UI/SearchBar';
import { Chat } from '../../../models/chat';
import ChatList from '../../../components/Common/Chat/ChatList';
import { useScrollContext } from '../../../contexts/ScrollContext';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import {
  chatUser1, 
  chatUser2, 
  chatUser3, 
  chatUser4, 
  chatUser5 
} from '../../../constants/images';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';

const chats: Chat[] = [
  { id: 1, name: 'Darlene Steward', message: 'Hey', time: '18:31', unreadCount: 5, avatar: chatUser1, status: 'offline' },
  { id: 2, name: 'Local Farmers', message: 'This works', time: '16:04', unreadCount: 0, avatar: chatUser2, status: 'offline' },
  { id: 3, name: 'Lee Williamson', message: 'Alright', time: '06:12', unreadCount: 1, avatar: chatUser3, status: 'online' },
  { id: 4, name: 'Ronald Mccoy', message: 'See you soon', time: 'Yesterday', unreadCount: 0, avatar: chatUser4, status: 'offline' },
  { id: 5, name: 'Albert Bell', message: 'Bye', time: 'Yesterday', unreadCount: 0, avatar: chatUser5, status: 'offline' },
  { id: 6, name: 'Darlene Steward', message: 'Hey', time: '18:31', unreadCount: 0, avatar: chatUser1, status: 'offline' },
  { id: 7, name: 'Local Farmers', message: 'This works', time: '16:04', unreadCount: 0, avatar: chatUser2, status: 'offline' },
  { id: 8, name: 'Lee Williamson', message: 'Alright', time: '06:12', unreadCount: 0, avatar: chatUser3, status: 'online' },
  { id: 9, name: 'Ronald Mccoy', message: 'See you soon', time: 'Yesterday', unreadCount: 0, avatar: chatUser4, status: 'offline' },
  { id: 10, name: 'Albert Bell', message: 'Bye', time: 'Yesterday', unreadCount: 0, avatar: chatUser5, status: 'offline' },
];

const options = ['All chats', 'Read', 'Unread'];

const Chats: React.FC<ChatsScreenProps> = ({ navigation }) => {
  useStatusBarStyle('light-content', 'dark-content');
  const [activeFilter, setActiveFilter] = useState('All chats');
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();

  const onPress = (chatId: number) => {
    navigation.navigate('ChatRoom', { chatId })
  }

  useEffect(() => {
    registerScrollRef('Chats', scrollViewRef);
  }, [registerScrollRef]);

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView 
        ref={scrollViewRef}
        headerHeight={headerHeight()}
        headerContent={(
          <SearchBar placeholder="Find Chats" />
        )}
      >
        <Filters
          options={options}
          itemStyle={styles.filterStyle}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <ChatList chats={chats} onPress={onPress} />
      </AnimatedHeaderScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchBarContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  filterStyle: {
    flex: 1,
    borderRadius: 5,
    marginBottom: normalize(5),
    paddingHorizontal: normalize(10),
    elevation: 8,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 0,
  }
});

export default Chats;