import React, { Component } from 'react'
import { Text, View } from 'react-native'


export default function HomeScreen() {
    return (
      <View>
        <Text> Home Screen </Text>
        <Redirect href={"login"} />  
      </View>
    )
  }
