// app/_layout.tsx
import { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import api from '@/app/services/api'; // Seu axios configurado
import { colors } from '@/theme/colors';
import { registrarParaPushNotifications } from '@/src/notificationService';


export default function RootLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const initializeApp = useCallback(async () => {
  try {
    let userId = await AsyncStorage.getItem('user_id');

    if (userId) {
      // Confirma que esse usuário realmente existe no backend
      try {
        await api.get(`/usuario/${userId}`);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          console.log('Usuário local não existe mais no backend, recriando...');
          userId = null; // força a recriação abaixo
          await AsyncStorage.removeItem('user_id');
        }
      }
    }

    // SE FOR O PRIMEIRO ACESSO OU O USUÁRIO SUMIU DO BACKEND
    if (!userId) {
      const newId = Crypto.randomUUID();
      userId = newId;

      await AsyncStorage.setItem('user_id', newId);

      try {
        await api.post('/usuario', {
          id: newId,
          recebeNotificacaoNoticia: false,
          recebeNotificacaoEdital: false,
          recebeNotificacaoOportunidade: false,
        });
        console.log('Usuário criado no backend com sucesso!');
      } catch (error) {
        console.log('Erro ao criar usuário no backend (pode ignorar se já existir):', error);
      }
    }

    const pushToken = await registrarParaPushNotifications();
    if (pushToken && userId) {
      try {
        await api.post(`/usuario/${userId}/dispositivo`, { token: pushToken });
      } catch (error) {
        console.log('Erro ao registrar token push:', error);
      }
    }

    const hasCompleted = await AsyncStorage.getItem('has_completed_onboarding');

    if (hasCompleted === 'true') {
      router.replace('/(tabs)');
    } else {
      router.replace('/(onboarding)/welcome');
    }
  } catch (e) {
    console.log('Erro na inicialização:', e);
  } finally {
    setIsReady(true);
  }
  }, [router]);

  useEffect(() => {
    void initializeApp();
  }, [initializeApp]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.greenAccent} />
      </View>
    );
  }

  return <Stack />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});