// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   Dimensions,
//   StatusBar,
//   SafeAreaView,
//   FlatList
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';

// const { width, height } = Dimensions.get('window');

// // Mock data for subscription plans
// const mockPlans = [
//   {
//     id: 'PLAN001',
//     name: 'Basic',
//     price: 4000,
//     duration: 'Monthly',
//     features: ['1 collection/week', 'Household waste', 'Basic support'],
//     color: '#10B981',
//     clients: 45
//   },
//   {
//     id: 'PLAN002',
//     name: 'Standard',
//     price: 7000,
//     duration: 'Monthly',
//     features: ['2 collections/week', 'Household + recyclable waste', 'Priority support'],
//     color: '#3B82F6',
//     clients: 78,
//     popular: true
//   },
//   {
//     id: 'PLAN003',
//     name: 'Premium',
//     price: 12000,
//     duration: 'Monthly',
//     features: ['3 collections/week', 'All waste types', '24/7 support', 'Express collection'],
//     color: '#8B5CF6',
//     clients: 32
//   }
// ];

// // Mock data for client requests
// const mockRequests = [
//   {
//     id: 'REQ001',
//     clientName: 'Marie Tchoua',
//     phone: '+237 679 123 456',
//     address: 'Mvog-Ada District, Yaoundé',
//     requestedPlan: 'Standard',
//     requestDate: '2025-09-03',
//     status: 'pending',
//     notes: 'New client, requests Tuesday and Friday collection'
//   },
//   {
//     id: 'REQ002',
//     clientName: 'Jean Paul Essomba',
//     phone: '+237 698 987 654',
//     address: 'Bastos, Yaoundé',
//     requestedPlan: 'Premium',
//     requestDate: '2025-09-02',
//     status: 'approved',
//     notes: 'VIP client, urgent collection required'
//   },
//   {
//     id: 'REQ003',
//     clientName: 'Agnes Mengue',
//     phone: '+237 677 555 123',
//     address: 'Emombo, Yaoundé',
//     requestedPlan: 'Basic',
//     requestDate: '2025-09-01',
//     status: 'rejected',
//     notes: 'Area not currently covered'
//   }
// ];

// // Mock data for collectors
// const mockCollectors = [
//   {
//     id: 'COL001',
//     name: 'Paul Mbarga',
//     phone: '+237 655 789 321',
//     vehicle: 'Truck - CAM001',
//     zone: 'City Center',
//     status: 'active',
//     clients: 25,
//     efficiency: 95
//   },
//   {
//     id: 'COL002',
//     name: 'Francis Nkomo',
//     phone: '+237 677 456 789',
//     vehicle: 'Van - CAM002',
//     zone: 'Bastos/Nlongkak',
//     status: 'active',
//     clients: 18,
//     efficiency: 88
//   },
//   {
//     id: 'COL003',
//     name: 'Martin Owono',
//     phone: '+237 698 123 456',
//     vehicle: 'Truck - CAM003',
//     zone: 'Mvog-Mbi/Emombo',
//     status: 'offline',
//     clients: 15,
//     efficiency: 92
//   }
// ];

// // Mock unassigned clients
// const mockUnassignedClients = [
//   {
//     id: 'CL005',
//     name: 'Marie Tchoua',
//     address: 'Mvog-Ada District, Yaoundé',
//     plan: 'Standard',
//     phone: '+237 679 123 456',
//     zone: 'City Center'
//   },
//   {
//     id: 'CL006',
//     name: 'Robert Manga',
//     address: 'Nkoldongo, Yaoundé',
//     plan: 'Premium',
//     phone: '+237 655 987 654',
//     zone: 'Mvog-Mbi/Emombo'
//   }
// ];

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('subscriptions');
//   const [plans, setPlans] = useState(mockPlans);
//   const [requests, setRequests] = useState(mockRequests);
//   const [collectors, setCollectors] = useState(mockCollectors);
//   const [unassignedClients, setUnassignedClients] = useState(mockUnassignedClients);
  
//   // Modal states
//   const [planModal, setPlanModal] = useState(false);
//   const [requestModal, setRequestModal] = useState(false);
//   const [assignModal, setAssignModal] = useState(false);
  
