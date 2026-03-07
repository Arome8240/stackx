import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren } from 'react';
import '../global.css';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#020617'
          }
        }}
      />
      {children}
      <StatusBar style="light" />
    </>
  );
}


