import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-950 px-6">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="flex-1 justify-center items-center">
        <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">🏥</Text>
        </View>
        
        <Text className="text-3xl font-bold text-white text-center mb-3">
          Staxial Health
        </Text>
        
        <Text className="text-base text-slate-400 text-center mb-8 px-4">
          Decentralized healthcare management on the Stacks blockchain
        </Text>

        {/* Features */}
        <View className="w-full space-y-4 mb-12">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-900/50 rounded-full items-center justify-center mr-4">
              <Text className="text-lg">🔒</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">Secure & Private</Text>
              <Text className="text-slate-400 text-sm">Your health data, your control</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-green-900/50 rounded-full items-center justify-center mr-4">
              <Text className="text-lg">📅</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">Easy Appointments</Text>
              <Text className="text-slate-400 text-sm">Book with verified hospitals</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-purple-900/50 rounded-full items-center justify-center mr-4">
              <Text className="text-lg">💊</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">Digital Prescriptions</Text>
              <Text className="text-slate-400 text-sm">Manage prescriptions digitally</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="pb-8">
        <TouchableOpacity
          onPress={() => router.push('/(auth)/connect-wallet')}
          className="bg-blue-600 py-4 rounded-xl mb-3"
        >
          <Text className="text-white text-center font-semibold text-base">
            Connect Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // TODO: Navigate to learn more
          }}
          className="py-4"
        >
          <Text className="text-slate-400 text-center text-sm">
            Learn more about Staxial
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
