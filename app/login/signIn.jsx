import { auth } from '@/config/FirebaseConfig';
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Colors from '../../constant/Colors';
import { setLocalStorage } from "./../../service/Storage";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Invalid email format";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const OnSignInClick = () => {
    if (!validateForm()) {
      ToastAndroid.show("Please fix the form errors", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setLocalStorage("userDetail", user);
        setLoading(false);
        setOtpStep(true); // go to OTP step
      })
      .catch((error) => {
        setLoading(false);
        let message = "Something went wrong";
        if (error.code === "auth/invalid-credential") {
          message = "Invalid email or password";
        } else if (error.code === "auth/user-not-found") {
          message = "User not found";
        } else if (error.code === "auth/wrong-password") {
          message = "Wrong password";
        }
        Alert.alert("Login Failed", message);
      });
  };

  const verifyOtp = () => {
    if (!otpCode) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }
    if (otpCode === "123456") {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <View style={{ padding: 25 }}>
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
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={() => router.push("(tabs)")}
            // onPress={OnSignInClick}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCreate} onPress={() => router.push("/login/SignUp")}>
            <Text style={{ fontSize: 17, color: Colors.PRIMARY, textAlign: "center" }}>Create Account</Text>
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
  SubText: { fontSize: 30, fontWeight: "bold", marginTop: 10, color: Colors.Gray },
  TextInput: { padding: 10, borderWidth: 1, fontSize: 17, borderRadius: 10, marginTop: 5, backgroundColor: "white" },
  button: { padding: 20, backgroundColor: Colors.PRIMARY, borderRadius: 10, marginTop: 35, alignItems: "center" },
  buttonCreate: { padding: 20, backgroundColor: "white", borderRadius: 10, marginTop: 20, borderWidth: 1, borderColor: Colors.PRIMARY },
  buttonText: { fontSize: 17, color: "white", textAlign: "center" },
  error: { color: "red", fontSize: 14, marginTop: 4 }
});
