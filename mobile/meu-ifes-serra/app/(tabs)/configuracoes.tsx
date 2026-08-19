import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  const [noticias, setNoticias] = useState(true);
  const [oportunidades, setOportunidades] =
    useState(true);
  const [editais, setEditais] = useState(false);

  const voltar = () => {
    router.back();
  };

  const abrirTermos = async () => {
    // Substitua pela URL real dos termos quando tiver.
    // await Linking.openURL('https://...');
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
            Configurações
          </Text>

          <View style={styles.headerRight} />

        </SafeAreaView>

      </LinearGradient>

      {/* ==============================================
          CONTEÚDO
          ============================================== */}

      <View style={styles.content}>

        {/* NOTIFICAÇÕES */}

        <Text style={styles.sectionTitle}>
          Ativar Notificações
        </Text>

        <NotificationRow
          label="Notícias"
          value={noticias}
          onChange={setNoticias}
          activeColor={colors.red}
        />

        <NotificationRow
          label="Oportunidades"
          value={oportunidades}
          onChange={setOportunidades}
          activeColor={colors.red}
        />

        <NotificationRow
          label="Editais"
          value={editais}
          onChange={setEditais}
          activeColor="#222"
        />

        {/* SEPARADOR */}

        <View style={styles.separator} />

        {/* SEGURANÇA */}

        <Text style={styles.sectionTitle}>
          Segurança e Permissões
        </Text>

        <TouchableOpacity
          style={styles.termsRow}
          activeOpacity={0.7}
          onPress={abrirTermos}
        >

          <Ionicons
            name="document-text-outline"
            size={22}
            color="#292929"
          />

          <Text style={styles.termsText}>
            Termos de Uso
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

// ======================================================
// SWITCH
// ======================================================

function NotificationRow({
  label,
  value,
  onChange,
  activeColor,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  activeColor: string;
}) {
  return (
    <View style={styles.notificationRow}>

      <Text
        style={[
          styles.notificationLabel,
          {
            color: value
              ? activeColor
              : '#222',
          },
        ]}
      >
        {label}
      </Text>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: '#D9D9D9',
          true: '#4CC463',
        }}
        thumbColor={colors.white}
        ios_backgroundColor="#D9D9D9"
      />

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
    fontSize: 14,

    color: '#8A8A8A',

    fontWeight: '600',

    marginTop: 5,

    marginBottom: 10,
  },

  notificationRow: {
    height: 40,

    width: 174,

    borderRadius: 22,

    backgroundColor: '#E9E9EB',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingLeft: 14,

    paddingRight: 6,

    marginBottom: 8,
  },

  notificationLabel: {
    fontSize: 14,

    fontWeight: '500',
  },

  separator: {
    height: 1,

    backgroundColor: '#E8E8E8',

    marginTop: 10,

    marginBottom: 12,
  },

  termsRow: {
    height: 40,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    paddingHorizontal: 2,
  },

  termsText: {
    fontSize: 13,

    fontWeight: '600',

    color: '#222',
  },

});