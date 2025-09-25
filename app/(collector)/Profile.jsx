import React, { useState, useRef,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  StatusBar,
  Animated,
  
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // ✅ 
import Colors from '../../constant/Colors';
import { getAuthToken, getLocalStorage } from '../../utils';

export default function ProfileScreen() {
  const router = useRouter();
  const token = getAuthToken();
  const [userData, setUserData] = useState({ isLoading: true
    // name: 'John Doe',
    // phone: '+237 6XX XXX XXX',
    // email: 'john.doe@gmail.com',
    // address: 'Bastos, Yaoundé',
    // currentPlan: 'Standard Plan',
    // profilePicture: null
  });

   useEffect(() => {
      const loadUser = async () => {
        const userData = await getLocalStorage();
        console.log("Loaded user data:", userData);
        setUserData(userData ? { ...userData, isLoading: false } : { isLoading: false, error: "No user found" });
      };
      loadUser();
    }, []);
  // Settings states
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [collectionReminders, setCollectionReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  // ✅ Persist fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Replay animation each time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Navigate to edit profile screen');
  };

  const handleChangePlan = () => {
    router.push('/SubscriptionPlan');
  };

  const handlePaymentMethods = () => {
    Alert.alert('Payment Methods', 'Navigate to payment methods screen');
  };

  const handleBillingHistory = () => {
    Alert.alert('Billing History', 'Navigate to billing history screen');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Navigate to change password screen');
  };

  const handleLanguageChange = () => {
    const newLang = language === 'English' ? 'Français' : 'English';
    setLanguage(newLang);
    Alert.alert('Language Changed', `Switched to ${newLang}`);
  };

  const handlePauseSubscription = () => {
    Alert.alert(
      'Pause Subscription',
      'Are you sure you want to pause your subscription?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pause', onPress: () => Alert.alert('Success', 'Subscription paused') }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => router.replace('(auth)/signIn') },
      ]
    );
  };

  const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const ProfileItem = ({ icon, title, subtitle, onPress, rightComponent, color = Colors.PRIMARY1 }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={[styles.itemIcon, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      
      {/* Header with Profile Info */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={handleEditProfile}>
            {userData.profilePicture ? (
              <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <MaterialCommunityIcons name="account" size={40} color="white" />
              </View>
            )}
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={12} color="white" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
            <View style={styles.planBadge}>
              <MaterialCommunityIcons name="crown" size={16} color="#FFD700" />
              <Text style={styles.planBadgeText}>{userData.currentPlan}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          
          {/* Personal Information */}
          <ProfileSection title="Personal Information">
            <ProfileItem
              icon="account-edit"
              title="Edit Profile"
              subtitle="Update your personal details"
              onPress={handleEditProfile}
            />
            <ProfileItem
              icon="phone"
              title="Phone Number"
              subtitle={userData.phone}
              onPress={handleEditProfile}
            />
            <ProfileItem
              icon="map-marker"
              title="Address"
              subtitle={userData.location}
              onPress={handleEditProfile}
            />
          </ProfileSection>

          {/* Account Settings */}
          <ProfileSection title="Account Settings">
            <ProfileItem
              icon="package-variant"
              title="Current Plan"
              subtitle={userData.currentPlan + " • Active"}
              onPress={handleChangePlan}
              color="#2196F3"
            />
            <ProfileItem
              icon="credit-card"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={handlePaymentMethods}
              color="#FF9800"
            />
            <ProfileItem
              icon="receipt"
              title="Billing History"
              subtitle="View past payments"
              onPress={handleBillingHistory}
              color="#9C27B0"
            />
            <ProfileItem
              icon="lock"
              title="Change Password"
              subtitle="Update your password"
              onPress={handleChangePassword}
              color="#F44336"
            />
          </ProfileSection>

          {/* Notifications */}
          <ProfileSection title="Notifications">
            <ProfileItem
              icon="message-text"
              title="SMS Notifications"
              subtitle="Collection reminders via SMS"
              rightComponent={
                <Switch
                  value={smsNotifications}
                  onValueChange={setSmsNotifications}
                  trackColor={{ false: '#ccc', true: Colors.PRIMARY1 + '50' }}
                  thumbColor={smsNotifications ? Colors.PRIMARY1 : '#f4f3f4'}
                />
              }
            />
            <ProfileItem
              icon="bell"
              title="App Notifications"
              subtitle="Push notifications in app"
              rightComponent={
                <Switch
                  value={appNotifications}
                  onValueChange={setAppNotifications}
                  trackColor={{ false: '#ccc', true: Colors.PRIMARY1 + '50' }}
                  thumbColor={appNotifications ? Colors.PRIMARY1 : '#f4f3f4'}
                />
              }
            />
            <ProfileItem
              icon="alarm"
              title="Collection Reminders"
              subtitle="Remind me before pickup"
              rightComponent={
                <Switch
                  value={collectionReminders}
                  onValueChange={setCollectionReminders}
                  trackColor={{ false: '#ccc', true: Colors.PRIMARY1 + '50' }}
                  thumbColor={collectionReminders ? Colors.PRIMARY1 : '#f4f3f4'}
                />
              }
            />
          </ProfileSection>

          {/* App Preferences */}
          <ProfileSection title="App Preferences">
            <ProfileItem
              icon="translate"
              title="Language"
              subtitle={language}
              onPress={handleLanguageChange}
              color="#673AB7"
            />
            <ProfileItem
              icon="theme-light-dark"
              title="Dark Mode"
              subtitle="Switch app appearance"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#ccc', true: '#333' }}
                  thumbColor={darkMode ? '#666' : '#f4f3f4'}
                />
              }
              color="#424242"
            />
          </ProfileSection>

          {/* Account Management */}
          <ProfileSection title="Account Management">
            <ProfileItem
              icon="pause-circle"
              title="Pause Subscription"
              subtitle="Temporarily stop collections"
              onPress={handlePauseSubscription}
              color="#FF5722"
            />
            <ProfileItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Contact customer support"
              onPress={() => Alert.alert('Support', 'Contact: +237 6XX XXX XXX')}
              color="#00BCD4"
            />
            <ProfileItem
              icon="information"
              title="About Zerodech"
              subtitle="App version & information"
              onPress={() => Alert.alert('About', 'Zerodech v1.0\nBuilt for clean communities')}
              color="#607D8B"
            />
          </ProfileSection>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#F44336" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </Animated.View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  profileImageContainer: { position: 'relative', marginRight: 20 },
  profileImage: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'white',
  },
  profileImagePlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'white',
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#4CAF50', width: 28, height: 28,
    borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'white',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 24, fontWeight: '700', color: 'white', marginBottom: 4 },
  profileEmail: { fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 10 },
  planBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15,
    alignSelf: 'flex-start',
  },
  planBadgeText: { color: 'white', fontSize: 14, fontWeight: '600', marginLeft: 6 },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15, marginLeft: 5 },
  sectionContent: {
    backgroundColor: 'white', borderRadius: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  profileItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  itemIcon: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  itemSubtitle: { fontSize: 14, color: '#666' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'white', padding: 16, borderRadius: 15,
    marginTop: 30, borderWidth: 1, borderColor: '#F44336',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#F44336', marginLeft: 8 },
});
