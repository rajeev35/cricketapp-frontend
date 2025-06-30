import React from 'react';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './src/context/AuthContext';

// 👉 import your screens *directly*:
import LoginScreen          from './src/screens/auth/LoginScreen';
import RegisterScreen       from './src/screens/auth/RegisterScreen';
import HomeScreen           from './src/screens/home/HomeScreen';
import CreateMatchScreen    from './src/screens/home/CreateMatchScreen';
import PhoneOtpScreen     from './src/screens/auth/PhoneOtpScreen';
import ProfileScreen from './src/screens/home/ProfileScreen';

axios.defaults.baseURL = 'http://10.0.2.2:5000'; // emulator

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) return null; // or a splash

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token == null ? (
        <>
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="PhoneOtp"  component={PhoneOtpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home"        component={HomeScreen} />
          <Stack.Screen name="CreateMatch" component={CreateMatchScreen} />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile', headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
