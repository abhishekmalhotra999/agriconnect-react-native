import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';

interface NotificationItemProps {
  avatar: string;
  name: string;
  message: string;
  time: string;
  isNew?: boolean;  // Optional: Highlight if the notification is new
  actions?: { text: string; onPress: () => void }[];  // Optional: Action buttons
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  avatar,
  name,
  message,
  time,
  isNew,
  actions,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* @ts-ignore */}
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.message}>
            <Text style={styles.name}>{name}</Text> {message}
          </Text>
          {actions && (
            <View style={styles.actionContainer}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.actionButton, action.text === 'Approve' && styles.highlight]}
                  onPress={action.onPress}
                >
                  <Text style={[styles.actionText, action.text === 'Approve' && styles.highlightText]}>{action.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  newNotification: {
    // backgroundColor: '#FEF6E6',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.darkText,
  },
  name: {
    fontFamily: FONTS.semiBold,
    color: COLORS.eerieBlack,
  },
  time: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.grey,
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  actionText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.eerieBlack,
  },
  highlight: {
    backgroundColor: COLORS.primary,
  },
  highlightText: {
    color: COLORS.white,
  },
});

export default NotificationItem;