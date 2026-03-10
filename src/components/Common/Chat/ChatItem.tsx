import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Chat } from '../../../models/chat';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';

interface ChatItemProps {
  item: Chat;
  onChatPress: (chatId: number) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ item, onChatPress }) => {
  return (
    <TouchableOpacity style={[styles.chatItem, item.unreadCount > 0 && styles.chatHighlighted]} onPress={() => onChatPress(item.id)}>
      <View style={styles.avatarWrapper}>
        {/*// @ts-ignore`} */}
        <Image source={item.avatar} style={styles.avatar} />
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.status === 'online' ? 'green' : 'gray' },
          ]}
        />
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
      <View style={styles.chatMeta}>
        <Text style={styles.chatTime}>{item.time}</Text>
        {item.unreadCount > 0 ? (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.darkText,
  },
  chatMessage: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.grey,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  unreadText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.white,
  },
  chatHighlighted: {
    backgroundColor: COLORS.primaryLight,
  }
});

export default ChatItem;