//   // Form states
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [newPlan, setNewPlan] = useState({
//     name: '',
//     price: '',
//     duration: 'Monthly',
//     features: []
//   });
//   const [newFeature, setNewFeature] = useState('');

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return '#F59E0B';
//       case 'approved': return '#10B981';
//       case 'rejected': return '#EF4444';
//       case 'active': return '#10B981';
//       case 'offline': return '#6B7280';
//       default: return '#6B7280';
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case 'pending': return 'Pending';
//       case 'approved': return 'Approved';
//       case 'rejected': return 'Rejected';
//       case 'active': return 'Active';
//       case 'offline': return 'Offline';
//       default: return 'Unknown';
//     }
//   };

//   // Subscription Plan Functions
//   const openPlanModal = (plan = null) => {
//     if (plan) {
//       setSelectedPlan(plan);
//       setNewPlan({
//         name: plan.name,
//         price: plan.price.toString(),
//         duration: plan.duration,
//         features: [...plan.features]
//       });
//     } else {
//       setSelectedPlan(null);
//       setNewPlan({
//         name: '',
//         price: '',
//         duration: 'Monthly',
//         features: []
//       });
//     }
//     setPlanModal(true);
//   };

//   const savePlan = () => {
//     if (!newPlan.name || !newPlan.price) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     const planData = {
//       id: selectedPlan ? selectedPlan.id : `PLAN${Date.now()}`,
//       name: newPlan.name,
//       price: parseInt(newPlan.price),
//       duration: newPlan.duration,
//       features: newPlan.features,
//       color: selectedPlan ? selectedPlan.color : '#10B981',
//       clients: selectedPlan ? selectedPlan.clients : 0
//     };

//     if (selectedPlan) {
//       setPlans(plans.map(p => p.id === selectedPlan.id ? planData : p));
//     } else {
//       setPlans([...plans, planData]);
//     }

//     setPlanModal(false);
//     Alert.alert('Success', `Plan ${selectedPlan ? 'updated' : 'created'} successfully`);
//   };

//   const addFeature = () => {
//     if (newFeature.trim()) {
//       setNewPlan({
//         ...newPlan,
//         features: [...newPlan.features, newFeature.trim()]
//       });
//       setNewFeature('');
//     }
//   };

//   const removeFeature = (index) => {
//     setNewPlan({
//       ...newPlan,
//       features: newPlan.features.filter((_, i) => i !== index)
//     });
//   };

//   // Request Management Functions
//   const openRequestModal = (request) => {
//     setSelectedRequest(request);
//     setRequestModal(true);
//   };

//   const updateRequestStatus = (status) => {
//     if (!selectedRequest) return;

//     const updatedRequests = requests.map(req => {
//       if (req.id === selectedRequest.id) {
//         return { ...req, status };
//       }
//       return req;
//     });

//     setRequests(updatedRequests);
    
//     // If approved, add to unassigned clients
//     if (status === 'approved') {
//       const newClient = {
//         id: `CL${Date.now()}`,
//         name: selectedRequest.clientName,
//         address: selectedRequest.address,
//         plan: selectedRequest.requestedPlan,
//         phone: selectedRequest.phone,
//         zone: 'To be determined'
//       };
//       setUnassignedClients([...unassignedClients, newClient]);
//     }

//     setRequestModal(false);
//     Alert.alert('Success', `Request ${status === 'approved' ? 'approved' : 'rejected'}`);
//   };

//   // Collector Assignment Functions
//   const openAssignModal = (client) => {
//     setSelectedClient(client);
//     setAssignModal(true);
//   };

//   const assignCollector = (collector) => {
//     if (!selectedClient) return;

//     // Update collector's client count
//     const updatedCollectors = collectors.map(col => {
//       if (col.id === collector.id) {
//         return { ...col, clients: col.clients + 1 };
//       }
//       return col;
//     });

//     // Remove client from unassigned list
//     const updatedUnassigned = unassignedClients.filter(
//       client => client.id !== selectedClient.id
//     );

//     setCollectors(updatedCollectors);
//     setUnassignedClients(updatedUnassigned);
//     setAssignModal(false);
    
//     Alert.alert('Success', `Client assigned to ${collector.name}`);
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'subscriptions':
//         return renderSubscriptions();
//       case 'requests':
//         return renderRequests();
//       case 'assignments':
//         return renderAssignments();
//       default:
//         return null;
//     }
//   };

//   const renderSubscriptions = () => (
//     <ScrollView style={styles.tabContent}>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Subscription Plans</Text>
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => openPlanModal()}
//         >
//           <Ionicons name="add" size={20} color="#fff" />
//           <Text style={styles.addButtonText}>New Plan</Text>
//         </TouchableOpacity>
//       </View>

//       {plans.map((plan) => (
//         <View key={plan.id} style={styles.planCard}>
//           {plan.popular && (
//             <View style={styles.popularBadge}>
//               <Text style={styles.popularText}>POPULAR</Text>
//             </View>
//           )}
          
//           <View style={styles.planHeader}>
//             <View style={styles.planInfo}>
//               <Text style={styles.planName}>{plan.name}</Text>
//               <Text style={styles.planPrice}>{plan.price.toLocaleString()} FCFA</Text>
//               <Text style={styles.planDuration}>{plan.duration}</Text>
//             </View>
//             <TouchableOpacity 
//               style={styles.editButton}
//               onPress={() => openPlanModal(plan)}
//             >
//               <Ionicons name="pencil" size={16} color="#6B7280" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.planFeatures}>
//             {plan.features.map((feature, index) => (
//               <View key={index} style={styles.featureItem}>
//                 <Ionicons name="checkmark-circle" size={16} color={plan.color} />
//                 <Text style={styles.featureText}>{feature}</Text>
//               </View>
//             ))}
//           </View>

//           <View style={styles.planStats}>
//             <Text style={styles.statsText}>{plan.clients} active clients</Text>
//           </View>
//         </View>
//       ))}
//     </ScrollView>
//   );

//   const renderRequests = () => (
//     <ScrollView style={styles.tabContent}>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Client Requests</Text>
//         <View style={styles.requestStats}>
//           <Text style={styles.statsText}>
//             {requests.filter(r => r.status === 'pending').length} pending
//           </Text>
//         </View>
//       </View>

//       {requests.map((request) => (
//         <TouchableOpacity 
//           key={request.id} 
//           style={styles.requestCard}
//           onPress={() => openRequestModal(request)}
//         >
//           <View style={styles.requestHeader}>
//             <View style={styles.requestInfo}>
//               <Text style={styles.requestName}>{request.clientName}</Text>
//               <Text style={styles.requestAddress}>{request.address}</Text>
//               <Text style={styles.requestPhone}>{request.phone}</Text>
//             </View>
//             <View style={[
//               styles.requestStatus,
//               { backgroundColor: getStatusColor(request.status) }
//             ]}>
//               <Text style={styles.requestStatusText}>
//                 {getStatusText(request.status)}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.requestDetails}>
//             <Text style={styles.requestPlan}>Requested Plan: {request.requestedPlan}</Text>
//             <Text style={styles.requestDate}>Date: {request.requestDate}</Text>
//             {request.notes && (
//               <Text style={styles.requestNotes}>📝 {request.notes}</Text>
//             )}
//           </View>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );

//   const renderAssignments = () => (
//     <ScrollView style={styles.tabContent}>
//       {/* Collectors Section */}
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Collectors</Text>
//       </View>

//       {collectors.map((collector) => (
//         <View key={collector.id} style={styles.collectorCard}>
//           <View style={styles.collectorHeader}>
//             <View style={styles.collectorInfo}>
//               <Text style={styles.collectorName}>{collector.name}</Text>
//               <Text style={styles.collectorPhone}>{collector.phone}</Text>
//               <Text style={styles.collectorVehicle}>{collector.vehicle}</Text>
//               <Text style={styles.collectorZone}>Zone: {collector.zone}</Text>
//             </View>
//             <View style={styles.collectorStats}>
//               <View style={[
//                 styles.collectorStatus,
//                 { backgroundColor: getStatusColor(collector.status) }
//               ]}>
//                 <Text style={styles.collectorStatusText}>
//                   {getStatusText(collector.status)}
//                 </Text>
//               </View>
//               <Text style={styles.collectorClients}>{collector.clients} clients</Text>
//               <Text style={styles.collectorEfficiency}>{collector.efficiency}% efficiency</Text>
//             </View>
//           </View>
//         </View>
//       ))}

//       {/* Unassigned Clients Section */}
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Unassigned Clients</Text>
//         <View style={styles.unassignedStats}>
//           <Text style={styles.statsText}>
//             {unassignedClients.length} clients
//           </Text>
//         </View>
//       </View>

//       {unassignedClients.map((client) => (
//         <View key={client.id} style={styles.unassignedCard}>
//           <View style={styles.unassignedInfo}>
//             <Text style={styles.unassignedName}>{client.name}</Text>
//             <Text style={styles.unassignedAddress}>{client.address}</Text>
//             <Text style={styles.unassignedPlan}>Plan: {client.plan}</Text>
//             <Text style={styles.unassignedPhone}>{client.phone}</Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.assignButton}
//             onPress={() => openAssignModal(client)}
//           >
//             <Ionicons name="person-add" size={16} color="#fff" />
//             <Text style={styles.assignButtonText}>Assign</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </ScrollView>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
//       {/* Header */}
//       <LinearGradient colors={['#1F2937', '#111827']} style={styles.header}>
//         <View style={styles.headerContent}>
//           <View>
//             <Text style={styles.headerTitle}>Zerodech Admin</Text>
//             <Text style={styles.headerSubtitle}>Administrator Dashboard</Text>
//           </View>
//           <TouchableOpacity style={styles.notificationButton}>
//             <Ionicons name="notifications" size={20} color="#fff" />
//             <View style={styles.notificationBadge}>
//               <Text style={styles.notificationCount}>
//                 {requests.filter(r => r.status === 'pending').length}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {/* Tab Navigation */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[
//             styles.tabItem,
//             activeTab === 'subscriptions' && styles.tabItemActive
//           ]}
//           onPress={() => setActiveTab('subscriptions')}
//         >
//           <Ionicons 
//             name="card" 
//             size={16} 
//             color={activeTab === 'subscriptions' ? '#1F2937' : '#6B7280'} 
//           />
//           <Text style={[
//             styles.tabText,
//             activeTab === 'subscriptions' && styles.tabTextActive
//           ]}>
//             Subscription
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.tabItem,
//             activeTab === 'requests' && styles.tabItemActive
//           ]}
//           onPress={() => setActiveTab('requests')}
//         >
//           <Ionicons 
//             name="mail" 
//             size={16} 
//             color={activeTab === 'requests' ? '#1F2937' : '#6B7280'} 
//           />
//           <Text style={[
//             styles.tabText,
//             activeTab === 'requests' && styles.tabTextActive
//           ]}>
//             Requests
//           </Text>
//           {requests.filter(r => r.status === 'pending').length > 0 && (
//             <View style={styles.tabBadge}>
//               <Text style={styles.tabBadgeText}>
//                 {requests.filter(r => r.status === 'pending').length}
//               </Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.tabItem,
//             activeTab === 'assignments' && styles.tabItemActive
//           ]}
//           onPress={() => setActiveTab('assignments')}
//         >
//           <Ionicons 
//             name="people" 
//             size={16} 
//             color={activeTab === 'assignments' ? '#1F2937' : '#6B7280'} 
//           />
//           <Text style={[
//             styles.tabText,
//             activeTab === 'assignments' && styles.tabTextActive
//           ]}>
//             Assignment
//           </Text>
//           {unassignedClients.length > 0 && (
//             <View style={styles.tabBadge}>
//               <Text style={styles.tabBadgeText}>
//                 {unassignedClients.length}
//               </Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Tab Content */}
//       {renderTabContent()}

//       {/* Plan Modal */}
//       <Modal visible={planModal} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>
//                 {selectedPlan ? 'Edit Plan' : 'New Plan'}
//               </Text>
//               <TouchableOpacity onPress={() => setPlanModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody}>
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Plan Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={newPlan.name}
//                   onChangeText={(text) => setNewPlan({...newPlan, name: text})}
//                   placeholder="Ex: Premium"
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Price (FCFA)</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={newPlan.price}
//                   onChangeText={(text) => setNewPlan({...newPlan, price: text})}
//                   placeholder="Ex: 12000"
//                   keyboardType="numeric"
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Features</Text>
//                 <View style={styles.featureInput}>
//                   <TextInput
//                     style={[styles.input, { flex: 1 }]}
//                     value={newFeature}
//                     onChangeText={setNewFeature}
//                     placeholder="Add a feature"
//                   />
//                   <TouchableOpacity style={styles.addFeatureButton} onPress={addFeature}>
//                     <Ionicons name="add" size={20} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
                
//                 {newPlan.features.map((feature, index) => (
//                   <View key={index} style={styles.featureTag}>
//                     <Text style={styles.featureTagText}>{feature}</Text>
//                     <TouchableOpacity onPress={() => removeFeature(index)}>
//                       <Ionicons name="close" size={16} color="#6B7280" />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </View>

//               <TouchableOpacity style={styles.saveButton} onPress={savePlan}>
//                 <Text style={styles.saveButtonText}>
//                   {selectedPlan ? 'Update' : 'Create'} Plan
//                 </Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Request Modal */}
//       <Modal visible={requestModal} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Request Details</Text>
//               <TouchableOpacity onPress={() => setRequestModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             {selectedRequest && (
//               <View style={styles.modalBody}>
//                 <View style={styles.requestDetailCard}>
//                   <Text style={styles.requestDetailName}>{selectedRequest.clientName}</Text>
//                   <Text style={styles.requestDetailInfo}>📍 {selectedRequest.address}</Text>
//                   <Text style={styles.requestDetailInfo}>📱 {selectedRequest.phone}</Text>
//                   <Text style={styles.requestDetailInfo}>📋 Plan: {selectedRequest.requestedPlan}</Text>
//                   <Text style={styles.requestDetailInfo}>📅 {selectedRequest.requestDate}</Text>
//                   {selectedRequest.notes && (
//                     <Text style={styles.requestDetailNotes}>📝 {selectedRequest.notes}</Text>
//                   )}
//                 </View>

//                 {selectedRequest.status === 'pending' && (
//                   <View style={styles.actionButtons}>
//                     <TouchableOpacity
//                       style={[styles.actionButton, styles.approveButton]}
//                       onPress={() => updateRequestStatus('approved')}
//                     >
//                       <Ionicons name="checkmark-circle" size={20} color="#fff" />
//                       <Text style={styles.actionButtonText}>Approve</Text>
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity
//                       style={[styles.actionButton, styles.rejectButton]}
//                       onPress={() => updateRequestStatus('rejected')}
//                     >
//                       <Ionicons name="close-circle" size={20} color="#fff" />
//                       <Text style={styles.actionButtonText}>Reject</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Assignment Modal */}
//       <Modal visible={assignModal} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Assign a Collector</Text>
//               <TouchableOpacity onPress={() => setAssignModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             {selectedClient && (
//               <View style={styles.modalBody}>
//                 <View style={styles.clientInfoCard}>
//                   <Text style={styles.clientInfoName}>{selectedClient.name}</Text>
//                   <Text style={styles.clientInfoDetail}>📍 {selectedClient.address}</Text>
//                   <Text style={styles.clientInfoDetail}>📋 Plan: {selectedClient.plan}</Text>
//                 </View>

//                 <Text style={styles.collectorsListTitle}>Select a collector:</Text>
                
//                 <ScrollView style={styles.collectorsList}>
//                   {collectors.filter(c => c.status === 'active').map((collector) => (
//                     <TouchableOpacity
//                       key={collector.id}
//                       style={styles.collectorOption}
//                       onPress={() => assignCollector(collector)}
//                     >
//                       <View style={styles.collectorOptionInfo}>
//                         <Text style={styles.collectorOptionName}>{collector.name}</Text>
//                         <Text style={styles.collectorOptionDetails}>
//                           Zone: {collector.zone} • {collector.clients} clients
//                         </Text>
//                         <Text style={styles.collectorOptionEfficiency}>
//                           Efficiency: {collector.efficiency}%
//                         </Text>
//                       </View>
//                       <Ionicons name="chevron-forward" size={20} color="#6B7280" />
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     paddingTop: 10,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#D1D5DB',
//     marginTop: 2,
//   },
//   notificationButton: {
//     position: 'relative',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: '#EF4444',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationCount: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   tabItem: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//     position: 'relative',
//   },
//   tabItemActive: {
//     borderBottomColor: '#1F2937',
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//     marginLeft: 6,
//   },
//   tabTextActive: {
//     color: '#1F2937',
//     fontWeight: 'bold',
//   },
//   tabBadge: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: '#EF4444',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//     tabBadgeText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   tabContent: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   addButton: {
//     flexDirection: 'row',
//     backgroundColor: '#10B981',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   planCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   popularBadge: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: '#FBBF24',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   popularText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   planHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   planInfo: {},
//   planName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   planPrice: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   planDuration: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 2,
//   },
//   editButton: {
//     padding: 6,
//   },
//   planFeatures: {
//     marginVertical: 8,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   featureText: {
//     marginLeft: 6,
//     fontSize: 12,
//     color: '#374151',
//   },
//   planStats: {
//     marginTop: 8,
//   },
//   statsText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   requestCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   requestHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   requestInfo: {},
//   requestName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   requestAddress: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   requestPhone: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   requestStatus: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   requestStatusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#fff',
    
//   },
//   requestDetails: {
//     marginTop: 8,
//   },
//   requestPlan: {
//     fontSize: 12,
//     color: '#374151',
//   },
//   requestDate: {
//     fontSize: 12,
//     color: '#374151',
//     marginTop: 2,
//   },
//   requestNotes: {
//     fontSize: 12,
//     color: '#4B5563',
//     fontStyle: 'italic',
//     marginTop: 4,
//   },
//   collectorCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   collectorHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   collectorInfo: {},
//   collectorName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   collectorPhone: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   collectorVehicle: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   collectorZone: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   collectorStats: {
//     alignItems: 'flex-end',
//   },
//   collectorStatus: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 4,
//   },
//   collectorStatusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   collectorClients: {
//     fontSize: 12,
//     color: '#374151',
//   },
//   collectorEfficiency: {
//     fontSize: 12,
//     color: '#374151',
//   },
//   unassignedCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   unassignedInfo: {},
//   unassignedName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   unassignedAddress: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   unassignedPlan: {
//     fontSize: 12,
//     color: '#374151',
//   },
//   unassignedPhone: {
//     fontSize: 12,
//     color: '#374151',
//   },
//   assignButton: {
//     flexDirection: 'row',
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   assignButtonText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   modalContent: {
//     width: '100%',
//     maxHeight: height * 0.85,
//     height: '55%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,

//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#111827',

//   },
//   modalBody: {
//     flex: 1,
//   },
//   inputGroup: {
//     marginBottom: 12,
//   },
//   inputLabel: {
//     fontSize: 12,
//     color: '#374151',
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   input: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     fontSize: 14,
//     color: '#111827',
//   },
//   featureInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   addFeatureButton: {
//     backgroundColor: '#10B981',
//     padding: 8,
//     borderRadius: 8,
//     marginLeft: 6,
//   },
//   featureTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E5E7EB',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     marginTop: 4,
//   },
// featureTagText: {
//     fontSize: 12,
//     color: '#111827',
//     marginRight: 6,
//   },
//   saveButton: {
//     marginTop: 16,
//     backgroundColor: '#10B981',
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 12,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   approveButton: {
//     backgroundColor: '#10B981',
//   },
//   rejectButton: {
//     backgroundColor: '#EF4444',
//   },
//   actionButtonText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   requestDetailCard: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 16,
//   },
//   requestDetailName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   requestDetailInfo: {
//     fontSize: 12,
//     color: '#374151',
//     marginBottom: 2,
//   },
//   requestDetailNotes: {
//     fontSize: 12,
//     color: '#4B5563',
//     fontStyle: 'italic',
//     marginTop: 4,
//   },
//   clientInfoCard: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },
//   clientInfoName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   clientInfoDetail: {
//     fontSize: 12,
//     color: '#374151',
//   },
//   collectorsListTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 8,
//     marginTop: 12,
//   },
//   collectorsList: {
//     maxHeight: height * 0.4,
//   },
//   collectorOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 8,
//     elevation: 1,
//   },
//   collectorOptionInfo: {},
//   collectorOptionName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   collectorOptionDetails: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   collectorOptionEfficiency: {
//     fontSize: 12,
//     color: '#374151',
//   },
// });

// export default AdminDashboard;

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
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Mock data for subscription plans
const mockPlans = [
  {
    id: 'plan001',
    name: 'Basic',
    price: 4000,
    duration: '1 month',
    features: ['Weekly collection', 'Basic support'],
    isActive: true,
    clientCount: 45
  },
  {
    id: 'plan002',
    name: 'Standard',
    price: 7000,
    duration: '1 month',
    features: ['Bi-weekly collection', 'Priority support', 'SMS notifications'],
    isActive: true,
    clientCount: 78
  },
  {
    id: 'plan003',
    name: 'Premium',
    price: 12000,
    duration: '1 month',
    features: ['Daily collection', '24/7 support', 'SMS/Email notifications', 'Priority service'],
    isActive: true,
    clientCount: 32
  }
];

// Mock data for client requests
const mockRequests = [
  {
    id: 'REQ001',
    clientName: 'Marie Tchamba',
    phone: '+237 679 456 789',
    address: 'Nlongkak District, Yaoundé',
    requestedPlan: 'Standard',
    requestDate: '2025-09-05',
    status: 'pending',
    notes: 'Would like to start collection as soon as possible'
  },
  {
    id: 'REQ002',
    clientName: 'Jean Paul Mballa',
    phone: '+237 698 123 456',
    address: 'Bastos, Yaoundé',
    requestedPlan: 'Premium',
    requestDate: '2025-09-04',
    status: 'approved',
    notes: 'Corporate client, monthly billing'
  },
  {
    id: 'REQ003',
    clientName: 'Agnes Fouda',
    phone: '+237 677 888 999',
    address: 'Emombo, Yaoundé',
    requestedPlan: 'Basic',
    requestDate: '2025-09-06',
    status: 'pending',
    notes: 'First time customer, needs service explanation'
  }
];

// Mock data for collectors
const mockCollectors = [
  {
    id: 'COL001',
    name: 'Paul Biya',
    phone: '+237 655 111 222',
    zone: 'City Center',
    status: 'active',
    clientCount: 15,
    vehicle: 'Dump Truck CB-001'
  },
  {
    id: 'COL002',
    name: 'Samuel Eto\'o',
    phone: '+237 666 333 444',
    zone: 'Bastos/Nlongkak',
    status: 'active',
    clientCount: 12,
    vehicle: 'Dump Truck CB-002'
  },
  {
    id: 'COL003',
    name: 'Rigobert Song',
    phone: '+237 677 555 666',
    zone: 'Mvog-Mbi/Emombo',
    status: 'inactive',
    clientCount: 8,
    vehicle: 'Dump Truck CB-003'
  }
];

// Mock clients for assignment
const mockClients = [
  {
    id: 'CL001',
    name: 'Marie Ngono',
    address: 'Mvog-Mbi District, Yaoundé',
    plan: 'Premium',
    assignedCollector: null,
    zone: 'Mvog-Mbi/Emombo'
  },
  {
    id: 'CL002',
    name: 'Paul Biya Jr',
    address: 'Bastos, Yaoundé',
    plan: 'Standard',
    assignedCollector: 'COL002',
    zone: 'Bastos/Nlongkak'
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [plans, setPlans] = useState(mockPlans);
  const [requests, setRequests] = useState(mockRequests);
  const [collectors, setCollectors] = useState(mockCollectors);
  const [clients, setClients] = useState(mockClients);
  
  // Modal states
  const [planModal, setPlanModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  
  // Form states
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState('');

  // Plan form
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    duration: '1 month',
    features: [''],
    isActive: true
  });

  const tabs = [
    { id: 'subscriptions', name: 'Subscriptions', icon: 'card' },
    { id: 'requests', name: 'Requests', icon: 'mail' },
    { id: 'assignments', name: 'Assignments', icon: 'people' }
  ];

  // Subscription Management Functions
  const openPlanModal = (plan = null) => {
    if (plan) {
      setCurrentPlan(plan);
      setPlanForm({
        name: plan.name,
        price: plan.price.toString(),
        duration: plan.duration,
        features: plan.features,
        isActive: plan.isActive
      });
    } else {
      setCurrentPlan(null);
      setPlanForm({
        name: '',
        price: '',
        duration: '1 month',
        features: [''],
        isActive: true
      });
    }
    setPlanModal(true);
  };

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
    const newFeatures = planForm.features.filter((_, i) => i !== index);
    setPlanForm(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const savePlan = () => {
    if (!planForm.name || !planForm.price) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const planData = {
      id: currentPlan ? currentPlan.id : `plan${Date.now()}`,
      name: planForm.name,
      price: parseInt(planForm.price),
      duration: planForm.duration,
      features: planForm.features.filter(f => f.trim() !== ''),
      isActive: planForm.isActive,
      clientCount: currentPlan ? currentPlan.clientCount : 0
    };

    if (currentPlan) {
      setPlans(prev => prev.map(p => p.id === currentPlan.id ? planData : p));
    } else {
      setPlans(prev => [...prev, planData]);
    }

    setPlanModal(false);
    Alert.alert('Success', `Plan ${currentPlan ? 'updated' : 'created'} successfully`);
  };

  const togglePlanStatus = (planId) => {
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  // Request Management Functions
  const openRequestModal = (request) => {
    setCurrentRequest(request);
    setRequestModal(true);
  };

  const updateRequestStatus = (requestId, status, notes = '') => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status, adminNotes: notes } : r
    ));
    setRequestModal(false);
    
    const action = status === 'approved' ? 'approved' : 'rejected';
    Alert.alert('Success', `Request ${action} successfully`);
  };

  // Assignment Functions
  const openAssignModal = (client) => {
    setSelectedClient(client);
    setSelectedCollector(client.assignedCollector || '');
    setAssignModal(true);
  };

  const assignCollector = () => {
    if (!selectedCollector) {
      Alert.alert('Error', 'Please select a collector');
      return;
    }

    setClients(prev => prev.map(c => 
      c.id === selectedClient.id ? { ...c, assignedCollector: selectedCollector } : c
    ));

    // Update collector client count
    setCollectors(prev => prev.map(collector => {
      if (collector.id === selectedCollector) {
        return { ...collector, clientCount: collector.clientCount + 1 };
      }
      if (selectedClient.assignedCollector && collector.id === selectedClient.assignedCollector) {
        return { ...collector, clientCount: Math.max(0, collector.clientCount - 1) };
      }
      return collector;
    }));

    setAssignModal(false);
    Alert.alert('Success', 'Collector assigned successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };

  const renderSubscriptionTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Subscription Plans</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openPlanModal()}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>New Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price.toLocaleString()} FCFA</Text>
                <Text style={styles.planDuration}>{plan.duration}</Text>
              </View>
              <View style={styles.planStats}>
                <Text style={styles.planClients}>{plan.clientCount} clients</Text>
                <Switch
                  value={plan.isActive}
                  onValueChange={() => togglePlanStatus(plan.id)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                />
              </View>
            </View>
            
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.planFeature}>• {feature}</Text>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => openPlanModal(plan)}
            >
              <Ionicons name="create" size={16} color="#3B82F6" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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

      <ScrollView showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );

  const renderAssignmentTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Collector Assignments</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
                <Text style={styles.collectorClients}>{collector.clientCount} clients</Text>
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
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.header}>
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

      {/* Plan Modal */}
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

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Plan Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={planForm.name}
                  onChangeText={(text) => setPlanForm(prev => ({ ...prev, name: text }))}
                  placeholder="Ex: Premium"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price (FCFA)</Text>
                <TextInput
                  style={styles.textInput}
                  value={planForm.price}
                  onChangeText={(text) => setPlanForm(prev => ({ ...prev, price: text }))}
                  placeholder="Ex: 12000"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={planForm.duration}
                    onValueChange={(value) => setPlanForm(prev => ({ ...prev, duration: value }))}
                    style={styles.picker}
                  >
                    <Picker.Item label="1 month" value="1 month" />
                    <Picker.Item label="3 months" value="3 months" />
                    <Picker.Item label="6 months" value="6 months" />
                    <Picker.Item label="1 year" value="1 year" />
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
                      placeholder="Ex: Daily collection"
                    />
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeFeature(index)}
                    >
                      <Ionicons name="remove-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
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
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={savePlan}>
              <Text style={styles.saveButtonText}>
                {currentPlan ? 'Update Plan' : 'Create Plan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Request Modal */}
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

      {/* Assignment Modal */}
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
                      <Picker.Item label="Select..." value="" />
                      {collectors
                        .filter(c => c.status === 'active')
                        .map(collector => (
                        <Picker.Item 
                          key={collector.id}
                          label={`${collector.name} (${collector.clientCount} clients)`} 
                          value={collector.id} 
                        />
                      ))}
                    </Picker>
                  </View>

                  <TouchableOpacity style={styles.assignConfirmButton} onPress={assignCollector}>
                    <Text style={styles.assignConfirmText}>Confirm Assignment</Text>
                  </TouchableOpacity>
                </View>
              </>
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
  planStats: {
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '500',
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
  },
  modalContent: {
    backgroundColor: '#fff',
    width: width * 0.9,
    maxHeight: height * 0.85,
    borderRadius: 20,
    padding: 20,
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
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  picker: {
    height: 50,
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
  assignConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;