import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useWallet } from '@/lib/wallet/wallet-context';

export default function PatientDashboardScreen() {
  const router = useRouter();
  const { address, disconnect } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest data from blockchain
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDisconnect = async () => {
    await disconnect();
    router.replace('/(auth)/welcome');
  };

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
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-slate-400 text-sm mb-1">Welcome back</Text>
              <Text className="text-white text-2xl font-bold">Patient Dashboard</Text>
            </View>
            <TouchableOpacity
              onPress={handleDisconnect}
              className="bg-slate-800 px-4 py-2 rounded-lg"
            >
              <Text className="text-slate-300 text-sm">Disconnect</Text>
            </TouchableOpacity>
          </View>

          {/* Wallet Info */}
          <View className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <Text className="text-slate-400 text-xs mb-1">Connected Wallet</Text>
            <Text className="text-white text-sm font-mono">
              {address ? `${address.slice(0, 12)}...${address.slice(-10)}` : 'Not connected'}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <Text className="text-white font-semibold text-lg mb-4">Quick Overview</Text>
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-blue-900/20 border border-blue-600 rounded-xl p-4">
              <Text className="text-blue-400 text-2xl font-bold mb-1">0</Text>
              <Text className="text-slate-400 text-xs">Upcoming Appointments</Text>
            </View>
            <View className="flex-1 bg-green-900/20 border border-green-600 rounded-xl p-4">
              <Text className="text-green-400 text-2xl font-bold mb-1">0</Text>
              <Text className="text-slate-400 text-xs">Active Prescriptions</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-white font-semibold text-lg mb-4">Quick Actions</Text>
          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => router.push('/(patient)/hospitals')}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex-row items-center"
            >
              <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">🏥</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold mb-1">Find Hospitals</Text>
                <Text className="text-slate-400 text-sm">Browse verified healthcare providers</Text>
              </View>
              <Text className="text-slate-500">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(patient)/appointments')}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex-row items-center"
            >
              <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold mb-1">My Appointments</Text>
                <Text className="text-slate-400 text-sm">View and manage appointments</Text>
              </View>
              <Text className="text-slate-500">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(patient)/records')}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex-row items-center"
            >
              <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">📄</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold mb-1">Medical Records</Text>
                <Text className="text-slate-400 text-sm">Access your health records</Text>
              </View>
              <Text className="text-slate-500">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 mb-6">
          <Text className="text-white font-semibold text-lg mb-4">Recent Activity</Text>
          <View className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <Text className="text-slate-400 text-center text-sm">
              No recent activity. Start by finding a hospital or booking an appointment.
            </Text>
          </View>
        </View>

        {/* Health Tips */}
        <View className="px-6 pb-8">
          <Text className="text-white font-semibold text-lg mb-4">Health Tips</Text>
          <View className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600 rounded-xl p-4">
            <Text className="text-blue-400 font-semibold mb-2">💡 Stay Healthy</Text>
            <Text className="text-slate-300 text-sm">
              Regular check-ups help detect health issues early. Schedule your annual physical today!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
