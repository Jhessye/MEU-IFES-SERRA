// app/(onboarding)/welcome.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/preferences');
  };

  return (
    <View style={styles.container}>
      {/* Bloco que contém TUDO (textos, features e botão) */}
      <View style={styles.content}>

        {/* --- Título principal --- */}
        <Text style={styles.heading}>
          Ola! :D{'\n'}Seja bem vindo ao seu Ifes Serra.
        </Text>

        {/* --- Bloco "O que você vai encontrar aqui" --- */}
        <View style={styles.featuresBlock}>
          <Text style={styles.sectionTitle}>O que você vai encontrar aqui</Text>

          <View style={styles.featuresRow}>
            <Feature icon="newspaper-outline" label="Notícias" />
            <Feature icon="document-text-outline" label="Editais" />
            <Feature icon="briefcase-outline" label="Oportunidades" />
          </View>

          <Text style={styles.description}>
            Acompanhe atualizações, organize seus processos e encontre tudo o
            que você precisa em um só lugar.
          </Text>
        </View>

        {/* --- Botão "Continuar" --- */}
        <Pressable onPress={handleContinue} style={styles.buttonWrapper}>
          <LinearGradient
            colors={[colors.greenAccent, colors.red]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonBorder}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={25} color={colors.white} />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function Feature({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={16} color={colors.red} />
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    // Isso joga o bloco 'content' exatamente no meio vertical da tela
    justifyContent: 'center', 
    // Isso centraliza o bloco 'content' no meio horizontal da tela
    alignItems: 'center',     
  },

  content: {
    width: '100%', 
    // Ao contrário do 'center', isso alinha TODO o texto, as pills e o botão 
    // no canto esquerdo DENTRO desse bloco.
    alignItems: 'flex-start', 
    gap: 24,                
  },

  // --- TÍTULO ---
  heading: {
    fontSize: 36,          
    fontWeight: '700',     
    lineHeight: 50,        
    color: colors.greenDark,
    textAlign: 'left',     // O texto fica alinhado à esquerda
    marginBottom: 35,      // Espaço entre o título e o bloco de features
  },
  redLetter: {
    color: colors.red,     
  },

  // --- BLOCO DAS FEATURES ---
  featuresBlock: {
    width: '100%',
    alignItems: 'flex-start', // O título da seção e a descrição ficam alinhados à esquerda
    gap: 14,                
  },
  sectionTitle: {
    fontSize: 18,           
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'left',      // Alinhado à esquerda
  },
  featuresRow: {
    flexDirection: 'row',    
    flexWrap: 'wrap',        
    justifyContent: 'flex-start', // As "pills" começam na esquerda
    gap: 10,                 
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,                  
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,       
    paddingVertical: 9,      
    paddingHorizontal: 12,   
  },
  featureLabel: {
    fontSize: 13,            
    fontWeight: '600',
    color: colors.textDark,
  },

  description: {
    fontSize: 14,            
    lineHeight: 21,          
    color: colors.textGray,
    textAlign: 'left',       // Alinhado à esquerda
  },

  // --- BOTÃO "CONTINUAR" ---
  buttonWrapper: {
    // Como o pai está 'flex-start', isso aqui faz o botão ter o tamanho exato do conteúdo interno
    // e o mantém alinhado à esquerda junto com o texto!
    alignSelf: 'center', // Centraliza o botão horizontalmente dentro do bloco 'content'
    marginTop: 45, // Espaço extra após a descrição
    width: '80%', // Faz o botão ocupar toda a largura do bloco 'content'
  },
  buttonBorder: {
    padding: 2,               
    borderRadius: 14,         
  },
  buttonInner: {
    flexDirection: 'row',
    gap: 8,                   
    height: 48,                
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.greenAccent,
    borderRadius: 12,          
    paddingHorizontal: 24,     // Adicionei isso para o botão não ficar "apertado"
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,               
    fontWeight: '700',
  },
});