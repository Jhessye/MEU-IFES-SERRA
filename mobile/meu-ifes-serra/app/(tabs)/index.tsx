// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListContainer } from '@/components/ListContainer'; 
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

// --- 1. DEFININDO O TIPO EXATO DOS DADOS ---
type Noticia = {
  id: string;
  titulo: string;
  autor: string;
  data: string;       // Vai vir do banco (ex: "2026-08-10" ou "10/08/2026")
  imagem?: string;    // Opcional (URL da imagem)
  texto: string;
  link: string;      // Opcional
};

export default function HomeScreen() {
  // --- 2. ESTADOS DO REACT ---
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 3. BUSCAR DADOS DO BACKEND ---
  useEffect(() => {
    buscarNoticias();
  }, []);

  const buscarNoticias = async () => {
    try {
      setIsLoading(true);
      // Bate na rota GET /noticia do seu Flask
      const response = await api.get('/noticia');
      
      // Lógica esperta: Se o backend retornar { items: [...] }, usa items. 
      // Se retornar a lista direta, usa o próprio response.data.
      const dadosRecebidos = response.data?.items || response.data;

      setNoticias(dadosRecebidos);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. TELA DE LOADING ---
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.greenAccent} />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando notícias...</Text>
      </SafeAreaView>
    );
  }

  // --- 5. RENDERIZAÇÃO DA TELA ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notícias</Text>
      </View>

      {/* Lista utilizando o componente ListContainer */}
      <ListContainer
        data={noticias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            
            {/* Imagem (Usa um placeholder se não tiver imagem cadastrada) */}
            <Image 
              source={{ uri: item.imagem || 'https://via.placeholder.com/150/EEEEEE/333333?text=IFES' }} 
              style={styles.noticiaImage} 
            />
            
            {/* Textos */}
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>{item.titulo}</Text>
              <Text style={styles.author}>Por: {item.autor}</Text>
              
              <View style={styles.footerRow}>
                {/* Exibe a data */}
                <Text style={styles.date}>{item.data}</Text>
                {/* Ícone de seta */}
                <Ionicons name="chevron-forward" size={16} color={colors.greenAccent} />
              </View>
            </View>

          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// --- 6. ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.greenDark,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noticiaImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  author: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});