import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

interface MedicalRecord {
  id: number;
  title: string;
  type: 'diagnosis' | 'lab-result' | 'imaging' | 'vaccination' | 'surgery' | 'other';
  date: string;
  hospital: string;
  doctor: string;
  ipfsHash?: string;
  accessGranted: string[];
  summary: string;
}

export default function RecordsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [filter, setFilter] = useState<'all' | MedicalRecord['type']>('all');

  // Mock data - will be replaced with blockchain data
  const records: MedicalRecord[] = [];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch records from blockchain
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getTypeIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'diagnosis':
        return '🩺';
      case 'lab-result':
        return '🧪';
      case 'imaging':
        return '🔬';
      case 'vaccination':
        return '💉';
      case 'surgery':
        return '⚕️';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-blue-900/50 text-blue-400';
      case 'lab-result':
        return 'bg-purple-900/50 text-purple-400';
      case 'imaging':
        return 'bg-green-900/50 text-green-400';
      case 'vaccination':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'surgery':
        return 'bg-red-900/50 text-red-400';
      default:
        return 'bg-slate-700 text-slate-400';
    }
  };

  const filteredRecords = records.filter((record) => 
    filter === 'all' || record.type === filter
  );

  const recordTypes: Array<'all' | MedicalRecord['type']> = [
    'all',
    'diagnosis',
    'lab-result',
    'imaging',
    'vaccination',
    'surgery',
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
          <Text className="text-white text-2xl font-bold mb-2">Medical Records</Text>
          <Text className="text-slate-400">View and manage your health records</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 mb-6"
        >
          <View className="flex-row space-x-2">
            {recordTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setFilter(type)}
                className={`px-4 py-2 rounded-full ${
                  filter === type
                    ? 'bg-blue-600'
                    : 'bg-slate-900 border border-slate-700'
                }`}
              >
                <Text
                  className={`capitalize ${
                    filter === type ? 'text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  {type === 'all' ? 'All' : type.replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-blue-900/20 border border-blue-600 rounded-xl p-4">
              <Text className="text-blue-400 text-2xl font-bold mb-1">
                {records.length}
              </Text>
              <Text className="text-slate-400 text-xs">Total Records</Text>
            </View>
            <View className="flex-1 bg-green-900/20 border border-green-600 rounded-xl p-4">
              <Text className="text-green-400 text-2xl font-bold mb-1">
                {records.filter((r) => r.accessGranted.length > 0).length}
              </Text>
              <Text className="text-slate-400 text-xs">Shared</Text>
            </View>
            <View className="flex-1 bg-purple-900/20 border border-purple-600 rounded-xl p-4">
              <Text className="text-purple-400 text-2xl font-bold mb-1">
                {new Set(records.map((r) => r.hospital)).size}
              </Text>
              <Text className="text-slate-400 text-xs">Hospitals</Text>
            </View>
          </View>
        </View>

        {/* Notice */}
        <View className="px-6 mb-6">
          <View className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
            <Text className="text-yellow-400 text-sm">
              ⚠️ Medical records will be available after contract deployment to testnet.
            </Text>
          </View>
        </View>

        {/* Records List */}
        <View className="px-6 pb-8">
          {filteredRecords.length === 0 ? (
            <View className="bg-slate-900 border border-slate-700 rounded-xl p-8">
              <Text className="text-slate-400 text-center mb-2">No records found</Text>
              <Text className="text-slate-500 text-center text-sm">
                {filter === 'all'
                  ? 'Your medical records will appear here once you visit a hospital'
                  : `No ${filter.replace('-', ' ')} records found`}
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {filteredRecords.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  onPress={() => setSelectedRecord(record)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                >
                  <View className="flex-row items-start mb-3">
                    <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
                      <Text className="text-2xl">{getTypeIcon(record.type)}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold mb-1">{record.title}</Text>
                      <Text className="text-slate-400 text-sm mb-1">{record.hospital}</Text>
                      <Text className="text-slate-500 text-xs">Dr. {record.doctor}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${getTypeColor(record.type)}`}>
                      <Text className="text-xs capitalize">{record.type.replace('-', ' ')}</Text>
                    </View>
                  </View>

                  <Text className="text-slate-300 text-sm mb-3">{record.summary}</Text>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-slate-400 text-xs">📅 {record.date}</Text>
                    {record.accessGranted.length > 0 && (
                      <Text className="text-green-400 text-xs">
                        🔓 Shared with {record.accessGranted.length}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Record Details Modal */}
      <Modal
        visible={selectedRecord !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedRecord(null)}
      >
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-slate-900 rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">Record Details</Text>
              <TouchableOpacity onPress={() => setSelectedRecord(null)}>
                <Text className="text-slate-400 text-2xl">×</Text>
              </TouchableOpacity>
            </View>

            {selectedRecord && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="space-y-4">
                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Title</Text>
                    <Text className="text-white text-lg">{selectedRecord.title}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Type</Text>
                    <View className={`self-start px-3 py-1 rounded-full ${getTypeColor(selectedRecord.type)}`}>
                      <Text className="capitalize">{selectedRecord.type.replace('-', ' ')}</Text>
                    </View>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Date</Text>
                    <Text className="text-white">{selectedRecord.date}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Hospital</Text>
                    <Text className="text-white">{selectedRecord.hospital}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Doctor</Text>
                    <Text className="text-white">Dr. {selectedRecord.doctor}</Text>
                  </View>

                  <View>
                    <Text className="text-slate-400 text-sm mb-1">Summary</Text>
                    <Text className="text-white">{selectedRecord.summary}</Text>
                  </View>

                  {selectedRecord.ipfsHash && (
                    <View>
                      <Text className="text-slate-400 text-sm mb-1">Document</Text>
                      <TouchableOpacity className="bg-blue-600 py-3 rounded-lg">
                        <Text className="text-white text-center font-semibold">
                          View Document
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <View>
                    <Text className="text-slate-400 text-sm mb-2">Access Control</Text>
                    {selectedRecord.accessGranted.length > 0 ? (
                      <View className="space-y-2">
                        {selectedRecord.accessGranted.map((address, idx) => (
                          <View
                            key={idx}
                            className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex-row items-center justify-between"
                          >
                            <Text className="text-slate-300 text-sm flex-1" numberOfLines={1}>
                              {address}
                            </Text>
                            <TouchableOpacity>
                              <Text className="text-red-400 text-sm ml-2">Revoke</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text className="text-slate-500 text-sm">No access granted</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRecord(null);
                      setShowAccessModal(true);
                    }}
                    className="bg-green-600 py-3 rounded-lg mt-2"
                  >
                    <Text className="text-white text-center font-semibold">
                      Grant Access
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
