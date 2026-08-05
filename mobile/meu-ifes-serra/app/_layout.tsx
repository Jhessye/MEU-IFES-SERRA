import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função que roda assim que o app abre
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // 1. Busca a bandeirinha no armazenamento do celular
      const hasCompletedOnboarding = await AsyncStorage.getItem('has_completed_onboarding');

      // 2 e 3. Verifica o valor e decide para onde navegar
      if (hasCompletedOnboarding === 'true') {
        // Se já completou, envia direto para as Tabs (Tela Principal)
        router.replace('/(tabs)');
      } else {
        // Se é o primeiro acesso (ou não achou a chave), envia para as Boas-Vindas
        router.replace('/(onboarding)/welcome');
      }
    } catch (error) {
      console.log('Erro ao ler o AsyncStorage:', error);
      // Em caso de erro, por segurança manda para a tela de onboarding
      router.replace('/(onboarding)/welcome');
    } finally {
      setIsLoading(false);
    }
  };

  // Enquanto está lendo o armazenamento local, mostra um "carregando"
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
}