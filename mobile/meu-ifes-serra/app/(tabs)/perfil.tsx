import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export default function PerfilScreen() {
  const router = useRouter();

  const voltar = () => {
    router.back();
  };

  const abrirSalvos = () => {
    router.push('/(tabs)/salvos');
  };

  const sair = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            // futuramente:
            // limpar token / usuário
          },
        },
      ]
    );
  };

  const excluirConta = () => {
    Alert.alert(
      'Excluir conta',
      'Essa ação não poderá ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // futuramente:
            // chamar API para excluir conta
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* ==============================================
          HEADER
          ============================================== */}

      <LinearGradient
        colors={[
          colors.greenAccent,
          '#7bc284',
          '#ffffff',
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >

        <SafeAreaView
          edges={['top']}
          style={styles.header}
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={voltar}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={27}
              color={colors.red}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Perfil
          </Text>

          <View style={styles.headerRight} />

        </SafeAreaView>

      </LinearGradient>

      {/* ==============================================
          CONTEÚDO
          ============================================== */}

      <View style={styles.content}>

        <Text style={styles.sectionTitle}>
          Serviços
        </Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={abrirSalvos}
        >
          <Ionicons
            name="save-outline"
            size={23}
            color="#292929"
          />

          <Text style={styles.optionText}>
            Salvos
          </Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>
          Sua conta
        </Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={sair}
        >
          <Ionicons
            name="log-out-outline"
            size={23}
            color="#292929"
          />

          <Text style={styles.optionText}>
            Sair
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={excluirConta}
        >
          <Ionicons
            name="close-circle-outline"
            size={23}
            color={colors.red}
          />

          <Text
            style={[
              styles.optionText,
              styles.deleteText,
            ]}
          >
            Excluir conta
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  headerGradient: {
    height: 130,
    width: '100%',
  },

  header: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,
  },

  backButton: {
    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,

    textAlign: 'center',

    fontSize: 26,

    fontWeight: '600',

    color: colors.white,
  },

  headerRight: {
    width: 50,
  },

  content: {
    flex: 1,

    paddingHorizontal: 18,

    paddingTop: 8,
  },

  sectionTitle: {
    fontSize: 13,

    color: '#777',

    marginTop: 4,

    marginBottom: 10,

    fontWeight: '500',
  },

  option: {
    minHeight: 43,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    paddingHorizontal: 2,
  },

  optionText: {
    fontSize: 14,

    fontWeight: '600',

    color: '#222',
  },

  deleteText: {
    color: colors.red,
  },

  separator: {
    height: 1,

    backgroundColor: '#E8E8E8',

    marginVertical: 12,
  },
});