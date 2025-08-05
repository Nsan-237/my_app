import React, { Component, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Tabs, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './../../config/FirebaseConfig';
import { useId } from 'react';
import { useState } from 'react';

export default function TabLayout() {

       const router = useRouter();
       
       useEffect(()=>{
          GetUserDetail()
       },[])

       const GetUserDetail=async()=>{
        const userInfo = await getLocalStorage ("useDetail")
        if(!userInfo){
          rouuter.replace("/login")
        }
       }
       //For authentication
      //  const {authenticated,setAuthenticated}=useState(null);
        //if user login or not

        // onAuthStateChanged(auth, (user) => {
        // if (user) {
        //   // User is signed in, see docs for a list of available properties
        //   // https://firebase.google.com/docs/reference/js/auth.user
        //   const uid = user.uid;
        //   setAuthenticated(true)
        //   // ...
        // } else {
        //   console.log(uid)
        //   setAuthenticated(false)
        //   // User is signed out
        //   // ...
        // }
        // })

        // useEffect(() => {
        //   if(authenticated==false){
        //     router.push("/login")
        //   }
        // },[authenticated])

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
