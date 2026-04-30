import { View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

interface Hospital {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  verified: boolean;
  status: string;
}

export default function HospitalsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  // Mock data - will be replaced with blockchain data
  const hospitals: Hospital[] = [];

  const specialties = ['all', 'cardiology', 'pediatrics', 'orthopedics', 'general'];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch hospitals from blockchain
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || hospital.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

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
          <Text className="text-white text-2xl font-bold mb-2">Find Hospitals</Text>
          <Text className="text-slate-400">Browse verified healthcare providers</Text>
        </View>

        {/* Search */}
        <View className="px-6 mb-4">
          <View className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 flex-row items-center">
            <Text className="text-slate-400 mr-2">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search hospitals..."
              placeholderTextColor="#64748b"
              className="flex-1 text-white"
            />
          </View>
        </View>

        {/* Specialty Filter */}
        <View className="px-6 mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2">
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                onPress={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  selectedSpecialty === specialty
                    ? 'bg-blue-600'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <Text
                  className={`capitalize ${
                    selectedSpecialty === specialty ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {specialty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notice */}
        <View className="px-6 mb-6">
          <View className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
            <Text className="text-yellow-400 text-sm">
              ⚠️ Hospital data will be available after contract deployment to testnet.
            </Text>
          </View>
        </View>

        {/* Hospital List */}
        <View className="px-6 pb-8">
          {filteredHospitals.length === 0 ? (
            <View className="bg-slate-900 border border-slate-700 rounded-xl p-8">
              <Text className="text-slate-400 text-center mb-2">No hospitals found</Text>
              <Text className="text-slate-500 text-center text-sm">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Hospitals will appear here once they register on the platform'}
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {filteredHospitals.map((hospital) => (
                <TouchableOpacity
                  key={hospital.id}
                  onPress={() => {
                    // TODO: Navigate to hospital details
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                >
                  <View className="flex-row items-start mb-3">
                    <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
                      <Text className="text-2xl">🏥</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-white font-semibold mr-2">{hospital.name}</Text>
                        {hospital.verified && (
                          <View className="bg-green-900/50 px-2 py-0.5 rounded-full">
                            <Text className="text-green-400 text-xs">✓ Verified</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-slate-400 text-sm capitalize">{hospital.specialty}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="text-slate-400 text-sm mr-1">📍</Text>
                      <Text className="text-slate-400 text-sm">{hospital.location}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-yellow-400 mr-1">⭐</Text>
                      <Text className="text-white text-sm">{hospital.rating.toFixed(1)}</Text>
                    </View>
                  </View>

                  <View className="mt-3 pt-3 border-t border-slate-700">
                    <TouchableOpacity className="bg-blue-600 py-2 rounded-lg">
                      <Text className="text-white text-center text-sm font-semibold">
                        Book Appointment
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
