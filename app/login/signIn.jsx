import React from 'react'
import { Text, View, StyleSheet, TextInput,Touchable, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import {Router, useRouter} from "expo-router"
import { auth } from '@/config/FirebaseConfig';
import { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {setLocalStorage} from "./../../service/Storage"
import { Keyframe } from 'react-native-reanimated';
export default function SignIn()  {

     const router = useRouter();

     const [email,setEmail]= useState();
     const [password,setPassword]= useState();

    const OnSignInClick=()=>{

      if(!email||!password){
        ToastAndroid.show("Please fill all details",ToastAndroid.BOTTOM)
        Alert.alert("Please Enter email and password") //it is for Ios Phones
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
          const user = userCredential.user;
          console.log(user);
          setLocalStorage("userDetail",user)
          router.replace("/(tabs)")
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode=="auth/valid-credential"){
              Alert.alert("Invalid email or password")
            }
          });

    }
    return (
      <View style={
        {
            padding:25         
        }
      }>
        <Text style={styles.textHeader}> Let's Sign You In </Text>
        <Text style={styles.SubText}> Welcome Back </Text>
        <Text style={styles.SubText}> You've been missed </Text>
      <View style={{
            marginTop:25
      }}>
        <Text>Email</Text>
        <TextInput placeholder="Enter your Email" style={styles.TextInput}
        onChangeText={(value)=>setEmail(value)}
        />
      </View>

      <View style={{
            marginTop:25
      }}>
        <Text>Password</Text>
        <TextInput placeholder="Enter your Password" 
        secureTextEntry={true}
        style={styles.TextInput}
        onChangeText={(value)=>setPassword(value)}
        />
      </View>

      <TouchableOpacity style={styles?.button}
      onPress={OnSignInClick}
      >
        <Text style={{
            fontSize:17,
            color:"white",
            textAlign:"center"
        }} 
        >Login</Text>
      </TouchableOpacity>
      
         <TouchableOpacity style={styles?.buttonCreate}
         onPress={() => router.push("/login/SignUp")}
         >
        <Text style={{
            fontSize:17,
            color:Colors.PRIMARY,
            textAlign:"center"
        }} 
        >Create Account</Text>
      </TouchableOpacity>

      </View>
    )
  }


           
const styles = StyleSheet.create({
    textHeader:{
    fontSize:30,
    fontWeight:"bold",
    marginTop:15
    },
    SubText:{
    fontSize:30,
    fontWeight:"bold",
    marginTop:10,
    color:Colors.Gray
    },
    TextInput:{
        padding:10,
        borderWidth:1,
        fontSize:17,
        borderRadius:10,
        marginTop:5,
        backgroundColor:"white"
    },
    button:{
        padding:20,
        backgroundColor:Colors.PRIMARY,
        borderRadius:10,
        marginTop:35
    },
    buttonCreate:{
        padding:20,
        backgroundColor:"white",
        borderRadius:10,
        marginTop:20,
        borderWidth:1,
        borderColor:Colors.PRIMARY
    }
})