import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { ChatRoomScreenProps } from '../../../navigation/types';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import { attachIcon, chatUser1, chatUser2, emojiIcon, sendBtnIcon } from '../../../constants/images';
import { bottomInsets, normalize } from '../../../utils/util';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import FastImage from '@d11/react-native-fast-image';
import Input from '../../../components/UI/Input';
import ChatHeader from '../../../components/Common/Chat/ChatHeader';

type Message = {
  id: string;
  text?: string;
  avatar: string;
  images?: string[];
  sender: string;
  sentAt: Date;
};

const ChatRoom: React.FC<ChatRoomScreenProps> = ({ navigation, route }) => {
  const { chatId } = route.params;

  // const [ws, setWs] = useState<WebSocket | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', avatar: chatUser1, text: 'the scenic town of calgary, filled with majestic mountains and outdoor recreation, were wonderfully exhilarating during the relaxing and leisurely vacation', images: [], sender: 'Mike Mazowski', sentAt: new Date() },
    { id: '2', avatar: chatUser1, text: 'Sleeping :D', images: [], sender: 'me', sentAt: new Date() },
    { id: '3', avatar: chatUser2, text: 'What an Amazing trip it was! Enjoyed every moment, pleased to have had the time to enjoy self alone.', images: [], sender: 'You', sentAt: new Date() },
    { id: '4', avatar: chatUser2, text: 'Okay! Sounds great!', images: [], sender: 'You', sentAt: new Date() },
  ]);
  const [inputText, setInputText] = useState<string>('');

  const handleInputChange = (text: string) => {
    setInputText(text);

    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        setIsTyping(false);
      }, 1000)
    );
  };

  function sortMessagesByTime(messages: Message[]) {
    return [...messages].sort((a, b) => {
      if (!a.sentAt || !b.sentAt) return 0;
      return b.sentAt.getTime() - a.sentAt.getTime();
    });
  };

  const handleSend = () => {
    if (inputText.trim()) {
      // const msg = {
      //   command: 'message',
      //   identifier: JSON.stringify({
      //     id: '1',
      //     channel: 'ChatChannel',
      //     room: 'general',
      //   }),
      //   data: JSON.stringify({
      //     message: inputText,
      //     action: 'speak',
      //   }),
      // };
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: inputText, sender: 'You', avatar: chatUser2, sentAt: new Date() },
      ]);
      // ws.send(JSON.stringify(msg));
      setInputText('');
      setIsTyping(false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 });
    if (!result.didCancel && result.assets) {
      const imageUris = result.assets.map((asset) => asset.uri || '');
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), images: imageUris, sender: 'You', avatar: chatUser2, sentAt: new Date() },
      ]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === 'You' ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {item.text ? (
          <Text style={[styles.messageText, item.sender === 'You' && styles.textColor]}>{item.text}</Text>
        ) : null}

        {item.images && item.images.length > 0 ? (
          <View style={styles.imageGroup}>
            {item.images.map((uri, index) => (
              <FastImage key={index} source={{ uri }} style={styles.image} />
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  // useEffect(() => {
  //   // Connect to ActionCable WebSocket
  //   const webSocket = new WebSocket('ws://172.20.10.3:3000/cable');

  //   webSocket.onopen = () => {
  //     console.log('WebSocket connected');
  //     // Subscribe to a chat room (you can replace 'general' with a specific room)
  //     const msg = {
  //       command: 'subscribe',
  //       identifier: JSON.stringify({
  //         id: '1',
  //         channel: 'ChatChannel',
  //         room: 'general',
  //       }),
  //     };
  //     webSocket.send(JSON.stringify(msg));
  //   };

  //   webSocket.onmessage = (event) => {
  //     const response = JSON.parse(event.data);
  //     const messageData = response?.message;
  //     if (messageData) {
  //       const newMessage: Message = {
  //         id: Date.now().toString(),
  //         text: messageData.message,
  //         sender: 'You', 
  //         avatar: chatUser2, 
  //         sentAt: new Date()
  //       };
  //       // setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     }
  //   };

  //   webSocket.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   webSocket.onclose = () => {
  //     console.log('WebSocket disconnected');
  //   };

  //   setWs(webSocket);

  //   return () => {
  //     webSocket.close();
  //   };
  // }, []);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none'
      }
    });
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: styles.tabBarStyle
    });
  }, [navigation]);
  
  return (
    <View style={[styles.container, { paddingBottom: bottomInsets() }]}>
    <ChatHeader />
    <KeyboardAvoidingView style={{ flexGrow: 1 }} behavior="height">
      <FlatList
        data={sortMessagesByTime(messages)}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesWrapper}
        inverted
      />

      {isTyping && <Text style={styles.typingIndicator}>User is typing...</Text>}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          <Image source={attachIcon} style={styles.icon} />
        </TouchableOpacity>
        <Input
          style={styles.input}
          inputStyle={styles.inputStyle}
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Write a message"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Image source={sendBtnIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  tabBarStyle: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: Platform.select({
      ios: normalize(14),
      android: normalize(4),
    }),
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    height: normalize(65),
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
  },
  messagesWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '75%',
    borderRadius: 8,
    padding: 10,
  },
  myMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: COLORS.lightGrey,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONTS.regular,
    color: COLORS.eerieBlack,
  },
  textColor: {
    color: COLORS.white,
  },
  imageGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    height: 40,
  },
  inputStyle: {
    paddingLeft: normalize(50),
    paddingBottom: Platform.select({
      ios: normalize(5),
      android: normalize(20),
    }),
    color: COLORS.eerieBlack,
  },
  imagePicker: {
    position: 'absolute',
    bottom: normalize(15),
    left: normalize(20),
    zIndex: 1,
  },
  sendButton: {
    backgroundColor: '#FF9800',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  typingIndicator: {
    textAlign: 'left',
    fontStyle: 'italic',
    color: '#888',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
});

export default ChatRoom;