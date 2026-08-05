import React, { useState } from 'react';
import { View, Text, Button, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Estado das opções de notificação
  const [pref1, setPref1] = useState(false);
  const [pref2, setPref2] = useState(false);
  const [pref3, setPref3] = useState(false);

  const handleSaveAndContinue = async () => {
    // Gera um ID aleatório local se não existir
    const newUserId = Math.random().toString(36).substring(2, 9); 
    
    // Salva localmente
    await AsyncStorage.setItem('user_id', newUserId);
    await AsyncStorage.setItem('user_preferences', JSON.stringify({ pref1, pref2, pref3 }));
    await AsyncStorage.setItem('has_completed_onboarding', 'true');

    // Redireciona para a home
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bem-vindo!</Text>
      <Text>Escolha o que deseja receber por notificação:</Text>

      {/* Opção 1 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text>Notificação Tipo 1</Text>
        <Switch value={pref1} onValueChange={setPref1} />
      </View>

      {/* Opção 2 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text>Notificação Tipo 2</Text>
        <Switch value={pref2} onValueChange={setPref2} />
      </View>

      {/* Opção 3 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text>Notificação Tipo 3</Text>
        <Switch value={pref3} onValueChange={setPref3} />
      </View>

      <Button title="Avançar para o App" onPress={handleSaveAndContinue} />
    </View>
  );
}