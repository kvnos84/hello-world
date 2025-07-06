// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { db } from './firebase'; // Make sure this is correct

// Screens
import StartScreen from './StartScreen';
import ChatScreen from './ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen 
          name="StartScreen" 
          component={StartScreen} 
          options={{ title: 'Welcome' }} 
        />
        <Stack.Screen name="ChatScreen">
          {props => <ChatScreen {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}