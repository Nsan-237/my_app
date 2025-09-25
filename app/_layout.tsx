// app/(login)/_layout.jsx
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

const Wrapper = () => {
  const {isAuthenticated} = useAuth();
  return (
    <Stack screenOptions={{
    headerShown: false
  }}>
    <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(onboardingScreen)" />
          <Stack.Screen name="(auth)" />
    </Stack.Protected>
    <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
    </Stack.Protected>
  </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Wrapper />
    </AuthProvider>
  )
}
