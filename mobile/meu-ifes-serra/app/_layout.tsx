import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasCompleted = await AsyncStorage.getItem('has_completed_onboarding');
      
      // Aguarda um pequeno ciclo para garantir que o layout montou
      if (hasCompleted === 'true') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/welcome');
      }
    } catch (e) {
      console.log('Erro ao ler armazenamento:', e);
    } finally {
      setIsReady(true);
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {!isReady && (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
  );
}