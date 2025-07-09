// ChatScreen.js

import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';

import CustomActions from './CustomActions';

import MapView, { Marker } from 'react-native-maps';

export default function ChatScreen({ route, db, isConnected }) {
  const { userID, name, bgColor } = route.params;

  const [messages, setMessages] = useState([]);

  // Save messages to AsyncStorage
  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(messagesToSave));
    } catch (error) {
      console.log('Error saving messages:', error);
    }
  };

  // Load messages from AsyncStorage
  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('chatMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.log('Error loading messages:', error);
    }
  };

  useEffect(() => {
    let unsubscribe;

    if (isConnected) {
      const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || '',
            createdAt: data.createdAt.toDate(),
            user: data.user,
            image: data.image || null,
          };
        });

        setMessages(newMessages);
        saveMessages(newMessages); // Save to AsyncStorage
      });
    } else {
      loadMessages(); // Load from AsyncStorage
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected]);

  const onSend = (newMessages = []) => {
    const message = newMessages[0];
    addDoc(collection(db, 'messages'), message);
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    saveMessages([message, ...messages]); // Save sent message offline
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { marginLeft: 4 },
        right: { marginRight: 4 },
      }}
    />
  );

  const renderCustomView = (props) => {
  const { currentMessage } = props;

  if (currentMessage.location) {
    return (
      <View style={{ borderRadius: 10, overflow: 'hidden', margin: 5 }}>
        <MapView
          style={{ width: 150, height: 100 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
            }}
          />
        </MapView>
      </View>
    );
  }

  if (currentMessage.image) {
    return (
      <View style={{ borderRadius: 10, overflow: 'hidden', margin: 5 }}>
        <Image
          source={{ uri: currentMessage.image }}
          style={{ width: 150, height: 100 }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return null;
};

  const renderActions = (props) => {
    return <CustomActions onSend={onSend} />;
  };

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 63 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: userID, name }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderActions={renderActions}
          renderCustomView={renderCustomView}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});