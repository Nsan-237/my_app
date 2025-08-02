import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
    return (
      <Tabs screenOptions={{
        headerShown:false
      }}>
        <Tabs.Screen name='index' 
        options={{
            tabBarlable:"Home",
            tabBarIcon:({color,size})=>(
                <FontAwesome name="home" size={size} color={color} />
            )
            }}/>
        <Tabs.Screen name='AddNew' 
        options={{
            tabBarlable:"AddNew",
            tabBarIcon:({color,size})=>(
                <FontAwesome name="plus-square" size={size} color="black" />
            )
            }}/>
        <Tabs.Screen name='Profile' 
        options={{
            tabBarlable:"Profile",
            tabBarIcon:({color,size})=>(
                <FontAwesome name="user" size={size} color={color} />
            )
            }}/>
      </Tabs>
    )
  }
