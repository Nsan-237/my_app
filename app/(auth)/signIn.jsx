import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { HeaderShownContext } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import { setLocalStorage, getLocalStorage, removeLocalStorage } from "@/service/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fake user database
  const mockUsers = [
    { email: "user@example.com", password: "123456", name: "John Doe" },
    { email: "nsan@gmail.com", password: "123456", name: "nsan" },
    { email: "admin@example.com", password: "admin123", name: "Admin User" },
  ];

  // Save to AsyncStorage
  const setLocalStorage = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  // Form validation
  const validateForm = () => {
    let tempErrors = {};

    if (!email || email.trim() === "") tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      tempErrors.email = "Invalid email format";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle sign in
  const handleSignIn = async () => {
    if (!validateForm()) {
      ToastAndroid.show("Please fix the form errors", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        await setLocalStorage("userDetail", user);
        setLoading(false);
        setOtpStep(true); // move to OTP step
      } else {
        setLoading(false);
        Alert.alert("Login Failed", "Invalid email or password");
      }
    }, 1000);
  };

  // Verify OTP
  const verifyOtp = () => {
    if (!otpCode) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }
    if (otpCode === "123456") {
      router.replace("(tabs)"); // Navigate to your home screen
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <View style={{ padding: 25, flex: 1, backgroundColor: "white" }}>
      {!otpStep ? (
        <>
          <Text style={styles.textHeader}>Let's Sign You In</Text>
          <Text style={styles.SubText}>Welcome Back</Text>
          <Text style={styles.SubText}>You've been missed</Text>

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
            {errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonCreate}
            onPress={() => router.push("/(auth)/SignUp")}
          >
            <Text style={{ fontSize: 17, color: Colors.PRIMARY, textAlign: "center" }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.textHeader}>Enter OTP</Text>
          <TextInput
            placeholder="6-digit code"
            style={styles.TextInput}
            keyboardType="number-pad"
            maxLength={6}
            value={otpCode}
            onChangeText={setOtpCode}
          />
          <TouchableOpacity style={styles.button} onPress={verifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textHeader: { fontSize: 30, fontWeight: "bold", marginTop: 15 },
  SubText: { fontSize: 20, fontWeight: "500", marginTop: 5, color: Colors.Gray },
  TextInput: { padding: 12, borderWidth: 1, fontSize: 16, borderRadius: 10, marginTop: 5, backgroundColor: "white", borderColor: "#ddd" },
  button: { padding: 16, backgroundColor: Colors.PRIMARY, borderRadius: 10, marginTop: 35, alignItems: "center" },
  buttonCreate: { padding: 16, backgroundColor: "white", borderRadius: 10, marginTop: 20, borderWidth: 1, borderColor: Colors.PRIMARY },
  buttonText: { fontSize: 17, color: "white", textAlign: "center" },
  error: { color: "red", fontSize: 14, marginTop: 4 },
});
