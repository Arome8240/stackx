import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWallet } from '@/lib/wallet/wallet-context';
import { useState } from 'react';

export default function ConnectWalletScreen() {
  const router = useRouter();
  const { connect, isLoading, error } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<'hiro' | 'xverse' | null>(null);

  const handleConnect = async (walletType: 'hiro' | 'xverse') => {
    setSelectedWallet(walletType);
    
    try {
      await connect();
      // On successful connection, navigate to patient dashboard
      router.replace('/(patient)/dashboard');
    } catch (err) {
      Alert.alert(
        'Connection Failed',
        err instanceof Error ? err.message : 'Failed to connect wallet',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View className="flex-1 bg-slate-950 px-6">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="pt-16 pb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-6"
        >
          <Text className="text-blue-400 text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-white mb-3">
          Connect Wallet
        </Text>
        <Text className="text-base text-slate-400">
          Choose your preferred Stacks wallet to continue
        </Text>
      </View>

      {/* Error Message */}
      {error && (
        <View className="bg-red-900/20 border border-red-600 rounded-xl p-4 mb-6">
          <Text className="text-red-400 text-sm">{error}</Text>
        </View>
      )}

      {/* Notice */}
      <View className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4 mb-6">
        <Text className="text-yellow-400 font-semibold mb-2">⚠️ Development Mode</Text>
        <Text className="text-yellow-300 text-sm">
          Wallet connection requires contracts to be deployed to testnet first.
          This feature will be available after deployment.
        </Text>
      </View>

      {/* Wallet Options */}
      <View className="space-y-4">
        {/* Hiro Wallet */}
        <TouchableOpacity
          onPress={() => handleConnect('hiro')}
          disabled={isLoading}
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex-row items-center"
        >
          <View className="w-12 h-12 bg-orange-600 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">🔥</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg mb-1">Hiro Wallet</Text>
            <Text className="text-slate-400 text-sm">
              Official Stacks wallet
            </Text>
          </View>
          {isLoading && selectedWallet === 'hiro' && (
            <ActivityIndicator color="#3b82f6" />
          )}
        </TouchableOpacity>

        {/* Xverse Wallet */}
        <TouchableOpacity
          onPress={() => handleConnect('xverse')}
          disabled={isLoading}
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex-row items-center"
        >
          <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">✨</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg mb-1">Xverse Wallet</Text>
            <Text className="text-slate-400 text-sm">
              Bitcoin & Stacks wallet
            </Text>
          </View>
          {isLoading && selectedWallet === 'xverse' && (
            <ActivityIndicator color="#3b82f6" />
          )}
        </TouchableOpacity>

        {/* Coming Soon: Custom Wallet */}
        <View className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex-row items-center opacity-50">
          <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">🏥</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg mb-1">Staxial Wallet</Text>
            <Text className="text-slate-400 text-sm">
              Coming soon - Built-in wallet
            </Text>
          </View>
          <View className="bg-slate-700 px-3 py-1 rounded-full">
            <Text className="text-slate-300 text-xs">Soon</Text>
          </View>
        </View>
      </View>

      {/* Info */}
      <View className="mt-8 bg-slate-900/50 rounded-xl p-4">
        <Text className="text-slate-400 text-sm text-center">
          Don't have a wallet?{' '}
          <Text className="text-blue-400">Download Hiro or Xverse</Text>
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-1 justify-end pb-8">
        <Text className="text-slate-500 text-xs text-center">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
