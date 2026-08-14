// app/_layout.tsx
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import api from '@/app/services/api'; // Seu axios configurado
import { colors } from '@/theme/colors';
import { registrarParaPushNotifications } from '@/app/services/notificationService';


export default function RootLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      let userId = await AsyncStorage.getItem('user_id');
      
      // SE FOR O PRIMEIRO ACESSO (não tem ID)
      if (!userId) {
        // 1. Gera o ID localmente
        const newId = Crypto.randomUUID();
        userId = newId;
        
        // 2. Salva no celular
        await AsyncStorage.setItem('user_id', newId);

        // 3. Já cria o usuário no Backend com as preferências padrão FALSE
        try {
          await api.post('/usuario', {
            id: newId, // Envia o ID gerado para o backend criar com esse ID exato
            recebeNotificacaoNoticia: false,
            recebeNotificacaoEdital: false,
            recebeNotificacaoOportunidade: false
          });
          console.log("Usuário criado no backend com sucesso!");
        } catch (error) {
          console.log("Erro ao criar usuário no backend (pode ignorar se já existir):", error);
        }
      }

      // dentro de initializeApp, depois do bloco que cria/recupera o userId:
      const pushToken = await registrarParaPushNotifications();
      if (pushToken && userId) {
        try {
          await api.post(`/usuario/${userId}/dispositivo`, { token: pushToken });
        } catch (error) {
          console.log('Erro ao registrar token push:', error);
        }
      }

      // Verifica o onboarding
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
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {!isReady && (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.greenAccent || "#0000ff"} />
        </View>
      )}
    </>
  );
}