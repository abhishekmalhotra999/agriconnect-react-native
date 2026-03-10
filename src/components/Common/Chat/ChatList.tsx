import React from 'react';
import { StyleSheet } from 'react-native';
import ChatItem from './ChatItem';
import { Chat } from '../../../models/chat';
import { normalize } from '../../../utils/util';
import List from '../../UI/List';

interface ChatListProps {
  onPress: (chatId: number) => void;
  chats: Chat[];
}

const ChatList: React.FC<ChatListProps> = ({ chats, onPress }) => {
  return (
    <List
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={chats}
      renderItem={({ item }) => <ChatItem item={item} onChatPress={onPress} />}
      separatorStyle={{}}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(4),
  },
});

export default ChatList;