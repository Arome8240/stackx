import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

interface Appointment {
  id: number;
  hospitalName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  specialty: string;
}

export default function AppointmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  // Mock data - will be replaced with blockchain data
  const appointments: Appointment[] = [];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch appointments from blockchain
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900/50 text-green-400';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'completed':
        return 'bg-blue-900/50 text-blue-400';
      case 'cancelled':
        return 'bg-red-900/50 text-red-400';
      default:
        return 'bg-slate-700 text-slate-400';
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const now = new Date();
    const aptDate = new Date(apt.date);
    
    if (filter === 'upcoming') {
      return aptDate >= now && apt.status !== 'cancelled' && apt.status !== 'completed';
    } else if (filter === 'past') {
      return aptDate < now || apt.status === 'completed' || apt.status === 'cancelled';
    }
    return true;
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
          <Text className="text-white text-2xl font-bold mb-2">My Appointments</Text>
          <Text className="text-slate-400">View and manage your appointments</Text>
        </View>

        {/* Filter Tabs */}
        <View className="px-6 mb-6">
          <View className="flex-row bg-slate-900 rounded-xl p-1">
            {(['upcoming', 'past', 'all'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilter(tab)}
                className={`flex-1 py-2 rounded-lg ${
                  filter === tab ? 'bg-blue-600' : ''
                }`}
              >
                <Text
                  className={`text-center capitalize ${
                    filter === tab ? 'text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-blue-900/20 border border-blue-600 rounded-xl p-4">
              <Text className="text-blue-400 text-2xl font-bold mb-1">
                {appointments.filter((a) => a.status === 'confirmed').length}
              </Text>
              <Text className="text-slate-400 text-xs">Confirmed</Text>
            </View>
            <View className="flex-1 bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
              <Text className="text-yellow-400 text-2xl font-bold mb-1">
                {appointments.filter((a) => a.status === 'pending').length}
              </Text>
              <Text className="text-slate-400 text-xs">Pending</Text>
            </View>
            <View className="flex-1 bg-green-900/20 border border-green-600 rounded-xl p-4">
              <Text className="text-green-400 text-2xl font-bold mb-1">
                {appointments.filter((a) => a.status === 'completed').length}
              </Text>
              <Text className="text-slate-400 text-xs">Completed</Text>
            </View>
          </View>
        </View>

        {/* Notice */}
        <View className="px-6 mb-6">
          <View className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
            <Text className="text-yellow-400 text-sm">
              ⚠️ Appointment data will be available after contract deployment to testnet.
            </Text>
          </View>
        </View>

        {/* Appointments List */}
        <View className="px-6 pb-8">
          {filteredAppointments.length === 0 ? (
            <View className="bg-slate-900 border border-slate-700 rounded-xl p-8">
              <Text className="text-slate-400 text-center mb-2">No appointments found</Text>
              <Text className="text-slate-500 text-center text-sm mb-4">
                {filter === 'upcoming'
                  ? 'You have no upcoming appointments'
                  : filter === 'past'
                  ? 'No past appointments'
                  : 'Start by finding a hospital and booking an appointment'}
              </Text>
              {filter === 'upcoming' && (
                <TouchableOpacity className="bg-blue-600 py-3 rounded-lg mt-2">
                  <Text className="text-white text-center font-semibold">
                    Book Appointment
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <View
                  key={appointment.id}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                >
                  <View className="flex-row items-start mb-3">
                    <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
                      <Text className="text-2xl">🏥</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold mb-1">
                        {appointment.hospitalName}
                      </Text>
                      <Text className="text-slate-400 text-sm">
                        Dr. {appointment.doctorName}
                      </Text>
                      <Text className="text-slate-500 text-xs capitalize">
                        {appointment.specialty}
                      </Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      <Text className="text-xs capitalize">{appointment.status}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <View className="flex-1 flex-row items-center">
                      <Text className="text-slate-400 text-sm mr-1">📅</Text>
                      <Text className="text-slate-300 text-sm">{appointment.date}</Text>
                    </View>
                    <View className="flex-1 flex-row items-center">
                      <Text className="text-slate-400 text-sm mr-1">🕐</Text>
                      <Text className="text-slate-300 text-sm">{appointment.time}</Text>
                    </View>
                  </View>

                  {appointment.status === 'confirmed' && (
                    <View className="flex-row space-x-2">
                      <TouchableOpacity className="flex-1 bg-blue-600 py-2 rounded-lg">
                        <Text className="text-white text-center text-sm font-semibold">
                          View Details
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 bg-red-900/50 border border-red-600 py-2 rounded-lg">
                        <Text className="text-red-400 text-center text-sm font-semibold">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
