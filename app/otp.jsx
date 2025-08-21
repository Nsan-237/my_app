import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useSearchParams } from "expo-router";

export default function OtpPage() {
  const router = useRouter();
  const { email, type } = useSearchParams(); // read params
  const [otp, setOtp] = useState("");
  router.push({
  pathname: "/otp",
  params: { email, type: "SignUp" }
});

  const handleVerify = () => {
    if (otp === "123456") {
      router.push("/(tabs)/Home"); // go to main app
    } else {
      Alert.alert("Invalid OTP");
    }
  };

  return (
    <View style={{ padding: 25 }}>
      <Text>Enter OTP for {email}</Text>
      <TextInput
        placeholder="6-digit code"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        style={{ borderWidth: 1, padding: 10, marginVertical: 15 }}
      />
      <TouchableOpacity onPress={handleVerify}>
        <Text>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
