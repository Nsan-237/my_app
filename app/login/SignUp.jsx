import React, { useState } from 'react'
import { Text, View, StyleSheet, TextInput,Touchable, TouchableOpacity, ToastAndroid } from 'react-native';
import Colors from '../../constant/Colors';
import { SetStateAction } from 'react';
import {Router, useRouter} from "expo-router"
import {auth} from "../../config/FirebaseConfig"
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword, getAuth, updatePassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { setLocalStorage } from '@/service/Storage';


export default function SignUp() {

      const router = useRouter();

      const [email,setEmail]= useState();
      const [password,setPassword]= useState();

      const OncreateAccount=()=>{
      const [useNmae,setUserName]=useState()

      }
        if(!email||!password||!userName){
          ToastAndroid.show("Please fill all details",ToastAndroid.BOTTOM)
          Alert.alert("Please enter email and password") //it is for Ios Phones
        }
      createUserWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        // Signed up 
        const user = userCredential.user;
    
        await updateProfile(user,{
          displayName:userName
        })
                  
        await setLocalStorage("userDetail",user)

        router.push("(tabs)")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if(errorCode=="auth/email-already-in-use"){
          ToastAndroid.show("Email already exist",ToastAndroid.BOTTOM)
          Alert.alert("Email already exist")
        }
        // ..
      });
      
  
    return (
        <View style={
          {
              padding:25         
          }
        }>
          <Text style={styles.textHeader}> Create New Account </Text>

        <View style={{
              marginTop:25
        }}>
          <Text>Full Name</Text>
          <TextInput placeholder="Enter your Full Name" style={styles.TextInput}/>
        </View>

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
        onPress={OncreateAccount}
        >
          <Text style={{
              fontSize:17,
              color:"white",
              textAlign:"center"
          }} 
          >Create Account </Text>
        </TouchableOpacity>
        
           <TouchableOpacity style={styles?.buttonCreate}
           onPress={() => router.push("/login/signIn")}
           >
          <Text style={{
              fontSize:17,
              color:Colors.PRIMARY,
              textAlign:"center"
          }} 
          >Already account? Sign In</Text>
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