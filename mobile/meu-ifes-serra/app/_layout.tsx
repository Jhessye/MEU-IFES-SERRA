// app/_layout.tsx

import { useEffect, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Stack,
  Redirect,
} from 'expo-router';

import * as Crypto from 'expo-crypto';

import api from '@/app/services/api';
import { colors } from '@/theme/colors';
import {
  registrarParaPushNotifications,
} from '@/src/notificationService';

type InitialRoute =
  | '/(tabs)'
  | '/(onboarding)/welcome';

export default function RootLayout() {

  // ======================================================
  // ESTADOS
  // ======================================================

  const [isReady, setIsReady] = useState(false);

  const [initialRoute, setInitialRoute] =
    useState<InitialRoute | null>(null);

  // ======================================================
  // PROTEÇÃO CONTRA EXECUÇÃO DUPLA
  // ======================================================

  const initializationStarted = useRef(false);

  // ======================================================
  // INICIALIZAÇÃO
  // ======================================================

  useEffect(() => {

    // Impede que a inicialização seja executada
    // novamente caso o React execute o efeito mais de uma vez.
    if (initializationStarted.current) {
      return;
    }

    initializationStarted.current = true;

    const initializeApp = async () => {

      try {

        console.log(
          '🚀 Inicializando aplicativo...'
        );

        // ==================================================
        // 1. RECUPERA OU CRIA O ID DO USUÁRIO
        // ==================================================

        let userId =
          await AsyncStorage.getItem('user_id');

        console.log(
          '👤 User ID local:',
          userId
        );

        // ==================================================
        // 2. VERIFICA SE O USUÁRIO AINDA EXISTE
        // ==================================================

        if (userId) {

          try {

            await api.get(
              `/usuario/${userId}`
            );

            console.log(
              '✅ Usuário encontrado no backend'
            );

          } catch (error: any) {

            if (
              error?.response?.status === 404
            ) {

              console.log(
                '⚠️ Usuário não existe mais. Criando outro...'
              );

              userId = null;

              await AsyncStorage.removeItem(
                'user_id'
              );
            } else {

              // Se for outro erro de rede/servidor,
              // não vamos destruir o ID local.
              console.log(
                '⚠️ Erro ao verificar usuário:',
                error?.message
              );
            }
          }
        }

        // ==================================================
        // 3. CRIA USUÁRIO SE NECESSÁRIO
        // ==================================================

        if (!userId) {

          const newId =
            Crypto.randomUUID();

          userId = newId;

          await AsyncStorage.setItem(
            'user_id',
            newId
          );

          console.log(
            '🆕 Criando usuário:',
            newId
          );

          try {

            await api.post(
              '/usuario',
              {
                id: newId,

                recebeNotificacaoNoticia:
                  false,

                recebeNotificacaoEdital:
                  false,

                recebeNotificacaoOportunidade:
                  false,
              }
            );

            console.log(
              '✅ Usuário criado no backend'
            );

          } catch (error: any) {

            console.log(
              '⚠️ Erro ao criar usuário:',
              error?.message
            );
          }
        }

        // ==================================================
        // 4. NOTIFICAÇÕES PUSH
        // ==================================================

        try {

          const pushToken =
            await registrarParaPushNotifications();

          if (
            pushToken &&
            userId
          ) {

            try {

              await api.post(
                `/usuario/${userId}/dispositivo`,
                {
                  token: pushToken,
                }
              );

              console.log(
                '✅ Token push registrado'
              );

            } catch (error: any) {

              console.log(
                '⚠️ Erro ao registrar token push:',
                error?.message
              );
            }
          }

        } catch (error: any) {

          console.log(
            '⚠️ Erro nas notificações push:',
            error?.message
          );
        }

        // ==================================================
        // 5. VERIFICA ONBOARDING
        // ==================================================

        const hasCompleted =
          await AsyncStorage.getItem(
            'has_completed_onboarding'
          );

        console.log(
          '📱 Onboarding:',
          hasCompleted
        );

        // ==================================================
        // 6. DEFINE QUAL ROTA DEVE SER ABERTA
        // ==================================================

        if (hasCompleted === 'true') {

          setInitialRoute(
            '/(tabs)'
          );

        } else {

          setInitialRoute(
            '/(onboarding)/welcome'
          );
        }

      } catch (error: any) {

        console.log(
          '❌ Erro na inicialização:',
          error?.message
        );

        // Se alguma coisa muito inesperada acontecer,
        // ainda mandamos o usuário para o onboarding.
        setInitialRoute(
          '/(onboarding)/welcome'
        );

      } finally {

        console.log(
          '🏁 Inicialização finalizada'
        );

        setIsReady(true);
      }
    };

    initializeApp();

  }, []);

  // ======================================================
  // ENQUANTO ESTÁ INICIALIZANDO
  // ======================================================

  if (!isReady || !initialRoute) {

    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color={colors.greenAccent}
        />

      </View>
    );
  }

  // ======================================================
  // STACK + REDIRECT
  // ======================================================

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <Redirect
        href={initialRoute}
      />
    </>
  );
}

// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor:
      colors.white,
  },

});