import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

type Oportunidade = {
  id: string;
  titulo: string;
  link_vaga: string;
  cargaHoraria?: string | null;
  requisitos?: string | null;
  observacoes?: string | null;
  dataInicioInscricao: string;
  dataFinalInscricao: string;
  diasInscricao: number;
};

export default function OportunidadesScreen() {
  const [oportunidades, setOportunidades] =
    useState<Oportunidade[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [isSearching, setIsSearching] =
    useState(false);

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  useEffect(() => {
    buscarOportunidades();
  }, []);

  // ==================================================
  // BUSCAR OPORTUNIDADES
  // ==================================================

  const buscarOportunidades = async () => {
    try {
      setIsLoading(true);

      const response =
        await api.get('/oportunidade');

      const dados =
        response.data?.items ||
        response.data?.resultados ||
        response.data;

      setOportunidades(
        Array.isArray(dados)
          ? dados
          : []
      );
    } catch (error) {
      console.error(
        'Erro ao buscar oportunidades:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================
  // PESQUISAR
  // ==================================================

  const pesquisar = async (termo: string) => {
    setSearch(termo);

    if (!termo.trim()) {
      buscarOportunidades();
      return;
    }

    try {
      setIsSearching(true);

      const response = await api.get(
        '/search/oportunidades',
        {
          params: {
            q: termo,
          },
        }
      );

      const resultados =
        response.data?.resultados || [];

      setOportunidades(
        Array.isArray(resultados)
          ? resultados
          : []
      );
    } catch (error) {
      console.error(
        'Erro ao pesquisar oportunidades:',
        error
      );
    } finally {
      setIsSearching(false);
    }
  };

  // ==================================================
  // ABRIR VAGA
  // ==================================================

  const abrirVaga = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(
        'Erro ao abrir vaga:',
        error
      );
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.greenAccent}
        />

        <Text style={styles.loadingText}>
          Carregando oportunidades...
        </Text>
      </View>
    );
  }

  // ==================================================
  // TELA
  // ==================================================

  return (
    <View style={styles.container}>

      {/* PESQUISA */}

      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={pesquisar}
          placeholder="Valor"
          placeholderTextColor="#BDBDBD"
          style={styles.searchInput}
        />

        {isSearching ? (
          <ActivityIndicator
            size="small"
            color={colors.red}
          />
        ) : (
          <Ionicons
            name="search-outline"
            size={19}
            color={colors.red}
          />
        )}
      </View>

      {/* LISTA */}

      <FlatList
        data={oportunidades}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <OportunidadeCard
            oportunidade={item}
            expanded={expandedId === item.id}
            onPress={() => {
              setExpandedId(
                expandedId === item.id
                  ? null
                  : item.id
              );
            }}
            abrirVaga={abrirVaga}
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="briefcase-outline"
              size={44}
              color="#D0D0D0"
            />

            <Text style={styles.emptyText}>
              Nenhuma oportunidade encontrada.
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ======================================================
// CARD
// ======================================================

function OportunidadeCard({
  oportunidade,
  expanded,
  onPress,
  abrirVaga,
}: {
  oportunidade: Oportunidade;
  expanded: boolean;
  onPress: () => void;
  abrirVaga: (url: string) => void;
}) {
  return (
    <View style={styles.card}>

      {/* LINHA PRINCIPAL */}

      <TouchableOpacity
        style={styles.mainRow}
        activeOpacity={0.7}
        onPress={onPress}
      >

        <Ionicons
          name={
            expanded
              ? 'bookmark'
              : 'bookmark-outline'
          }
          size={22}
          color={
            expanded
              ? colors.red
              : '#222'
          }
          style={styles.bookmark}
        />

        <View style={styles.titleArea}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {oportunidade.titulo}
          </Text>

          <Text style={styles.expiration}>
            inscrição por {oportunidade.diasInscricao}{' '}
            {oportunidade.diasInscricao === 1 ? 'dia' : 'dias'}
          </Text>
        </View>

        <Text style={styles.detailText}>
          Detal
        </Text>

        <Ionicons
          name={
            expanded
              ? 'chevron-down'
              : 'chevron-forward'
          }
          size={18}
          color="#B5B5B5"
        />

      </TouchableOpacity>

      {/* EXPANDIDO */}

      {expanded && (
        <View style={styles.expandedContent}>

          <Text style={styles.aboutTitle}>
            Sobre a vaga
          </Text>

          <InfoRow
            label="Nome:"
            value={oportunidade.titulo}
          />

          <InfoRow
            label="Carga Horária:"
            value={
              oportunidade.cargaHoraria ||
              '-'
            }
          />

          <InfoRow
            label="Período de inscrição:"
            value={`${oportunidade.dataInicioInscricao} até ${oportunidade.dataFinalInscricao} (${oportunidade.diasInscricao} dias)`}
          />

          <InfoRow
            label="Requisitos:"
            value={
              oportunidade.requisitos ||
              '-'
            }
          />

          <InfoRow
            label="Observações:"
            value={
              oportunidade.observacoes ||
              '-'
            }
          />

          <TouchableOpacity
            style={styles.linkRow}
            activeOpacity={0.7}
            onPress={() =>
              abrirVaga(
                oportunidade.link_vaga
              )
            }
          >
            <Text style={styles.linkLabel}>
              Leia mais em:
            </Text>

            <Text style={styles.link}>
              LINK
            </Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );
}

// ======================================================
// INFORMAÇÃO
// ======================================================

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>

      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>

    </View>
  );
}

// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
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

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,

    elevation: 1,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 13,
    color: '#444',
  },

  listContent: {
    paddingBottom: 90,
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },

  // ----------------------------------------------------
  // CARD
  // ----------------------------------------------------

  card: {
    backgroundColor: colors.white,
  },

  mainRow: {
    minHeight: 46,

    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 8,
  },

  bookmark: {
    width: 30,
    marginRight: 2,
  },

  titleArea: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    minWidth: 0,
  },

  title: {
    flexShrink: 1,

    fontSize: 11,

    fontWeight: '700',

    color: '#222',

    marginRight: 4,
  },

  expiration: {
    fontSize: 10,

    color: colors.red,

    flexShrink: 0,
  },

  detailText: {
    fontSize: 12,

    color: '#999',

    marginLeft: 8,

    marginRight: 4,
  },

  // ----------------------------------------------------
  // EXPANDIDO
  // ----------------------------------------------------

  expandedContent: {
    paddingHorizontal: 4,

    paddingTop: 4,

    paddingBottom: 13,
  },

  aboutTitle: {
    textAlign: 'center',

    fontSize: 12,

    fontWeight: '600',

    color: '#222',

    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',

    marginBottom: 4,
  },

  infoLabel: {
    fontSize: 9.5,

    fontWeight: '700',

    color: '#777',

    width: 100,
  },

  infoValue: {
    flex: 1,

    fontSize: 9.5,

    fontWeight: '500',

    color: '#777',
  },

  linkRow: {
    flexDirection: 'row',

    marginTop: 4,

    alignItems: 'center',
  },

  linkLabel: {
    fontSize: 9.5,

    fontWeight: '700',

    color: '#777',

    marginRight: 4,
  },

  link: {
    fontSize: 9.5,

    fontWeight: '700',

    color: colors.greenAccent,

    textDecorationLine: 'underline',
  },

  // ----------------------------------------------------
  // LOADING
  // ----------------------------------------------------

  loadingContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: colors.white,
  },

  loadingText: {
    marginTop: 10,

    fontSize: 14,

    color: '#777',
  },

  // ----------------------------------------------------
  // VAZIO
  // ----------------------------------------------------

  emptyContainer: {
    alignItems: 'center',

    paddingTop: 80,
  },

  emptyText: {
    marginTop: 12,

    fontSize: 14,

    color: '#999',
  },
});