import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useWallet } from '@/lib/wallet/wallet-context';

export default function PatientRegisterScreen() {
  const router = useRouter();
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleRegister = async () => {
    // Validate form
    if (!formData.fullName || !formData.dateOfBirth || !formData.emergencyContact) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call contract to register patient
      // This will be implemented after contract deployment
      
      Alert.alert(
        'Registration Pending',
        'Patient registration will be available after contract deployment to testnet.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(patient)/dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="pt-16 pb-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Patient Registration
          </Text>
          <Text className="text-slate-400">
            Complete your profile to access healthcare services
          </Text>
        </View>

        {/* Wallet Info */}
        <View className="bg-blue-900/20 border border-blue-600 rounded-xl p-4 mb-6">
          <Text className="text-blue-400 text-sm font-semibold mb-1">Connected Wallet</Text>
          <Text className="text-white text-xs font-mono">
            {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Not connected'}
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Full Name */}
          <View>
            <Text className="text-white font-medium mb-2">
              Full Name <Text className="text-red-400">*</Text>
            </Text>
            <TextInput
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Enter your full name"
              placeholderTextColor="#64748b"
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
            />
          </View>

          {/* Date of Birth */}
          <View>
            <Text className="text-white font-medium mb-2">
              Date of Birth <Text className="text-red-400">*</Text>
            </Text>
            <TextInput
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#64748b"
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
            />
          </View>

          {/* Blood Type */}
          <View>
            <Text className="text-white font-medium mb-2">Blood Type</Text>
            <TextInput
              value={formData.bloodType}
              onChangeText={(text) => setFormData({ ...formData, bloodType: text })}
              placeholder="e.g., A+, O-, AB+"
              placeholderTextColor="#64748b"
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
            />
          </View>

          {/* Allergies */}
          <View>
            <Text className="text-white font-medium mb-2">Known Allergies</Text>
            <TextInput
              value={formData.allergies}
              onChangeText={(text) => setFormData({ ...formData, allergies: text })}
              placeholder="List any allergies (optional)"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={3}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Emergency Contact */}
          <View>
            <Text className="text-white font-medium mb-2">
              Emergency Contact Name <Text className="text-red-400">*</Text>
            </Text>
            <TextInput
              value={formData.emergencyContact}
              onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
              placeholder="Contact person name"
              placeholderTextColor="#64748b"
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
            />
          </View>

          {/* Emergency Phone */}
          <View>
            <Text className="text-white font-medium mb-2">Emergency Contact Phone</Text>
            <TextInput
              value={formData.emergencyPhone}
              onChangeText={(text) => setFormData({ ...formData, emergencyPhone: text })}
              placeholder="Phone number"
              placeholderTextColor="#64748b"
              keyboardType="phone-pad"
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
            />
          </View>
        </View>

        {/* Notice */}
        <View className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4 my-6">
          <Text className="text-yellow-400 text-sm">
            ⚠️ Your medical information will be encrypted and stored securely on the blockchain.
            Only you can grant access to healthcare providers.
          </Text>
        </View>

        {/* Actions */}
        <View className="pb-8 space-y-3">
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-blue-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              {loading ? 'Registering...' : 'Complete Registration'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="py-4"
          >
            <Text className="text-slate-400 text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
