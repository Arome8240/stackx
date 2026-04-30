import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  prescriptionId: string;
  doctor: string;
  hospital: string;
  date: string;
  expiryDate: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  medications: Medication[];
  diagnosis: string;
  instructions: string;
  refillsAllowed: number;
  refillsUsed: number;
}

export default function PrescriptionsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [filter, setFilter] = useState<'all' | Prescription['status']>('active');

  // Mock data - will be replaced with blockchain data
  const prescriptions: Prescription[] = [];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch prescriptions from blockchain
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/50 text-green-400';
      case 'fulfilled':
        return 'bg-blue-900/50 text-blue-400';
      case 'expired':
        return 'bg-red-900/50 text-red-400';
      case 'cancelled':
        return 'bg-slate-700 text-slate-400';
      default:
        return 'bg-slate-700 text-slate-400';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => 
    filter === 'all' || prescription.status === filter
  );

  const statusFilters: Array<'all' | Prescription['status']> = [
    'all',
    'active',
    'fulfilled',
    'expired',
  ];

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <Text className="text-white text-2xl font-bold mb-2">Prescriptions</Text>
          <Text className="text-slate-400">Manage your medications and prescriptions</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 mb-6"
        >
          <View className="flex-row space-x-2">
            {statusFilters.map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilter(status)}
                className={`px-4 py-2 rounded-full ${
                  filter === status
                    ? 'bg-blue-600'
                    : 'bg-slate-900 border border-slate-700'
                }`}
              >
                <Text
                  className={`capitalize ${
                    filter === status ? 'text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-green-900/20 border border-green-600 rounded-xl p-4">
              <Text className="text-green-400 text-2xl font-bold mb-1">
                {prescriptions.filter((p) => p.status === 'active').length}
              </Text>
              <Text className="text-slate-400 text-xs">Active</Text>
            </View>
            <View className="flex-1 bg-blue-900/20 border border-blue-600 rounded-xl p-4">
              <Text className="text-blue-400 text-2xl font-bold mb-1">
                {prescriptions.filter((p) => p.status === 'fulfilled').length}
              </Text>
              <Text className="text-slate-400 text-xs">Fulfilled</Text>
            </View>
            <View className="flex-1 bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
              <Text className="text-yellow-400 text-2xl font-bold mb-1">
                {prescriptions.filter((p) => isExpiringSoon(p.expiryDate)).length}
              </Text>
              <Text className="text-slate-400 text-xs">Expiring Soon</Text>
            </View>
          </View>
        </View>

        {/* Notice */}
        <View className="px-6 mb-6">
          <View className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
            <Text className="text-yellow-400 text-sm">
              ⚠️ Prescription data will be available after contract deployment to testnet.
            </Text>
          </View>
        </View>

        {/* Prescriptions List */}
        <View className="px-6 pb-8">
          {filteredPrescriptions.length === 0 ? (
            <View className="bg-slate-900 border border-slate-700 rounded-xl p-8">
              <Text className="text-slate-400 text-center mb-2">No prescriptions found</Text>
              <Text className="text-slate-500 text-center text-sm">
                {filter === 'active'
                  ? 'You have no active prescriptions'
                  : filter === 'fulfilled'
                  ? 'No fulfilled prescriptions'
                  : filter === 'expired'
                  ? 'No expired prescriptions'
                  : 'Your prescriptions will appear here after doctor consultations'}
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {filteredPrescriptions.map((prescription) => (
                <TouchableOpacity
                  key={prescription.id}
                  onPress={() => setSelectedPrescription(prescription)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                >
                  {/* Header */}
                  <View className="flex-row items-start mb-3">
                    <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
                      <Text className="text-2xl">💊</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold mb-1">
                        Rx #{prescription.prescriptionId}
                      </Text>
                      <Text className="text-slate-400 text-sm mb-1">
                        Dr. {prescription.doctor}
                      </Text>
                      <Text className="text-slate-500 text-xs">{prescription.hospital}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${getStatusColor(prescription.status)}`}>
                      <Text className="text-xs capitalize">{prescription.status}</Text>
                    </View>
                  </View>

                  {/* Expiring Soon Warning */}
                  {prescription.status === 'active' && isExpiringSoon(prescription.expiryDate) && (
                    <View className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-2 mb-3">
                      <Text className="text-yellow-400 text-xs">
                        ⚠️ Expires soon on {prescription.expiryDate}
                      </Text>
                    </View>
                  )}

                  {/* Medications */}
                  <View className="bg-slate-800 rounded-lg p-3 mb-3">
                    <Text className="text-slate-400 text-xs mb-2">Medications</Text>
                    {prescription.medications.slice(0, 2).map((med, idx) => (
                      <View key={idx} className="mb-1">
                        <Text className="text-white text-sm font-semibold">{med.name}</Text>
                        <Text className="text-slate-400 text-xs">
                          {med.dosage} • {med.frequency}
                        </Text>
                      </View>
                    ))}
                    {prescription.medications.length > 2 && (
                      <Text className="text-blue-400 text-xs mt-1">
                        +{prescription.medications.length - 2} more
                      </Text>
                    )}
                  </View>

                  {/* Footer */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-slate-400 text-xs">📅 {prescription.date}</Text>
                    {prescription.refillsAllowed > 0 && (
                      <Text className="text-slate-400 text-xs">
                        🔄 {prescription.refillsUsed}/{prescription.refillsAllowed} refills used
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Prescription Details Modal */}
      <Modal
        visible={selectedPrescription !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPrescription(null)}
      >
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-slate-900 rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">Prescription Details</Text>
              <TouchableOpacity onPress={() => setSelectedPrescription(null)}>
                <Text className="text-slate-400 text-2xl">×</Text>
              </TouchableOpacity>
            </View>

            {selectedPrescription && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="space-y-4">
                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Prescription ID</Text>
                    <Text className="text-white text-lg">#{selectedPrescription.prescriptionId}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Status</Text>
                    <View className={`self-start px-3 py-1 rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                      <Text className="capitalize">{selectedPrescription.status}</Text>
                    </View>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Doctor</Text>
                    <Text className="text-white">Dr. {selectedPrescription.doctor}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Hospital</Text>
                    <Text className="text-white">{selectedPrescription.hospital}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Date Issued</Text>
                    <Text className="text-white">{selectedPrescription.date}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Expiry Date</Text>
                    <Text className="text-white">{selectedPrescription.expiryDate}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Diagnosis</Text>
                    <Text className="text-white">{selectedPrescription.diagnosis}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-2">Medications</Text>
                    <View className="space-y-2">
                      {selectedPrescription.medications.map((med, idx) => (
                        <View
                          key={idx}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-3"
                        >
                          <Text className="text-white font-semibold mb-1">{med.name}</Text>
                          <Text className="text-slate-300 text-sm mb-1">
                            Dosage: {med.dosage}
                          </Text>
                          <Text className="text-slate-300 text-sm mb-1">
                            Frequency: {med.frequency}
                          </Text>
                          <Text className="text-slate-300 text-sm">
                            Duration: {med.duration}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Instructions</Text>
                    <Text className="text-white">{selectedPrescription.instructions}</Text>
                  </View>

                  {selectedPrescription.refillsAllowed > 0 && (
                    <View>
                      <Text className="text-slate-400 text-sm mb-1">Refills</Text>
                      <Text className="text-white">
                        {selectedPrescription.refillsUsed} of {selectedPrescription.refillsAllowed} used
                      </Text>
                    </View>
                  )}

                  {selectedPrescription.status === 'active' && (
                    <View className="space-y-2 mt-4">
                      <TouchableOpacity className="bg-blue-600 py-3 rounded-lg">
                        <Text className="text-white text-center font-semibold">
                          Request Refill
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-green-600 py-3 rounded-lg">
                        <Text className="text-white text-center font-semibold">
                          Mark as Fulfilled
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
