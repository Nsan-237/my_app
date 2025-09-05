import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Mock data for assigned clients (kept realistic for Cameroon)
const mockClients = [
  {
    id: 'CL001',
    name: 'Marie Ngono',
    address: 'Mvog-Mbi, Yaoundé',
    phone: '+237 679 123 456',
    plan: 'Premium',
    planPrice: '12,000 FCFA',
    collectionDay: 'Monday',
    status: 'pending',
    coordinates: { lat: 3.8480, lng: 11.5021 },
    notes: '',
    lastCollection: '2025-08-28'
  },
  {
    id: 'CL002',
    name: 'Paul Biya Jr',
    address: 'Bastos, Yaoundé',
    phone: '+237 698 987 654',
    plan: 'Standard',
    planPrice: '7,000 FCFA',
    collectionDay: 'Monday',
    status: 'completed',
    coordinates: { lat: 3.8667, lng: 11.5167 },
    notes: 'Regular pickup, bin full',
    lastCollection: '2025-09-02'
  },
  {
    id: 'CL003',
    name: 'Agnes Mballa',
    address: 'Emombo, Yaoundé',
    phone: '+237 677 555 123',
    plan: 'Basic',
    planPrice: '4,000 FCFA',
    collectionDay: 'Tuesday',
    status: 'missed',
    coordinates: { lat: 3.8278, lng: 11.5189 },
    notes: 'Client away, gate locked',
    lastCollection: '2025-08-26'
  },
  {
    id: 'CL004',
    name: 'Jean Claude Mbida',
    address: 'Nkoldongo, Yaoundé',
    phone: '+237 655 789 321',
    plan: 'Premium',
    planPrice: '12,000 FCFA',
    collectionDay: 'Wednesday',
    status: 'pending',
    coordinates: { lat: 3.8350, lng: 11.5028 },
    notes: '',
    lastCollection: '2025-08-30'
  }
];

