import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthToken = async () =>  {
    // Implement your authentication logic here
    // This could be from AsyncStorage, secure storage, etc.
    const token  = await AsyncStorage.getItem('authToken');
    return token ?? "";
};

export const setLocalStorage = async (key:string, value:any) => {
    try {
        const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error("Error setting local storage:", error);
    }
}