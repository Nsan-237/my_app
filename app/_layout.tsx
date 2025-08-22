// app/(login)/_layout.jsx
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';


export default function RootLayout() {
  return (
  <Stack screenOptions={{
    headerShown: false
  }}>
    <Stack.Screen name="(onboardingScreen)" />
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(tabs)" />
  </Stack>
  )
}
