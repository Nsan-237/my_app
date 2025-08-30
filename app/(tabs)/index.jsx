import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const [scrollY] = useState(new Animated.Value(0));

  // Mock user data - replace with real user state later
  const user = {
    name: "John",
    currentPlan: "Standard",
    bucketSize: "40L",
    collectionsPerWeek: 3,
    nextPickup: "Tomorrow, 8:00 AM",
    bucketFillLevel: 70,
    monthlyStats: {
      pickups: 12,
      wasteCollected: "480L",
      amountPaid: "8,000 FCFA"
    }
  };

  const handleSubscribe = () => {
    router.push('/SubscriptionPlan');
  };

  const handleQuickAction = (action) => {
    console.log(`${action} pressed`);
    // Navigate to respective screens later
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={['#1B5E20', '#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>♻️</Text>
            </View>
          </View>
          
          {/* App Title */}
          <Text style={styles.appTitle}>Zerodech</Text>
          <Text style={styles.appSubtitle}>Smart Waste Management for Cameroon</Text>
          
          {/* Floating Decorative Elements */}
          <View style={[styles.floatingCircle, { top: 60, left: 30 }]} />
          <View style={[styles.floatingCircle, { top: 100, right: 40, width: 40, height: 40 }]} />
          <View style={[styles.floatingCircle, { top: 180, left: 60, width: 25, height: 25 }]} />
        </LinearGradient>

        {/* User Greeting Card */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingContent}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>👋</Text>
            </View>
            <View style={styles.greetingText}>
              <Text style={styles.greetingTitle}>Hello, {user.name}!</Text>
              <Text style={styles.greetingSubtitle}>Welcome back to your clean community</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.scheduleCard]} 
              onPress={() => handleQuickAction('schedule')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                <MaterialCommunityIcons name="calendar-clock" size={24} color="white" />
              </View>
              <Text style={[styles.actionTitle, { color: '#2E7D32' }]}>Schedule</Text>
              <Text style={[styles.actionSubtitle, { color: '#2E7D32' }]}>Pickup</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.trackCard]} 
              onPress={() => handleQuickAction('track')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="white" />
              </View>
              <Text style={[styles.actionTitle, { color: '#1976D2' }]}>Track</Text>
              <Text style={[styles.actionSubtitle, { color: '#1976D2' }]}>Collector</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.paymentCard]} 
              onPress={() => handleQuickAction('payment')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                <FontAwesome5 name="money-bill-wave" size={20} color="white" />
              </View>
              <Text style={[styles.actionTitle, { color: '#F57C00' }]}>Payment</Text>
              <Text style={[styles.actionSubtitle, { color: '#F57C00' }]}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Subscription Status */}
        <View style={styles.section}>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>Your Current Plan</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>{user.currentPlan.toUpperCase()}</Text>
              </View>
            </View>
            
            <Text style={styles.planDetails}>
              {user.bucketSize} bucket • {user.collectionsPerWeek} collections/week
            </Text>
            <Text style={styles.nextPickup}>Next pickup: {user.nextPickup}</Text>
            
            {/* Bucket Fill Level */}
            <View style={styles.bucketStatus}>
              <Text style={styles.bucketLabel}>Bucket Status</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${user.bucketFillLevel}%` }]} />
              </View>
              <Text style={styles.fillPercentage}>{user.bucketFillLevel}% Full</Text>
            </View>
          </View>
        </View>

        {/* Main CTA Button */}
        <TouchableOpacity style={styles.mainCTA} onPress={handleSubscribe}>
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Upgrade Plan or Subscribe</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Monthly Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.pickupStat]}>
              <Text style={styles.statNumber}>{user.monthlyStats.pickups}</Text>
              <Text style={styles.statLabel}>Pickups</Text>
            </View>
            <View style={[styles.statCard, styles.wasteStat]}>
              <Text style={styles.statNumber}>{user.monthlyStats.wasteCollected}</Text>
              <Text style={styles.statLabel}>Collected</Text>
            </View>
            <View style={[styles.statCard, styles.costStat]}>
              <Text style={styles.statNumber}>{user.monthlyStats.amountPaid}</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    height: 280,
    paddingTop: 60,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
  },
  floatingCircle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    opacity: 0.1,
  },
  greetingCard: {
    marginHorizontal: 20,
    marginTop: -40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  greetingText: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 3,
    height: 100,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleCard: {
    backgroundColor: '#E8F5E8',
  },
  trackCard: {
    backgroundColor: '#E3F2FD',
  },
  paymentCard: {
    backgroundColor: '#FFF3E0',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  subscriptionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8F5E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  planBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  planDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  nextPickup: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  bucketStatus: {
    marginTop: 10,
  },
  bucketLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  fillPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'right',
  },
  mainCTA: {
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 28,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 28,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginRight: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  pickupStat: {
    backgroundColor: '#E8F5E8',
  },
  wasteStat: {
    backgroundColor: '#E3F2FD',
  },
  costStat: {
    backgroundColor: '#FFF3E0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});