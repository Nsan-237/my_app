import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const handleGetStarted = () => {
    console.log("Navigate to plans or subscription screen");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>EcoCollect Cameroon</Text>
        <Text style={styles.subtitle}>
          Revolutionizing waste management in Cameroon - one household at a time
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started Today</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.featureCard}>
          <MaterialCommunityIcons name="calendar-month" size={48} color={Colors.PRIMARY} />
          <Text style={styles.featureTitle}>Scheduled Pickups</Text>
          <Text style={styles.featureDesc}>Never miss a collection with our reliable scheduling system</Text>
        </View>
        <View style={styles.featureCard}>
          <MaterialCommunityIcons name="map-marker" size={48} color={Colors.PRIMARY} />
          <Text style={styles.featureTitle}>GPS Tracking</Text>
          <Text style={styles.featureDesc}>Real-time location tracking for efficient waste collection</Text>
        </View>
        <View style={styles.featureCard}>
          <MaterialCommunityIcons name="bell" size={48} color={Colors.PRIMARY} />
          <Text style={styles.featureTitle}>Smart Notifications</Text>
          <Text style={styles.featureDesc}>Get notified via SMS and app about collection times</Text>
        </View>
      </View>

      {/* Why Choose EcoCollect */}
      <View style={styles.whyChoose}>
        <Text style={styles.sectionTitle}>Why Choose EcoCollect?</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>🌍 Environmental Impact</Text>
            <Text style={styles.gridDesc}>Reduce waste pollution and improve community health</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>📱 Easy to Use</Text>
            <Text style={styles.gridDesc}>Simple app interface that works on any device</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>💰 Affordable Plans</Text>
            <Text style={styles.gridDesc}>Flexible pricing to suit every household budget</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>🚛 Reliable Service</Text>
            <Text style={styles.gridDesc}>Professional collectors with optimized routes</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 15 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.PRIMARY, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginVertical: 10, color: '#555' },
  button: { backgroundColor: Colors.PRIMARY, padding: 14, borderRadius: 10, marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  features: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  featureCard: { flex: 1, backgroundColor: 'white', padding: 15, marginHorizontal: 5, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  featureTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 10 },
  featureDesc: { fontSize: 14, textAlign: 'center', marginTop: 5, color: '#555' },
  whyChoose: { backgroundColor: '#e6f4ea', padding: 15, borderRadius: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.PRIMARY, textAlign: 'center', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 15 },
  gridTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  gridDesc: { fontSize: 14, color: '#555' },
});
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';