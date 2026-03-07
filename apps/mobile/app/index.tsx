import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-950 px-6">
      <Text className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        Mobile App
      </Text>
      <Text className="mb-3 text-center text-2xl font-semibold text-slate-50">
        Staxial
      </Text>
      <Text className="text-center text-sm text-slate-300">
        Expo + React Native entrypoint for the Social DeFi experience on the Stacks blockchain.
        This app shares types and configuration with the web and backend services.
      </Text>
    </View>
  );
}


