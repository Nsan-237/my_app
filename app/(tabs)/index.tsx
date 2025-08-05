import React from 'react'
import { Text, View, Button } from 'react-native' // <-- Use Button from react-native
import { signOut } from 'firebase/auth'
import { auth } from '../../config/FirebaseConfig'
import { router } from 'expo-router' // If using expo-router

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.replace('/login') // or router.push('/login') depending on your flow
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}
