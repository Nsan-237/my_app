//Logout page
import React from 'react'
import { Text, View, Button } from 'react-native' // <-- Use Button from react-native
import { signOut } from 'firebase/auth'
import { auth } from '../../config/FirebaseConfig'
import { router } from 'expo-router' // If using expo-router
import  Header  from './../../components/Header'


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
    <View style={{
      padding:25,
      backgroundColor:"white",
      height:"100%"
    }}>
      <Button title="Logout" onPress={handleLogout} />
      <Header/>
    </View>
  )
}
