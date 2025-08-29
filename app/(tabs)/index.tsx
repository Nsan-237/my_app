import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import Colors from '../../constant/Colors';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // To make the button actually navigate

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = new Animated.Value(0); // For potential parallax effects
  
  const handleGetStarted = () => {
    // Actually navigate to the subscription plan screen
    router.push('/SubscriptionPlan');
  };

  // Header background animation interpolations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [250, 120],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header Background */}
      <Animated.View style={[styles.headerBackground, { height: headerHeight, opacity: headerOpacity }]} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            // source={require('../../assets/images/eco-collect-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>EcoCollect Cameroon</Text>
          <Text style={styles.subtitle}>
            Revolutionizing waste management in Cameroon - one household at a time
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started Today</Text>
            <FontAwesome name="arrow-right" size={16} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.features}>
          {[
            { icon: "calendar-month", title: "Scheduled Pickups", desc: "Never miss a collection with our reliable scheduling system" },
            { icon: "map-marker", title: "GPS Tracking", desc: "Real-time location tracking for efficient waste collection" },
            { icon: "bell", title: "Smart Notifications", desc: "Get notified via SMS and app about collection times" },
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name ={feature.icon} size={32} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>

        {/* Why Choose EcoCollect */}
        <View style={styles.whyChoose}>
          <Text style={styles.sectionTitle}>Why Choose EcoCollect?</Text>
          <View style={styles.grid}>
            {[
              { emoji: "🌍", title: "Environmental Impact", desc: "Reduce waste pollution and improve community health" },
              { emoji: "📱", title: "Easy to Use", desc: "Simple app interface that works on any device" },
              { emoji: "💰", title: "Affordable Plans", desc: "Flexible pricing to suit every household budget" },
              { emoji: "🚛", title: "Reliable Service", desc: "Professional collectors with optimized routes" },
            ].map((item, index) => (
              <View key={index} style={styles.gridItem}>
                <Text style={styles.gridEmoji}>{item.emoji}</Text>
                <Text style={styles.gridTitle}>{item.title}</Text>
                <Text style={styles.gridDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Call to Action at the bottom */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>Ready to make a difference?</Text>
          <TouchableOpacity style={[styles.button, styles.ctaButton]} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Join EcoCollect Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.PRIMARY, // You should add this lighter shade to your Colors.js
    zIndex: -1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
    lineHeight: 22,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 30,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  features: {
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
  },
  iconContainer: {
    backgroundColor: '#f0f9ff',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center',
    color: '#333',
  },
  featureDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
    lineHeight: 20,
  },
  whyChoose: {
    backgroundColor: '#e6f4ea',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  gridEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  gridTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  gridDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaContainer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 30,
  },
  ctaText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 15,
    textAlign: 'center',
  },
  ctaButton: {
    paddingHorizontal: 30,
  },
});