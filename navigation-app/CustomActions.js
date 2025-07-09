// CustomActions.js

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {
    ActionSheetIOS,
    Alert,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

export default function CustomActions({ onSend }) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required to access media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      onSend([
        {
          _id: Date.now(),
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'You',
          },
          image: base64Img,
        },
      ]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required to use the camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.3,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      onSend([
        {
          _id: Date.now(),
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'You',
          },
          image: base64Img,
        },
      ]);
    }
  };

  const sendLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required to access location.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      onSend([
        {
          _id: Date.now(),
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'You',
          },
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      ]);
    }
  };

  const onPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Choose from Library', 'Take Photo', 'Send Location', 'Cancel'],
          cancelButtonIndex: 3,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              await pickImage();
              break;
            case 1:
              await takePhoto();
              break;
            case 2:
              await sendLocation();
              break;
            default:
              break;
          }
        }
      );
    } else {
      Alert.alert('ActionSheet not implemented for Android yet.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Lets you send an image or share your location."
    >
      <Ionicons name="add" size={28} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom: 5,
  },
});