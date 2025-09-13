import { API_URL } from "@/constant";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constant/Colors";


export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userlocation: "",
    userphone: "",
    userpassword: "",
    userrole: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Update form data
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.username.trim())
      tempErrors.username = "Full name is required";
    if (!formData.useremail) tempErrors.useremail = "Email is required";
    if (!formData.userphone) tempErrors.userphone = "Phone number is required";
    if (!formData.userpassword)
      tempErrors.userpassword = "Password is required";
    if (!formData.userlocation) tempErrors.userlocation = "Location is required";
    if (!formData.userrole) tempErrors.userrole = "Please select a role";

    setErrors(tempErrors);

    // ✅ return true only if no errors
    return Object.keys(tempErrors).length === 0;
  };

  const OnCreateAccount = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fix the form errors");
      return;
    }

    setIsLoading(true);
    setApiResponse(null);

    try {
      const apiUrl = `${API_URL}/user/signup`;
      const response = await axios.post(apiUrl, formData);

      if (response.status === 201) {
        setApiResponse({
          success: true,
          message: "Account created successfully!",
        });
        Alert.alert("Success", "Account created successfully!");

        // Redirect to login after successful signup
        setTimeout(() => {
          router.push("/(auth)/signIn");
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network error. Please try again.";

      setApiResponse({ success: false, message: errorMessage });
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.textHeader}>Create New Account</Text>
        <Text style={styles.subtitle}>
          Join us and manage waste efficiently
        </Text>

        {apiResponse && (
          <View
            style={[
              styles.responseBanner,
              {
                backgroundColor: apiResponse.success ? "#4CAF50" : "#F44336",
              },
            ]}
          >
            <Text style={styles.responseText}>{apiResponse.message}</Text>
          </View>
        )}

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name </Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="gray"
            style={[styles.textInput, errors.username && styles.inputError]}
            value={formData.username}
            onChangeText={(text) => handleInputChange("username", text)}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address </Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="gray"
            style={[styles.textInput, errors.useremail && styles.inputError]}
            value={formData.useremail}
            onChangeText={(text) => handleInputChange("useremail", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.useremail && (
            <Text style={styles.errorText}>{errors.useremail}</Text>
          )}
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number </Text>
          <TextInput
            placeholder="Enter your phone number"
            placeholderTextColor="gray"
            style={[styles.textInput, errors.userphone && styles.inputError]}
            value={formData.userphone}
            onChangeText={(text) => handleInputChange("userphone", text)}
            keyboardType="phone-pad"
          />
          {errors.userphone && (
            <Text style={styles.errorText}>{errors.userphone}</Text>
          )}
        </View>

         {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}> Location </Text>
          <TextInput
            placeholder="Enter your Location"
            placeholderTextColor="gray"
            style={[styles.textInput, errors.userlocation && styles.inputError]}
            value={formData.userlocation}
            onChangeText={(text) => handleInputChange("userlocation", text)}
            keyboardType="email-location"
            autoCapitalize="none"
          />
          {errors.userlocation && (
            <Text style={styles.errorText}>{errors.userlocation}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password </Text>
          
          <TextInput
            placeholder="Create a password (min. 6 characters)"
            placeholderTextColor="gray"
            secureTextEntry
            style={[styles.textInput, errors.userpassword && styles.inputError]}
            value={formData.userpassword}
            onChangeText={(text) => handleInputChange("userpassword", text)}
          />
         
          {errors.userpassword && (
            <Text style={styles.errorText}>{errors.userpassword}</Text>
          )}
        </View>

        {/* Role */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>I am a :</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.userrole === "client" && styles.roleButtonActive,
              ]}
              onPress={() => handleInputChange("userrole", "client")}
            >
              <Text
                style={[
                  styles.roleText,
                  formData.userrole === "client" && styles.roleTextActive,
                ]}
              >
                Household/Client
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.userrole === "collector" && styles.roleButtonActive,
              ]}
              onPress={() => handleInputChange("userrole", "collector")}
            >
              <Text
                style={[
                  styles.roleText,
                  formData.userrole === "collector" && styles.roleTextActive,
                ]}
              >
                Waste Collector
              </Text>
            </TouchableOpacity>
          </View>
          {errors.userrole && (
            <Text style={styles.errorText}>{errors.userrole}</Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={OnCreateAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Sign In link */}
        <TouchableOpacity
          style={styles.signInLink}
          onPress={() => router.push("/(auth)/signIn")}
        >
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={styles.signInHighlight}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 25, paddingTop: 40 },
  textHeader: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  placeholder: {
    color: "#aaa",
  },
  inputGroup: { marginBottom: 20 },
  label: { 
    fontSize: 16,
    fontWeight: "600", 
    marginBottom: 8, 
    color: "#333" 
    },
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#F44336" },
  errorText: { color: "#F44336", fontSize: 14, marginTop: 5 },
  
  roleContainer: { 
  flexDirection: "row", 
  justifyContent: "space-between", 
  gap: 10 
  },
  
  roleButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  roleButtonActive: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY + "20",
  },
  roleText: { color: "#666", fontWeight: "500" },
  roleTextActive: { color: Colors.PRIMARY, fontWeight: "600" },
  button: {
    padding: 18,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 18, color: "white", fontWeight: "600" },
  signInLink: { alignItems: "center", padding: 15 },
  signInText: { fontSize: 16, color: "#666" },
  signInHighlight: { color: Colors.PRIMARY, fontWeight: "600" },
  responseBanner: { padding: 15, borderRadius: 8, marginBottom: 20 },
  responseText: { color: "white", textAlign: "center", fontWeight: "500" },
});
