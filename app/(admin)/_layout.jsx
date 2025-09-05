// Home page
import React, { Component, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Tabs, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useId } from 'react';
import { useState } from 'react';
import { getLocalStorage } from '@/service/Storage';

export default function TabLayout() {

       const router = useRouter();
       
       useEffect(()=>{
          // GetUserDetail()
       },[])
       const GetUserDetail=async()=>{
        const userInfo = await getLocalStorage ("userDetail")
        if(!userInfo){
          router.replace("(auth)")
        }
       }
   
    return (
      <Tabs screenOptions={{
        headerShown:false
      }}>
            <Tabs.Screen name="Home" 
        options={{
            tabBarlable:"index",
            tabBarIcon:({color,size})=>(
                <FontAwesome name="home" size={size} color={color} />
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
