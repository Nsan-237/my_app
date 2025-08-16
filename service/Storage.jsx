import AsyncStorage from "@react-native-async-storage/async-storage"
import { KeyboardEvent } from "react-native"
export const setLocalStorage=async(KeyboardEvent,value)=>{
    await AsyncStorage.setItem(Key,JSON.stringify(value))
}

export const getLocalStorage=async(key)=>{
    const result=await AsyncStorage.getItem(key)
    return JSON.parse(result)
}

export const RemoveLocalStorage=async()=>{
    await AsyncStorage.clear()
}