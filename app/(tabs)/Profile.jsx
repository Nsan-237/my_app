import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '../../constant/Colors';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../../service/Storage';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', email: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Load user info on component mount
  useEffect(() => {
    (async () => {
      const storedUser = await getLocalStorage('userDetail');
      if (storedUser) {
        setUser(storedUser);
        setName(storedUser.name || '');
        setEmail(storedUser.email || '');
      }
    })();
  }, []);

  // Update user profile
  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return;
    }
    const updatedUser = { ...user, name, email };
    await setLocalStorage('userDetail', updatedUser);
    setUser(updatedUser);
    Alert.alert('Success', 'Profile updated!');
  };

  // Logout
  const handleLogout = async () => {
    await removeLocalStorage();
    router.push('/(auth)/signIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: 'white' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginTop: 10 },
  input: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginTop: 5 },
  button: { padding: 16, backgroundColor: Colors.PRIMARY, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  logoutButton: { padding: 16, backgroundColor: '#f44336', borderRadius: 10, marginTop: 15, alignItems: 'center' },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
