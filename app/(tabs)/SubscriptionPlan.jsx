import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image, Alert } from "react-native";
import Colors from '@/constant/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SubscriptionPlan() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { 
      id: "1", 
      name: "Basic Plan", 
      frequency: "Weekly", 
      price: 2000,
      features: ["1 collection per week", "Standard waste types", "SMS notifications"],
      popular: false
    },
    { 
      id: "2", 
      name: "Premium Plan", 
      frequency: "Monthly", 
      price: 5000,
      features: ["4 collections per month", "All waste types", "SMS + App notifications", "Priority scheduling"],
      popular: true,
      savings: 3000 // 4 weeks * 2000 = 8000 vs 5000 = 3000 saved
    },
  ];

  const history = [
    { id: "1", date: "2025-08-01", status: "Collected", type: "General Waste" },
    { id: "2", date: "2025-08-10", status: "Pending", type: "Recyclables" },
    { id: "3", date: "2025-07-25", status: "Collected", type: "General Waste" },
  ];

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan.id);
    Alert.alert(
      "Confirm Subscription",
      `Are you sure you want to subscribe to the ${plan.name} for ${plan.price} FCFA ${plan.frequency.toLowerCase()}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Subscribe", onPress: () => {
          // Here you would typically process payment
          Alert.alert("Success!", `You've subscribed to ${plan.name}!`);
          setSelectedPlan(null);
        }}
      ]
    );
  };

  const renderPlan = ({ item }) => (
    <View style={[styles.planCard, item.popular && styles.popularPlan]}>
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      
      <Text style={styles.planName}>{item.name}</Text>
      <Text style={styles.planFrequency}>{item.frequency} Collection</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price} FCFA</Text>
        <Text style={styles.pricePeriod}>/{item.frequency.toLowerCase()}</Text>
      </View>

      {item.savings && (
        <Text style={styles.savingsText}>Save {item.savings} FCFA monthly!</Text>
      )}

      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={16} color={Colors.PRIMARY} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[
          styles.subscribeBtn, 
          selectedPlan === item.id && styles.subscribingBtn
        ]}
        onPress={() => handleSubscribe(item)}
        disabled={selectedPlan === item.id}
      >
        <Text style={styles.subscribeBtnText}>
          {selectedPlan === item.id ? "Processing..." : "Subscribe Now"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistory = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>
          {new Date(item.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
        <View style={[
          styles.statusBadge, 
          item.status === 'Collected' ? styles.statusSuccess : styles.statusPending
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.historyType}>{item.type}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Subscription Plans</Text>
        <Text style={styles.subtitle}>Choose the plan that works best for your household</Text>
      </View>

      {/* Plans Section */}
      <FlatList
        data={plans}
        renderItem={renderPlan}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.plansContainer}
      />

      {/* Collection History */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Collections</Text>
          <TouchableOpacity onPress={() => router.push('/CollectionHistory')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={history}
          renderItem={renderHistory}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Info Footer */}
      <View style={styles.infoContainer}>
        <MaterialIcons name="info" size={20} color={Colors.PRIMARY} />
        <Text style={styles.infoText}>
          Your subscription supports eco-friendly waste management in Cameroon
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  plansContainer: {
    paddingBottom: 16,
  },
  planCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularPlan: {
    borderColor: Colors.PRIMARY,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    backgroundColor: Colors.PRIMARY,
    padding: 8,
    borderRadius: 20,
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
  },
  popularText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planFrequency: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  savingsText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },
  subscribeBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribingBtn: {
    backgroundColor: '#999',
  },
  subscribeBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyType: {
    color: '#666',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  infoText: {
    marginLeft: 12,
    color: '#1976D2',
    fontSize: 14,
    flex: 1,
  },
});