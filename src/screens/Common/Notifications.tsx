import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  RefreshControl,
  ImageSourcePropType,
} from 'react-native';
import {InAppNotificationsScreenProps} from '../../navigation/types';
import NotificationList from '../../components/Common/Notification/NotificationList';
import {
  chatUser1,
  chatUser2,
  chatUser3,
  chatUser4,
  chatUser5,
} from '../../constants/images';
import Header from '../../containers/header';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import useStatusBarStyle from '../../hooks/useStatusBarStyle';
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  UserNotification,
} from '../../api/preferences.api';

type UINotification = {
  id: string;
  avatar: ImageSourcePropType;
  name: string;
  message: string;
  time: string;
  isNew: boolean;
};

const avatarPool: ImageSourcePropType[] = [
  chatUser1,
  chatUser2,
  chatUser3,
  chatUser4,
  chatUser5,
];

const formatNotificationTime = (value?: string | number) => {
  if (!value) {
    return 'Just now';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const toUiNotification = (
  notification: UserNotification,
  index: number,
): UINotification => {
  const title = notification.title?.trim() || 'AgriConnect Update';
  const message =
    notification.message?.trim() ||
    notification.body?.trim() ||
    notification.text?.trim() ||
    'You have a new update from AgriConnect.';

  return {
    id: String(notification.id || `${index}-${title}`),
    avatar: avatarPool[index % avatarPool.length],
    name: title,
    message,
    time: formatNotificationTime(notification.createdAt || notification.timestamp),
    isNew: !(notification.read || notification.isRead),
  };
};

const Notifications: React.FC<InAppNotificationsScreenProps> = () => {
  useStatusBarStyle('light-content', 'dark-content');
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [rawNotifications, setRawNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadNotifications = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) {
      setLoading(true);
    }

    setErrorMessage(null);
    try {
      const serverNotifications = await getUserNotifications();
      const sorted = [...serverNotifications].sort((a, b) => {
        const first = new Date(a.createdAt || a.timestamp || 0).getTime();
        const second = new Date(b.createdAt || b.timestamp || 0).getTime();
        return second - first;
      });

      setRawNotifications(sorted);
      setNotifications(sorted.map(toUiNotification));

      const hasUnread = sorted.some(item => !(item.read || item.isRead));
      if (hasUnread) {
        await markAllNotificationsAsRead(sorted);
      }
    } catch (error) {
      setErrorMessage('Unable to load notifications right now. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(true);
  }, [loadNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications(false);
  }, [loadNotifications]);

  const unreadCount = useMemo(
    () => rawNotifications.filter(item => !(item.read || item.isRead)).length,
    [rawNotifications],
  );

  return (
    <View style={styles.container}>
      <Header goBack={true} title="Notifications" />
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>In-App Notifications</Text>
        <Text style={styles.summarySubTitle}>
          Admin announcements and activity updates are delivered here.
        </Text>
        <Text style={styles.summaryMeta}>
          {notifications.length} total • {unreadCount} unread
        </Text>
      </View>

      {loading ? (
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>Loading notifications...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>{errorMessage}</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>No notifications yet</Text>
          <Text style={styles.stateSubTitle}>
            When admins publish announcements, they will appear here.
          </Text>
        </View>
      ) : (
        <NotificationList
          notifications={notifications}
          // Keep pull-to-refresh available for near real-time admin announcements.
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
  },
  summaryTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.eerieBlack,
  },
  summarySubTitle: {
    marginTop: 4,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
  summaryMeta: {
    marginTop: 6,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.heading,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -30,
  },
  stateTitle: {
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.eerieBlack,
  },
  stateSubTitle: {
    textAlign: 'center',
    marginTop: 6,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
});

export default Notifications;
