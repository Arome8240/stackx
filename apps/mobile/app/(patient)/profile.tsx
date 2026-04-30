import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useWallet } from '../../../lib/wallet/wallet-context';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { address, disconnect } = useWallet();
  const [isRegistered, setIsRegistered] = useState(false);

  // Mock patient data - will be replaced with blockchain data
  const patientData = {
    name: 'John Doe',
    dateOfBirth: '1990-01-15',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1234567890',
    },
    registeredDate: '2024-01-15',
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await disconnect();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available after contract deployment.');
  };

  const menuItems = [
    { icon: '🔔', label: 'Notifications', action: () => Alert.alert('Coming Soon') },
    { icon: '🔒', label: 'Privacy Settings', action: () => Alert.alert('Coming Soon') },
    { icon: '💳', label: 'Payment Methods', action: () => Alert.alert('Coming Soon') },
    { icon: '📄', label: 'Terms & Conditions', action: () => Alert.alert('Coming Soon') },
    { icon: '❓', label: 'Help & Support', action: () => Alert.alert('Coming Soon') },
    { icon: 'ℹ️', label: 'About', action: () => Alert.alert('Staxial Health', 'Version 1.0.0') },
  ];

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <Text className="text-white text-2xl font-bold mb-2">Profile</Text>
          <Text className="text-slate-400">Manage your account and preferences</Text>
        </View>

        {/* Wallet Info */}
        <View className="px-6 mb-6">
          <View className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4">
            <Text className="text-white text-sm mb-2">Connected Wallet</Text>
            <Text className="text-white font-mono text-xs mb-3" numberOfLines={1}>
              {address || 'Not connected'}
            </Text>
            <TouchableOpacity
              onPress={handleDisconnect}
              className="bg-white/20 py-2 rounded-lg"
            >
              <Text className="text-white text-center font-semibold text-sm">
                Disconnect
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isRegistered ? (
          <>
            {/* Patient Info Card */}
            <View className="px-6 mb-6">
              <View className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-3">
                      <Text className="text-3xl">👤</Text>
                    </View>
                    <View>
                      <Text className="text-white text-xl font-bold">{patientData.name}</Text>
                      <Text className="text-slate-400 text-sm">Patient ID: #12345</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={handleEditProfile}>
                    <Text className="text-blue-400">Edit</Text>
                  </TouchableOpacity>
                </View>

                <View className="space-y-3">
                  <View className="flex-row items-center">
                    <Text className="text-slate-400 text-sm w-32">Date of Birth</Text>
                    <Text className="text-white text-sm">{patientData.dateOfBirth}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-slate-400 text-sm w-32">Blood Type</Text>
                    <Text className="text-white text-sm">{patientData.bloodType}</Text>
                  </View>
                  <View className="flex-row items-start">
                    <Text className="text-slate-400 text-sm w-32">Allergies</Text>
                    <View className="flex-1 flex-row flex-wrap">
                      {patientData.allergies.map((allergy, idx) => (
                        <View
                          key={idx}
                          className="bg-red-900/30 border border-red-600 rounded-full px-2 py-1 mr-2 mb-2"
                        >
                          <Text className="text-red-400 text-xs">{allergy}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-slate-400 text-sm w-32">Registered</Text>
                    <Text className="text-white text-sm">{patientData.registeredDate}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Emergency Contact */}
            <View className="px-6 mb-6">
              <Text className="text-white font-semibold mb-3">Emergency Contact</Text>
              <View className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Text className="text-slate-400 text-sm w-28">Name</Text>
                    <Text className="text-white text-sm">{patientData.emergencyContact.name}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-slate-400 text-sm w-28">Relationship</Text>
                    <Text className="text-white text-sm">{patientData.emergencyContact.relationship}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-slate-400 text-sm w-28">Phone</Text>
                    <Text className="text-white text-sm">{patientData.emergencyContact.phone}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Health Stats */}
            <View className="px-6 mb-6">
              <Text className="text-white font-semibold mb-3">Health Overview</Text>
              <View className="flex-row space-x-3">
                <View className="flex-1 bg-blue-900/20 border border-blue-600 rounded-xl p-4">
                  <Text className="text-blue-400 text-2xl font-bold mb-1">12</Text>
                  <Text className="text-slate-400 text-xs">Records</Text>
                </View>
                <View className="flex-1 bg-green-900/20 border border-green-600 rounded-xl p-4">
                  <Text className="text-green-400 text-2xl font-bold mb-1">5</Text>
                  <Text className="text-slate-400 text-xs">Appointments</Text>
                </View>
                <View className="flex-1 bg-purple-900/20 border border-purple-600 rounded-xl p-4">
                  <Text className="text-purple-400 text-2xl font-bold mb-1">3</Text>
                  <Text className="text-slate-400 text-xs">Prescriptions</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* Not Registered Notice */
          <View className="px-6 mb-6">
            <View className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
              <Text className="text-yellow-400 text-sm mb-3">
                ⚠️ You haven't registered as a patient yet. Register to access all features.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(patient)/register')}
                className="bg-yellow-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Register Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="px-6 mb-6">
          <Text className="text-white font-semibold mb-3">Settings</Text>
          <View className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={item.action}
                className={`flex-row items-center p-4 ${
                  idx !== menuItems.length - 1 ? 'border-b border-slate-700' : ''
                }`}
              >
                <Text className="text-2xl mr-3">{item.icon}</Text>
                <Text className="text-white flex-1">{item.label}</Text>
                <Text className="text-slate-400">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View className="px-6 pb-8">
          <View className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <Text className="text-slate-400 text-center text-sm mb-2">
              Staxial Health System
            </Text>
            <Text className="text-slate-500 text-center text-xs mb-2">
              Decentralized Healthcare on Stacks Blockchain
            </Text>
            <Text className="text-slate-600 text-center text-xs">
              Version 1.0.0 • Built with ❤️
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
