import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Switch,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axiosInstance from '../../apis/api';
import {getAuthToken} from "../../utils/index"
const { width, height } = Dimensions.get('window');

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data States
  const [plans, setPlans] = useState([]);
  const [requests, setRequests] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [clients, setClients] = useState([]);
  
  // Modal States
  const [planModal, setPlanModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  
  // Form States
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState('');

  // Plan Form State
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    originalprice: '',
    popular: 'false',
    bucketsize: '',
    duration: '',
    features: [''],
    isActive: true
  });

  const tabs = [
    { id: 'subscriptions', name: 'Subscriptions', icon: 'card' },
    { id: 'requests', name: 'Requests', icon: 'mail' },
    { id: 'assignments', name: 'Assignments', icon: 'people' }
  ];

  // Load Data on Component Mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPlans(),
        loadRequests(),
        loadCollectors(),
        loadClients()
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Data Loading Functions
  const loadPlans = async () => {
    try {
      const response = await axiosInstance.get('/subscription/getSubscriptions');
      console.log('Plans response:', response);
      console.log('Plans data:', response.data);
      if (response.status === 200) {
        setPlans(response.data?.data || []);
        return;
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await SubscriptionAPI.getAllRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const loadCollectors = async () => {
    try {
      const response = await SubscriptionAPI.getAllCollectors();
      setCollectors(response.data || []);
    } catch (error) {
      console.error('Failed to load collectors:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await SubscriptionAPI.getAllClients();
      setClients(response.data || []);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  // Pull to Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadPlans(),
        loadRequests(),
        loadCollectors(),
        loadClients()
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Subscription Management Functions
 
// New Plan
  const newPlan = async () => {
    if (!planForm.name || !planForm.price) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const planData = {
        plan: planForm.name,
        price: parseFloat(planForm.price),
        duration: planForm.duration,
        features: planForm.features.filter(f => f.trim()),
        isActive: planForm.isActive
      };
      const token = await getAuthToken(); // Function to get auth token
      const headers = axiosInstance.defaults.headers;
       const response = await axiosInstance.post('/subscription/newSubscription', planData, {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`}
        });

       if (response.status === 201) {
              Alert.alert('Success', 'Plan saved successfully');  
              await loadPlans();
              setPlanModal(false);
        return;
       }
       return Alert.alert('Error', 'Failed to save plan : '+response?.data?.message || 'Unknown error');
    } catch (error) {
      console.error('Failed to save plan:', error);
      Alert.alert('Error', 'Failed to save plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

// Delete Plan
const deletePlan = async (planId) => {
  console.log("Deleting plan with ID:", planId);

  Alert.alert(
    'Delete Plan',
    'Are you sure you want to delete this plan? This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosInstance.delete(`/subscription/deleteSubscription/${planId}`);
            Alert.alert('Success', 'Plan deleted successfully');
            await loadPlans();
          } catch (error) {
            console.error(error.response?.data || error.message);
            Alert.alert('Error', 'Failed to delete plan');
          }
        }
      }
    ]
  );
};
// Open modal for editing
const openPlanModal = (plan = null) => {
  if (plan) {
    setCurrentPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration,
      features: plan.features || [''],
      isActive: plan.isActive,
      originalprice: plan.originalPrice,
      bucketsize: plan.bucketSize,
      popular: plan.popular
    });
  } else {
    setCurrentPlan(null);
    setPlanForm({
      name: '',
      price: '',
      duration: 'monthly',
      features: [''],
      isActive: true
    });
  }
  setPlanModal(true);
};

// Update plan
const updatePlan = async () => {
  if (!currentPlan) return;
  try {
    const updates = {
      name: planForm.name,
      price: parseFloat(planForm.price),
      duration: planForm.duration,
      features: planForm.features,
      isActive: planForm.isActive
    };

    await axiosInstance.put(`/subscription/updateSubscription/${currentPlan._id}`, updates);
    Alert.alert('Success', 'Plan updated successfully');
    setPlanModal(false);
    await loadPlans(); // refresh list
  } catch (error) {
    console.error(error.response?.data || error.message);
    Alert.alert('Error', 'Failed to update plan');
  }
};


  const togglePlanStatus = async (planId) => {
    try {
      await SubscriptionAPI.togglePlanStatus(planId);
      await loadPlans();
    } catch (error) {
      Alert.alert('Error', 'Failed to update plan status');
    }
  };

  // Feature Management
  const addFeature = () => {
    setPlanForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...planForm.features];
    newFeatures[index] = value;
    setPlanForm(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const removeFeature = (index) => {
    if (planForm.features.length > 1) {
      const newFeatures = planForm.features.filter((_, i) => i !== index);
      setPlanForm(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  // Request Management
  const openRequestModal = (request) => {
    setCurrentRequest(request);
    setRequestModal(true);
  };

  const updateRequestStatus = async (requestId, status, notes = '') => {
    try {
      await SubscriptionAPI.updateRequestStatus(requestId, status, notes);
      Alert.alert('Success', `Request ${status} successfully`);
      setRequestModal(false);
      await loadRequests();
      if (status === 'approved') {
        await loadClients(); // Refresh clients list
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update request');
    }
  };

  // Assignment Management
  const openAssignModal = (client) => {
    setSelectedClient(client);
    setSelectedCollector(client.assignedCollector || '');
    setAssignModal(true);
  };

  const assignCollector = async () => {
    if (!selectedCollector) {
      Alert.alert('Error', 'Please select a collector');
      return;
    }

    try {
      await SubscriptionAPI.assignCollector(selectedClient.id, selectedCollector);
      Alert.alert('Success', 'Collector assigned successfully');
      setAssignModal(false);
      await loadClients();
      await loadCollectors();
    } catch (error) {
      Alert.alert('Error', 'Failed to assign collector');
    }
  };

  // Utility Functions
  const getStatusColor = (status) => {
    const colors = {
      'approved': '#10B981',
      'rejected': '#EF4444',
      'pending': '#F59E0B',
      'active': '#10B981',
      'inactive': '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const getStatusText = (status) => {
    const statusText = {
      'approved': 'Approved',
      'rejected': 'Rejected',
      'pending': 'Pending',
      'active': 'Active',
      'inactive': 'Inactive'
    };
    return statusText[status] || status;
  };

  const formatPrice = (price, currency = 'FCFA') => {
    return `${price.toLocaleString()} ${currency}`;
  };

  // Render Functions
  const renderSubscriptionTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Subscription Plans</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openPlanModal()}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>New Plan</Text>
        </TouchableOpacity>
      </View>

      {loading && plans.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {plans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{formatPrice(plan.price)}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
                <View style={styles.planActions}>
                  <Text style={styles.planClients}>
                    {plan.clientCount || 0} clients
                  </Text>
                  <Switch
                    value={plan.isActive}
                    onValueChange={() => togglePlanStatus(plan.id)}
                    trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  />
                </View>
              </View>
              
              <View style={styles.planFeatures}>
                {plan.features?.map((feature, index) => (
                  <Text key={index} style={styles.planFeature}>• {feature}</Text>
                ))}
              </View>
              
              <View style={styles.planButtons}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => openPlanModal(plan)}
                >
                  <Ionicons name="create" size={16} color="#3B82F6" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deletePlan(plan._id)}
                >
                  <Ionicons name="trash" size={16} color="#EF4444" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {plans.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="card" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No subscription plans</Text>
              <Text style={styles.emptyText}>Create your first plan to get started</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );

  const renderRequestsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Client Requests</Text>
        <View style={styles.requestStats}>
          <Text style={styles.pendingCount}>
            {requests.filter(r => r.status === 'pending').length} pending
          </Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {requests.map((request) => (
          <TouchableOpacity 
            key={request.id} 
            style={styles.requestCard}
            onPress={() => openRequestModal(request)}
          >
            <View style={styles.requestHeader}>
              <Text style={styles.requestName}>{request.clientName}</Text>
              <View style={[styles.requestStatus, { backgroundColor: getStatusColor(request.status) }]}>
                <Text style={styles.requestStatusText}>{getStatusText(request.status)}</Text>
              </View>
            </View>
            
            <Text style={styles.requestAddress}>{request.address}</Text>
            <Text style={styles.requestPhone}>{request.phone}</Text>
            <Text style={styles.requestPlan}>Requested plan: {request.requestedPlan}</Text>
            <Text style={styles.requestDate}>Date: {request.requestDate}</Text>
            
            {request.notes && (
              <Text style={styles.requestNotes}>📝 {request.notes}</Text>
            )}
          </TouchableOpacity>
        ))}
        
        {requests.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="mail" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No requests</Text>
            <Text style={styles.emptyText}>All requests have been processed</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderAssignmentTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Collector Assignments</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Collectors Overview */}
        <View style={styles.collectorsOverview}>
          <Text style={styles.subsectionTitle}>Available Collectors</Text>
          {collectors.map((collector) => (
            <View key={collector.id} style={styles.collectorCard}>
              <View style={styles.collectorInfo}>
                <Text style={styles.collectorName}>{collector.name}</Text>
                <Text style={styles.collectorZone}>Zone: {collector.zone}</Text>
                <Text style={styles.collectorVehicle}>{collector.vehicle}</Text>
              </View>
              <View style={styles.collectorStats}>
                <Text style={styles.collectorClients}>{collector.clientCount || 0} clients</Text>
                <View style={[styles.collectorStatus, { backgroundColor: getStatusColor(collector.status) }]}>
                  <Text style={styles.collectorStatusText}>{getStatusText(collector.status)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Client Assignment */}
        <View style={styles.clientAssignment}>
          <Text style={styles.subsectionTitle}>Client Assignments</Text>
          {clients.map((client) => (
            <View key={client.id} style={styles.clientCard}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientAddress}>{client.address}</Text>
                <Text style={styles.clientPlan}>Plan: {client.plan}</Text>
                <Text style={styles.clientZone}>Zone: {client.zone}</Text>
              </View>
              <View style={styles.assignmentStatus}>
                {client.assignedCollector ? (
                  <View>
                    <Text style={styles.assignedText}>
                      Assigned to: {collectors.find(c => c.id === client.assignedCollector)?.name}
                    </Text>
                    <TouchableOpacity 
                      style={styles.reassignButton}
                      onPress={() => openAssignModal(client)}
                    >
                      <Text style={styles.reassignButtonText}>Reassign</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.assignButton}
                    onPress={() => openAssignModal(client)}
                  >
                    <Text style={styles.assignButtonText}>Assign</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          
          {clients.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="people" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No clients</Text>
              <Text style={styles.emptyText}>No clients found in the system</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  // Plan Modal
  const renderPlanModal = () => (
    <Modal visible={planModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentPlan ? 'Edit Plan' : 'New Plan'}
            </Text>
            <TouchableOpacity onPress={() => setPlanModal(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <KeyboardAwareScrollView 
            style={styles.modalBody}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.modalBodyContent}
            extraScrollHeight={20}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Plan Name </Text>
              <TextInput
                style={styles.textInput}
                value={planForm.name}
                onChangeText={(text) => setPlanForm(prev => ({ ...prev, name: text }))}
                placeholder="Ex: Premium Residential"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (FCFA)</Text>
              <TextInput
                style={styles.textInput}
                value={planForm.price}
                onChangeText={(text) => setPlanForm(prev => ({ ...prev, price: text }))}
                placeholder="12,000"
                keyboardType="numeric"
              />
            </View>

              <Text style={styles.inputLabel}>Originalprice (FCFA)</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.textInput}
                value={planForm.originalprice}
                onChangeText={(text) => setPlanForm(prev => ({ ...prev, originalprice: text }))}
                placeholder="10,000"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Popular plan</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={planForm.popular}
                  onValueChange={(value) => setPlanForm(prev => ({ ...prev, popular: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="True" value="true" />
                  <Picker.Item label="False" value="false" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={planForm.duration}
                  onValueChange={(value) => setPlanForm(prev => ({ ...prev, duration: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="Monthly" value="monthly" />
                  <Picker.Item label="Quarterly" value="quarterly" />
                  <Picker.Item label="Yearly" value="yearly" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Features</Text>
              {planForm.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <TextInput
                    style={[styles.textInput, styles.featureInput]}
                    value={feature}
                    onChangeText={(text) => updateFeature(index, text)}
                    placeholder="Ex: SMS notifications"
                  />
                  {planForm.features.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeFeature(index)}
                    >
                      <Ionicons name="remove-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addFeatureButton} onPress={addFeature}>
                <Ionicons name="add" size={16} color="#3B82F6" />
                <Text style={styles.addFeatureText}>Add feature</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.inputLabel}>Active Plan</Text>
              <Switch
                value={planForm.isActive}
                onValueChange={(value) => setPlanForm(prev => ({ ...prev, isActive: value }))}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              />
            </View>
          </KeyboardAwareScrollView>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={newPlan}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {currentPlan ? 'Update Plan' : 'Create Plan'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Request Modal
  const renderRequestModal = () => (
    <Modal visible={requestModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {currentRequest && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Client Request</Text>
                <TouchableOpacity onPress={() => setRequestModal(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.requestModalName}>{currentRequest.clientName}</Text>
                <Text style={styles.requestModalDetail}>📍 {currentRequest.address}</Text>
                <Text style={styles.requestModalDetail}>📱 {currentRequest.phone}</Text>
                <Text style={styles.requestModalDetail}>📋 Plan: {currentRequest.requestedPlan}</Text>
                <Text style={styles.requestModalDetail}>📅 Date: {currentRequest.requestDate}</Text>
                
                {currentRequest.notes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesTitle}>Client notes:</Text>
                    <Text style={styles.notesContent}>{currentRequest.notes}</Text>
                  </View>
                )}

                {currentRequest.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => updateRequestStatus(currentRequest.id, 'approved')}
                    >
                      <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => updateRequestStatus(currentRequest.id, 'rejected')}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Assignment Modal
  const renderAssignmentModal = () => (
    <Modal visible={assignModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedClient && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Assign Collector</Text>
                <TouchableOpacity onPress={() => setAssignModal(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.assignModalClient}>{selectedClient.name}</Text>
                <Text style={styles.assignModalDetail}>Zone: {selectedClient.zone}</Text>
                
                <Text style={styles.inputLabel}>Select Collector:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedCollector}
                    onValueChange={(value) => setSelectedCollector(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a collector..." value="" />
                    {collectors
                      .filter(c => c.status === 'active')
                      .map(collector => (
                      <Picker.Item 
                        key={collector.id}
                        label={`${collector.name} (${collector.clientCount || 0} clients)`} 
                        value={collector.id} 
                      />
                    ))}
                  </Picker>
                </View>

                <TouchableOpacity 
                  style={[styles.assignConfirmButton, !selectedCollector && styles.assignConfirmButtonDisabled]} 
                  onPress={assignCollector}
                  disabled={!selectedCollector}
                >
                  <Text style={styles.assignConfirmText}>Confirm Assignment</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <LinearGradient colors={['#3bf664ff', '#27c512ff']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Zerodech Admin</Text>
          <Text style={styles.headerSubtitle}>Administrator Dashboard</Text>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? '#3B82F6' : '#6B7280'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'subscriptions' && renderSubscriptionTab()}
      {activeTab === 'requests' && renderRequestsTab()}
      {activeTab === 'assignments' && renderAssignmentTab()}

      {/* Modals */}
      {renderPlanModal()}
      {renderRequestModal()}
      {renderAssignmentModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#DBEAFE',
    marginTop: 2,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3B82F6',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  planPrice: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginVertical: 2,
  },
  planDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  planActions: {
    alignItems: 'flex-end',
  },
  planClients: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  planFeatures: {
    marginBottom: 12,
  },
  planFeature: {
    fontSize: 14,
    color: '#4B5563',
    marginVertical: 2,
  },
  planButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#EF4444',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  requestStats: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingCount: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  requestStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  requestStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  requestAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  requestPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  requestPlan: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  requestNotes: {
    fontSize: 14,
    color: '#EF4444',
    fontStyle: 'italic',
  },
  collectorsOverview: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  collectorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  collectorInfo: {
    flex: 1,
  },
  collectorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  collectorZone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  collectorVehicle: {
    fontSize: 14,
    color: '#6B7280',
  },
  collectorStats: {
    alignItems: 'flex-end',
  },
  collectorClients: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  collectorStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  collectorStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  clientAssignment: {
    marginTop: 8,
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  clientAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  clientPlan: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 2,
  },
  clientZone: {
    fontSize: 14,
    color: '#6B7280',
  },
  assignmentStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  assignedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  assignButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  reassignButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reassignButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400,
    height: height * 0.85,
    maxHeight: height * 0.85,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  picker: {
    height: 50,
    color: '#1F2937',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  addFeatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginTop: 8,
  },
  addFeatureText: {
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestModalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  requestModalDetail: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  notesSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  notesContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignModalClient: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  assignModalDetail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  assignConfirmButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  assignConfirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  assignConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;