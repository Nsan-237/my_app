import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axiosInstance from "../../apis/api"; // path to your axios instance
import { API_URL } from "../../constant/index";
import { getAuthToken, getLocalStorage } from "../../utils";

const { width, height } = Dimensions.get("window");

const defaultPlanStyles = {
  basic: { color: "#E8F5E8", icon: "home-outline", iconColor: "#4CAF50" },
  standard: { color: "#E3F2FD", icon: "home", iconColor: "#2196F3" },
  premium: { color: "#FFF3E0", icon: "office-building", iconColor: "#FF9800" },
};

export default function SubscriptionPlan() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    isLoading: true,
    error: null,
    data: null,
  });
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const paymentMethods = [
    { id: "orange", name: "Orange Money", icon: "phone", color: "#FF6600" },
    { id: "mtn", name: "MTN MoMo", icon: "phone", color: "#FFCC00" },
    {
      id: "bank",
      name: "Bank Card",
      icon: "credit-card",
      color: "#666",
      soon: true,
    },
  ];

  // Fetch subscription plans from API
  useFocusEffect(
    useCallback(() => {
      const fetchPlans = async () => {
        try {
          const res = await fetch(`${API_URL}/subscription/getSubscriptions`);
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const enrichedPlans = data.data.map((plan) => {
              const style =
                defaultPlanStyles[plan.id] || defaultPlanStyles.basic;
              return { ...plan, ...style };
            });
            const planOrder = ["basic", "standard", "premium"];
            enrichedPlans.sort(
              (a, b) => planOrder.indexOf(a.id) - planOrder.indexOf(b.id)
            );
            setPlans(enrichedPlans);
            setSelectedPlan(enrichedPlans[0]?._id || null);
          } else {
            Alert.alert("Error", "Failed to load subscription plans.");
          }
        } catch (err) {
          Alert.alert(
            "Error",
            "Could not fetch subscription plans from server."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchPlans();

      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const [token, setToken] = useState("");
  console.log("Auth Token:", token);
  useEffect(() => {
    const loadUser = async () => {
      const userData = await getLocalStorage();
      console.log("Loaded user data:", userData);
      setUserData(
        userData
          ? { ...userData, isLoading: false }
          : { isLoading: false, error: "No user found" }
      );
    };
    loadUser();
  }, []);
  useEffect(() => {
    const fetchToken = async () => {
      const authToken = await getAuthToken();
      setToken(authToken || "");
    };
    fetchToken();
  },[]);

  const handleSubscribe = async (req, res) => {
    const plan = plans.find((p) => p._id === selectedPlan);
    if (!plan) return Alert.alert("Error", "Please select a plan first.");
    console.log(API_URL); // Should print your backend URL
    console.log(`${API_URL}/subscription/subscribeToPlan`);
    console.log("selected plan", plan, plan._id);
    // console.log("Received subscribe request:", req.body, req.user);
    Alert.alert(
      "Confirm Subscription",
      `Subscribe to ${
        plan.name
      } for ${plan.price.toLocaleString()} FCFA/month?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: async () => {
            try {
              const { data } = await axiosInstance.post(
                "/subscription/subscribeToPlan",
                {
                  subscription_id: plan._id,
                  user_id: userData._id,
                  user_name: userData.name
                }, {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                  }
                }
              );

              if (data.success) {
                Alert.alert(
                  "Subscribed Successfully 🎉",
                  `You are now on the ${plan.name}!`,
                  [{ text: "OK", onPress: () => router.replace("./Home") }]
                );
              } else {
                Alert.alert("Error", data.message || "Subscription failed");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Something went wrong while subscribing.");
            }
          },
        },
      ]
    );
  };

  const handleContactCustom = () => {
    Alert.alert(
      "Custom Plan Request",
      "Contact us for custom waste management solutions:\n\n📞 +237 6XX XXX XXX\n✉️ support@zerodech.cm",
      [{ text: "OK" }]
    );
  };

  const handleBack = () => router.back();

  if (loading)
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      <LinearGradient colors={["#2E7D32", "#4CAF50"]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <Text style={styles.headerSubtitle}>
          Select the perfect waste collection plan for your needs
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Area */}
        <View style={styles.serviceArea}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#4CAF50" />
          <Text style={styles.serviceAreaText}>
            Currently serving Greater Yaoundé
          </Text>
          <Text style={styles.serviceAreaSubtext}>
            Douala expansion coming soon!
          </Text>
        </View>

        {/* Plans */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan._id;
            return (
              <TouchableOpacity
                key={plan._id}
                style={[
                  styles.planCard,
                  { backgroundColor: plan.color },
                  isSelected && { borderColor: "#4CAF50", borderWidth: 3 },
                ]}
                onPress={() => setSelectedPlan(plan._id)}
                activeOpacity={0.8}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color="white"
                    />
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <View style={styles.planTitleSection}>
                    <MaterialCommunityIcons
                      name={plan.icon}
                      size={32}
                      color={plan.iconColor}
                    />
                    <View style={styles.planTitleText}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planFrequency}>{plan.frequency}</Text>
                    </View>
                  </View>
                  <View style={styles.priceSection}>
                    {plan.originalPrice && (
                      <Text style={styles.originalPrice}>
                        {plan.originalPrice.toLocaleString()} FCFA
                      </Text>
                    )}
                    <Text style={styles.planPrice}>
                      {plan.price.toLocaleString()}
                      <Text style={styles.currency}> FCFA</Text>
                    </Text>
                    <Text style={styles.pricePeriod}>per month</Text>
                  </View>
                </View>

                <View style={styles.bucketInfo}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color={plan.iconColor}
                  />
                  <Text style={[styles.bucketText, { color: plan.iconColor }]}>
                    {plan.bucketSize} Bucket Included
                  </Text>
                </View>

                <View style={styles.featuresContainer}>
                  {plan.features?.map((feature, i) => (
                    <View key={i} style={styles.featureItem}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={16}
                        color="#4CAF50"
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#4CAF50"
                    />
                    <Text style={styles.selectedText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethod}>
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={method.color}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    method.soon && styles.comingSoon,
                  ]}
                >
                  {method.name} {method.soon && "(Soon)"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Custom Plan */}
        <TouchableOpacity
          style={styles.customPlanCard}
          onPress={handleContactCustom}
        >
          <MaterialCommunityIcons
            name="account-group"
            size={32}
            color="#FF6B6B"
          />
          <View style={styles.customPlanText}>
            <Text style={styles.customPlanTitle}>Need a Custom Plan?</Text>
            <Text style={styles.customPlanSubtitle}>
              Contact us for businesses, apartments, or special requirements
            </Text>
          </View>
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color="#FF6B6B"
          />
        </TouchableOpacity>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <LinearGradient
            colors={["#4CAF50", "#45a049"]}
            style={styles.subscribeGradient}
          >
            <Text style={styles.subscribeText}>
              Subscribe to{" "}
              {plans.find((p) => p._id === selectedPlan)?.plan ||
                "Select a Plan"}
            </Text>
            <FontAwesome5 name="arrow-right" size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Cancel anytime with 7 days notice.
        </Text>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// Use **former code styling** intact
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: { marginBottom: 15, alignSelf: "flex-start" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    marginBottom: 5,
  },
  headerSubtitle: { fontSize: 16, color: "rgba(255, 255, 255, 0.9)" },
  content: { flex: 1, paddingHorizontal: 20 },
  serviceArea: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceAreaText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  serviceAreaSubtext: { fontSize: 14, color: "#666", marginTop: 2 },
  planCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1,
  },
  popularText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  planTitleSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  planTitleText: { marginLeft: 15, flex: 1 },
  planName: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 4 },
  planFrequency: { fontSize: 14, color: "#666" },
  priceSection: { alignItems: "flex-end" },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  planPrice: { fontSize: 24, fontWeight: "900", color: "#333" },
  currency: { fontSize: 16, fontWeight: "600" },
  pricePeriod: { fontSize: 12, color: "#777", marginTop: 2 },
  bucketInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
  },
  bucketText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  featuresContainer: { marginBottom: 15 },
  featureItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  featureText: { marginLeft: 10, fontSize: 14, color: "#555" },
  selectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  selectedText: {
    marginLeft: 8,
    fontWeight: "700",
    color: "#4CAF50",
    marginLeft: 8,
  },
  paymentSection: { marginVertical: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  paymentMethods: { flexDirection: "row", justifyContent: "space-around" },
  paymentMethod: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  comingSoon: { color: "#aaa", fontStyle: "italic" },
  customPlanCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customPlanText: { flex: 1, marginLeft: 15, marginRight: 10 },
  customPlanTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  customPlanSubtitle: { fontSize: 14, color: "#666" },
  subscribeButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignSelf: "center",
    width: width * 0.9,
    maxWidth: 400,
  },
  subscribeGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  subscribeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginRight: 10,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
    marginBottom: 10,
  },
});
