// Home page
import React, { Component, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Tabs, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './../../config/FirebaseConfig';
import { useId } from 'react';
import { useState } from 'react';
import { getLocalStorage } from '@/service/Storage';

export default function TabLayout() {

       const router = useRouter();
       
       useEffect(()=>{
          GetUserDetail()
       },[])

       const GetUserDetail=async()=>{
        const userInfo = await getLocalStorage ("userDetail")
        if(!userInfo){
          router.replace("/login")
        }
       }
   
    return (
      <Tabs screenOptions={{
        headerShown:false
      }}>
        <Tabs.Screen name="index" 
        options={{
            tabBarlable:"Home",
            tabBarIcon:({color,size})=>(
                <FontAwesome name="home" size={size} color={color} />
            )
            }}/>
        <Tabs.Screen name='SubscriptionPlan' 
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
