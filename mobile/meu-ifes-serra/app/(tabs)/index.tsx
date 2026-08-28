import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

type Noticia = {
  id: string;
  titulo: string;
  autor: string;
  data: string;
  imagem?: string;
  texto: string;
  link: string;
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    buscarNoticias();
  }, []);

  // debounce: espera 400ms sem digitar antes de buscar
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim()) {
        pesquisar(search);
      } else {
        buscarNoticias();
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // Recarrega a lista quando a tela volta a receber foco.
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearch('');
      buscarNoticias();
    });
    return unsubscribe;
  }, [navigation]);

  const buscarNoticias = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/noticia');
      const dadosRecebidos = response.data?.items || response.data;
      setNoticias(Array.isArray(dadosRecebidos) ? dadosRecebidos : []);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pesquisar = async (termo: string) => {
    try {
      setIsSearching(true);
      const response = await api.get('/search/noticias', { params: { q: termo } });
      const resultados = response.data?.resultados || [];
      setNoticias(Array.isArray(resultados) ? resultados : []);
    } catch (error) {
      console.error('Erro ao pesquisar notícias:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const abrirLink = async (url?: string | null) => {
  if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir link:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.greenAccent} />
        <Text style={styles.loadingText}>Carregando notícias...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Valor"
            placeholderTextColor="#C7C7C7"
            style={styles.searchInput}
            returnKeyType="search"
          />

          {isSearching ? (
            <ActivityIndicator size="small" color={colors.red} />
          ) : (
            <Ionicons name="search-outline" size={15} color={colors.red} style={styles.searchIcon} />
          )}
        </View>

        <FlatList
          data={noticias}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => abrirLink(item.link)}
            >
              <Image
                source={{
                  uri:
                    item.imagem ||
                    'https://via.placeholder.com/100x80/EEEEEE/CCCCCC?text=',
                }}
                style={styles.noticiaImage}
              />

              <View style={styles.textContainer}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                >
                  {item.titulo || 'Title'}
                </Text>

                <Text
                  style={styles.description}
                  numberOfLines={2}
                >
                  {item.texto ||
                    'Body text for whatever you’d like to say. Add main takeaway points.'}
                </Text>

                <Text style={styles.date}>
                  {formatarData(item.data)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={40} color="#CFCFCF" />
              <Text style={styles.emptyText}>Nenhuma notícia encontrada.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

function formatarData(data: string) {
  if (!data) return '';
  if (data.includes('/')) return data;
  const partes = data.split('-');
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return data;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
  },

  headerGradient: {
    height: 105,
    width: '100%',
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  menuButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },

  headerRight: {
    width: 42,
  },

  content: {
    flex: 1,
    paddingHorizontal: 14,
    marginTop: -2,
  },

  searchContainer: {
    height: 38,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 8,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 13,
    color: '#555',
  },

  searchIcon: {
    marginLeft: 5,
    fontSize: 18,
  },

  listContent: {
    paddingBottom: 90,
  },

  cardSeparator: {
    height: 12,
  },

  card: {
    width: '100%',
    minHeight: 92,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },

  noticiaImage: {
    width: 78,
    height: 70,
    borderRadius: 4,
    backgroundColor: '#E7E7E7',
  },

  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 1,
  },

  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },

  description: {
    fontSize: 11,
    lineHeight: 15,
    color: '#777',
    marginBottom: 3,
  },

  date: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    color: '#222',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#999',
  },
});