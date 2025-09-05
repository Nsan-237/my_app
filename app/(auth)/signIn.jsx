// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { API_URL } from "../../constant";
// import Colors from "../../constant/Colors";

// export default function SignIn() {
//   const router = useRouter();

//   const [email, setUserEmail] = useState("nsan@gmail.com");
//   const [password, setUserPassword] = useState("123456");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");

//   // Save user data to AsyncStorage
//   const setLocalStorage = async (key, value) => {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   };

//   // Form validation
//   const validateForm = () => {
//     let tempErrors = {};

//     if (!email || email.trim() === "") tempErrors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
//       tempErrors.email = "Invalid email format";

//     if (!password) tempErrors.password = "Password is required";
//     else if (password.length < 6)
//       tempErrors.password = "Password must be at least 6 characters";

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   // Handle sign in - REAL API INTEGRATION
//   const handleSignIn = async () => {
//     if (!validateForm()) {
//       Alert.alert("Error", "Please fix the form errors");
//       return;
//     }

//     setLoading(true);

//     try {

      
//       const response = await fetch(`${API_URL}/user/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email.trim(),
//           password: password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Save user data to storage
//         await setLocalStorage("userDetail", data.user);
//             console.log("User details saved:", data.user);
//         if(data.user.role === "client"){
//             router.push("/(tabs)/Home")
//         }else if(data.user.role === "collector"){
//             router.push("/(collector)/Home")
//         }else if(data.user.role === "admin"){
//             router.push("/(admin)/Home")
//         }
//       } else {
//         Alert.alert("Login Failed", data.message || "Invalid email or password");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Network error. Please try again.");
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle forgot password
//   const handleForgotPassword = async () => {
//     if (!resetEmail) {
//       Alert.alert("Error", "Please enter your email address");
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
//       Alert.alert("Error", "Please enter a valid email address");
//       return;
//     }

//     try {
//       // REPLACE WITH YOUR ACTUAL FORGOT PASSWORD API ENDPOINT

      
//       const response = await fetch(`${API_URL}/user/forget-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: resetEmail.trim(),
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert(
//           "Reset Email Sent",
//           "If an account exists with this email, you will receive password reset instructions shortly.",
//           [{ text: "OK", onPress: () => setForgotPasswordModal(false) }]
//         );
//       } else {
//         Alert.alert("Error", data.message || "Failed to send reset email");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Network error. Please try again.");
//       console.error("Forgot password error:", error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {forgotPasswordModal ? (
//           <View style={styles.modalContainer}>
//             <TouchableOpacity 
//               style={styles.backButton}
//               onPress={() => setForgotPasswordModal(false)}
//             >
//               <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
//             </TouchableOpacity>
            
//             <Text style={styles.modalTitle}>Reset Password</Text>
//             <Text style={styles.modalSubtitle}>
//               Enter your email address and we'll send you instructions to reset your password.
//             </Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Email Address</Text>
//               <TextInput
//                 placeholder="Enter your email"
//                 style={styles.textInput}
//                 value={resetEmail}
//                 onChangeText={setResetEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             </View>

//             <TouchableOpacity 
//               style={styles.primaryButton}
//               onPress={handleForgotPassword}
//             >
//               <Text style={styles.primaryButtonText}>Send Reset Instructions</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={styles.content}>
//             <Text style={styles.textHeader}>Welcome Back</Text>
//             <Text style={styles.subText}>Sign in to your waste management account</Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Email Address</Text>
//               <TextInput
//                 placeholder="Enter your email"
//                 placeholderTextColor="gray"
//                 style={[styles.textInput, errors.email && styles.inputError]}
//                 value={email}
//                 onChangeText={(text) => {
//                   setUserEmail(text);
//                   if (errors.email) setErrors({...errors, email: ""});
//                 }}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Password</Text>
//               <View style={[styles.passwordInput, errors.password && styles.inputError]}>
//                 <TextInput
//                   placeholder="Enter your password"
//                   placeholderTextColor="gray"
//                   secureTextEntry={!showPassword}
//                   style={styles.passwordTextInput}
//                   value={password}
//                   onChangeText={(text) => {
//                     setUserPassword(text);
//                     if (errors.password) setErrors({...errors, password: ""});
//                   }}
//                 />
//                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                   <Ionicons 
//                     name={showPassword ? "eye-off" : "eye"} 
//                     size={20} 
//                     color="#666" 
//                   />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//             </View>

//             <TouchableOpacity 
//               style={styles.forgotPassword}
//               onPress={() => setForgotPasswordModal(true)}
//             >
//               <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.primaryButton, loading && styles.buttonDisabled]}
//               onPress={handleSignIn}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.primaryButtonText}>Sign In</Text>
//               )}
//             </TouchableOpacity>
            
            
//             <View style={styles.divider}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>OR</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             <TouchableOpacity
//               style={styles.secondaryButton}
//               onPress={() => router.push("/(auth)/SignUp")}
//             >
//               <Text style={styles.secondaryButtonText}>Create New Account</Text>
//             </TouchableOpacity>

//             {/* Demo Credentials Hint to show user how to login in the Zerodech app.
//             <View style={styles.demoHint}>
//               <Text style={styles.demoHintTitle}>Demo Credentials:</Text>
//               <Text style={styles.demoHintText}>• user@example.com / 123456</Text>
//               <Text style={styles.demoHintText}>• collector@example.com / 123456</Text>
//               <Text style={styles.demoHintText}>• admin@example.com / admin123</Text>
//             </View> */}
//           </View>
//         )}
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },
//   content: {
//     padding: 25,
//   },
//   modalContainer: {
//     padding: 25,
//     backgroundColor: "white",
//     flex: 1,
//     justifyContent: "center",
//   },
//   backButton: {
//     position: "absolute",
//     top: 50,
//     left: 20,
//     padding: 10,
//     zIndex: 1,
//   },
//   textHeader: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: Colors.PRIMARY,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   modalTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: Colors.PRIMARY,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   subText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 30,
//     lineHeight: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 8,
//     color: "#333",
//   },
//   textInput: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     fontSize: 16,
//     backgroundColor: "white",
//   },
//   passwordInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     backgroundColor: "white",
//   },
//   passwordTextInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   inputError: {
//     borderColor: "#F44336",
//   },
//   errorText: {
//     color: "#F44336",
//     fontSize: 14,
//     marginTop: 5,
//   },
//   forgotPassword: {
//     alignSelf: "flex-end",
//     marginBottom: 30,
//   },
//   forgotPasswordText: {
//     color: Colors.PRIMARY,
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   primaryButton: {
//     padding: 18,
//     backgroundColor: Colors.PRIMARY,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   primaryButtonText: {
//     fontSize: 18,
//     color: "white",
//     fontWeight: "600",
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   divider: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#ddd",
//   },
//   dividerText: {
//     marginHorizontal: 15,
//     color: "#666",
//     fontWeight: "500",
//   },
//   secondaryButton: {
//     padding: 18,
//     borderWidth: 1,
//     borderColor: Colors.PRIMARY,
//     borderRadius: 12,
//     alignItems: "center",
//     backgroundColor: "white",
//   },
//   secondaryButtonText: {
//     fontSize: 18,
//     color: Colors.PRIMARY,
//     fontWeight: "600",
//   },
//   demoHint: {
//     marginTop: 30,
//     padding: 15,
//     backgroundColor: "#f8f9fa",
//     borderRadius: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: Colors.PRIMARY,
//   },
//   demoHintTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 5,
//   },
//   demoHintText: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 2,
//   },
// });