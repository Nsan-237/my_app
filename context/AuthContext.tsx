import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constant";
import { router } from "expo-router";
import { Alert } from "react-native";



interface AuthContextType {
  user: any;
  token: string;
  login: (values:any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loginLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: "",
  login: async () => {},
  logout: async () => {},
  loginLoading: false,
  isAuthenticated: false,
});

export const useAuth = () => {
    if (!AuthContext) {
        throw new Error("useAuth must be used within an AuthProvider"); 
    }
    return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      const storedUser = await AsyncStorage.getItem("userDetail");
      setToken(storedToken ?? "");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    loadAuth();
  }, []);

  const login = async ({email, password}: any) => { 
    setLoginLoading(true);
    try {
          const response = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.trim(),
              password: password,
            }),
          });
    
          const data = await response.json();
          console.log("Login response data:", data);
          if (response.ok) {
            // Save JWT token for authenticated requests
            await AsyncStorage.setItem("userToken", data.token);
            // await setLocalStorage("userDetail", data.user);
            await AsyncStorage.setItem("userDetail", JSON.stringify(data.user));
            console.log("User details saved:", data.user);
            if (data.user.role === "client") {
              router.push("/(tabs)/Home");
            } else if (data.user.role === "collector") {
              router.push("/(collector)/Home");
            } else if (data.user.role === "admin") {
              router.push("/(admin)/Home");
            }
          } else {
            Alert.alert(
              "Login Failed",
              data.message || "Invalid email or password"
            );
          }
        } catch (error) {
          console.log("Error:", error);
          Alert.alert("Error", "Network error. Please try again.");
          console.error("Login error:", error);
        } finally {
          setLoginLoading(false);
        }
  };

  const logout = async () => {
    await AsyncStorage.clear(); 
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loginLoading  }}>
      {children}
    </AuthContext.Provider>
  );
};