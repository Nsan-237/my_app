import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthToken = async () =>  {
    // Implement your authentication logic here
    // This could be from AsyncStorage, secure storage, etc.
    const token  = await AsyncStorage.getItem('userToken');
    return token ?? "";
};

export const setLocalStorage = async (key:string, value:any) => {
    try {
        const jsonValue = JSON.stringify(value);
        console.log("user detail set:", jsonValue);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error("Error setting local storage:", error);
    }
}
export const getLocalStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('userDetail');
        if (jsonValue === null  || jsonValue === undefined) {
            console.log("No user detail found");
            return null;
        }
        const temVal =  JSON.parse(jsonValue);
        console.log("return user:", temVal);
        return temVal;
    } catch (error) {
        console.error("Error getting local storage:", error);
        return null;
    }
}