const CollectorDashboard = () => {
  const [clients, setClients] = useState(mockClients);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [collectionModal, setCollectionModal] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [collectionStatus, setCollectionStatus] = useState('completed');
  const [collectionPhoto, setCollectionPhoto] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const filterOptions = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredClients = clients.filter(client => {
    const matchesFilter = selectedFilter === 'All' || client.collectionDay === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      client.name.toLowerCase().includes(q) ||
      client.address.toLowerCase().includes(q) ||
      client.phone.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'missed': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Collected';
      case 'missed': return 'Missed';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Premium': return '#8B5CF6';
      case 'Standard': return '#3B82F6';
      case 'Basic': return '#10B981';
      default: return '#6B7280';
    }
  };

  const openCollectionModal = (client) => {
    setSelectedClient(client);
    setFeedbackNotes(client.notes);
    setCollectionStatus(client.status);
    setCollectionPhoto(null);
    setCollectionModal(true);
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCollectionPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open camera');
    }
  };

  const submitCollectionFeedback = () => {
    if (!selectedClient) return;

    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          status: collectionStatus,
          notes: feedbackNotes,
          lastCollection: collectionStatus === 'completed' ? new Date().toISOString().split('T')[0] : client.lastCollection
        };
      }
      return client;
    });

    setClients(updatedClients);
    setCollectionModal(false);
    Alert.alert('Success', 'Collection feedback saved');
  };

  const callClient = (phone) => {
    Alert.alert('Call client', `Number: ${phone}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Call:', phone) }
    ]);
  };

  const navigateToClient = (client) => {
    Alert.alert('Navigation', `Go to: ${client.address}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Maps', onPress: () => console.log('Navigate to:', client.coordinates) }
    ]);
  };

  const MetricCard = ({ value, label, icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statIconWrap}>
        <Ionicons name={icon} size={18} color={'#fff'} />
      </View>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const ClientCard = ({ client }) => (
    <View style={styles.clientCard}>
      {/* Plan strip */}
      <View style={[styles.planStrip, { backgroundColor: getPlanColor(client.plan) }]} />

      <View style={styles.cardHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientAddress}>{client.address}</Text>
          <View style={styles.planBadge}>
            <View style={[styles.planDot, { backgroundColor: getPlanColor(client.plan) }]} />
            <Text style={styles.planText}>{client.plan} • {client.planPrice}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
          <Text style={styles.statusText}>{getStatusText(client.status)}</Text>
        </View>
      </View>

      <View style={styles.clientDetails}>
        <Text style={styles.detailText}>📅 Pickup day: {client.collectionDay}</Text>
        <Text style={styles.detailText}>📱 {client.phone}</Text>
        <Text style={styles.detailText}>🗓️ Last collection: {client.lastCollection}</Text>
        {!!client.notes && (
          <Text style={styles.notesText}>📝 {client.notes}</Text>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.callButton]} 
          onPress={() => callClient(client.phone)}
          activeOpacity={0.9}
        >
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.navigateButton]} 
          onPress={() => navigateToClient(client)}
          activeOpacity={0.9}
        >
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.collectButton]} 
          onPress={() => openCollectionModal(client)}
          activeOpacity={0.9}
        >
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Collect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Header */}
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Collector Dashboard</Text>
            <Text style={styles.headerSubtitle}>Zerodech Field App</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={getCurrentLocation}  activeOpacity={0.8}>
            <Ionicons name="location" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search client, address or phone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </LinearGradient>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              selectedFilter === filter && styles.filterPillActive
            ]}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.85}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <MetricCard
          value={filteredClients.filter(c => c.status === 'completed').length}
          label="Collected"
          icon="checkmark-done"
        />
        <MetricCard
          value={filteredClients.filter(c => c.status === 'pending').length}
          label="Pending"
          icon="time"
        />
        <MetricCard
          value={filteredClients.filter(c => c.status === 'missed').length}
          label="Missed"
          icon="close"
        />
      </View>

      {/* Client List */}
      <ScrollView style={styles.clientList} showsVerticalScrollIndicator={false}>
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Collection Feedback Modal */}
      <Modal visible={collectionModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Collection Feedback</Text>
              <TouchableOpacity onPress={() => setCollectionModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedClient && (
              <View style={styles.modalBody}>
                <Text style={styles.modalClientName}>{selectedClient.name}</Text>
                <Text style={styles.modalClientAddress}>{selectedClient.address}</Text>

                {/* Status Selection */}
                <Text style={styles.modalLabel}>Pickup status</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      collectionStatus === 'completed' && styles.statusButtonActive,
                      { backgroundColor: collectionStatus === 'completed' ? '#10B981' : '#F3F4F6' }
                    ]}
                    onPress={() => setCollectionStatus('completed')}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      { color: collectionStatus === 'completed' ? '#fff' : '#374151' }
                    ]}>
                      Collected
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      collectionStatus === 'missed' && styles.statusButtonActive,
                      { backgroundColor: collectionStatus === 'missed' ? '#EF4444' : '#F3F4F6' }
                    ]}
                    onPress={() => setCollectionStatus('missed')}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      { color: collectionStatus === 'missed' ? '#fff' : '#374151' }
                    ]}>
                      Missed
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Notes Input */}
                <Text style={styles.modalLabel}>Notes (optional)</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add a short note..."
                  value={feedbackNotes}
                  onChangeText={setFeedbackNotes}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#9CA3AF"
                />

                {/* Photo Section */}
                <View style={styles.photoSection}>
                  <Text style={styles.modalLabel}>Photo proof (optional)</Text>
                  <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.photoButtonText}>Take a photo</Text>
                  </TouchableOpacity>
                  {collectionPhoto && (
                    <Image source={{ uri: collectionPhoto }} style={styles.photoPreview} />
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={submitCollectionFeedback}>
                  <Text style={styles.submitButtonText}>Save feedback</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30, 
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  searchContainer: {
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#374151',
  },
  filterContainer: {
    paddingLeft: 20,
    paddingVertical: 14,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginRight: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  clientList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  clientCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  planStrip: {
    height: 4,
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingTop: 6,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  clientAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  planText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  clientDetails: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: '#3B82F6',
  },
  navigateButton: {
    backgroundColor: '#8B5CF6',
  },
  collectButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  bottomPadding: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  modalContent: {
    backgroundColor: '#fff',
    height: height * 0.70,
    width: width * 0.92,
    maxHeight: height * 0.85,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    flex: 1,
  },
  modalClientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  modalClientAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    fontWeight: 'bold',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 90,
  },
  photoSection: {
    marginBottom: 18,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CollectorDashboard;
