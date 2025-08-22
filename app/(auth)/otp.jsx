import { useRouter, useSearchParams } from "expo-router";
import { useState } from "react";
import { Colors } from "../../constant/Colors";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

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
      router.push("(tabs)"); // go to main app
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
