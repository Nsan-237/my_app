import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import Colors from '../../constant/Colors';
import { useRouter } from "expo-router";
import { setLocalStorage } from '@/service/Storage';

export default function SignUp() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};

    if (!userName) tempErrors.userName = "Full name is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Invalid email format";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const OnCreateAccount = async () => {
    if (!validateForm()) {
      ToastAndroid.show("Please fix form errors", ToastAndroid.SHORT);
      return;
    }

    try {
      // 🔹 Replace this with your own API call
      const response = await fetch("https://your-api.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Save user locally
      await setLocalStorage("userDetail", data.user);

      // Navigate to OTP (or Tabs directly if no OTP system)
      router.push({
        pathname: "/otp",
        params: { email, type: "signup" }
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ padding: 25 }}>
      <Text style={styles.textHeader}>Create New Account</Text>

      <View style={{ marginTop: 25 }}>
        <Text>Full Name</Text>
        <TextInput
          placeholder="Enter your Full Name"
          style={styles.TextInput}
          value={userName}
          onChangeText={setUserName}
        />
        {errors.userName && <Text style={styles.error}>{errors.userName}</Text>}
      </View>

      <View style={{ marginTop: 25 }}>
        <Text>Email</Text>
        <TextInput
          placeholder="Enter your Email"
          style={styles.TextInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </View>

      <View style={{ marginTop: 25 }}>
        <Text>Password</Text>
        <TextInput
          placeholder="Enter your Password"
          secureTextEntry
          style={styles.TextInput}
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={OnCreateAccount}>
        <Text style={{ fontSize: 17, color: "white", textAlign: "center" }}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCreate} onPress={() => router.push("/(auth)/signIn")}>
        <Text style={{ fontSize: 17, color: Colors.PRIMARY, textAlign: "center" }}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textHeader: { fontSize: 30, fontWeight: "bold", marginTop: 15 },
  TextInput: { padding: 10, borderWidth: 1, fontSize: 17, borderRadius: 10, marginTop: 5, backgroundColor: "white" },
  button: { padding: 20, backgroundColor: Colors.PRIMARY, borderRadius: 10, marginTop: 35 },
  buttonCreate: { padding: 20, backgroundColor: "white", borderRadius: 10, marginTop: 20, borderWidth: 1, borderColor: Colors.PRIMARY },
  error: { color: "red", fontSize: 14, marginTop: 4 }
});
