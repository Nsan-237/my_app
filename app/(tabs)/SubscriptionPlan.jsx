import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function SubscriptionPlan()  {
      const plans = [
        { id: "1", name: "Basic Plan", frequency: "Weekly", price: 2000 },
        { id: "2", name: "Premium Plan", frequency: "Monthly", price: 5000 },
      ];
    
      const history = [
        { id: "1", date: "2025-08-01", status: "Collected" },
        { id: "2", date: "2025-08-10", status: "Pending" },
      ];
    
      const renderPlan = ({ item }) => (
        <View style={styles.planCard}>
          <Text style={styles.planName}>{item.name}</Text>
          <Text>{item.frequency}</Text>
          <Text>{item.price} FCFA</Text>
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      );
    
      const renderHistory = ({ item }) => (
        <View style={styles.historyItem}>
          <Text>{item.date}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      );
    
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <FlatList
            data={plans}
            renderItem={renderPlan}
            keyExtractor={(item) => item.id}
          />
    
          <Text style={styles.sectionTitle}>Collection History</Text>
          <FlatList
            data={history}
            renderItem={renderHistory}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
      },
      planCard: {
        padding: 15,
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        marginVertical: 8,
      },
      planName: {
        fontSize: 18,
        fontWeight: "bold",
      },
      subscribeBtn: {
        marginTop: 10,
        backgroundColor: "green",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
      },
      historyItem: {
        padding: 15,
        backgroundColor: "#eee",
        borderRadius: 8,
        marginVertical: 6,
      },
      historyText: {
        fontSize: 16,
      },
    });
