import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Image, 
  Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../hooks/useOnboarding';

const { width, height } = Dimensions.get('window');

const ResultsPreviewScreen = ({ navigation }) => {
  const { responses, userProfile, calculateResults, nextStep } = useOnboarding();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const results = calculateResults();
  const { focusArea, potentialProgress, recommendedPlan, estimatedTimeToResults } = results;
  
  const getWeightGoalText = () => {
    if (!userProfile.weight || !userProfile.mainGoal) return '';
    
    if (userProfile.mainGoal === 'perder_peso') {
      const potentialLoss = Math.round(Number(userProfile.weight) * 0.08); // ~8% del peso en 8 semanas
      return `Podrías perder hasta ${potentialLoss} kg en 8 semanas`;
    } else if (userProfile.mainGoal === 'ganar_musculo') {
      return 'Podrías aumentar tu masa muscular hasta un 12% en 12 semanas';
    } else {
      return 'Podrías optimizar tu composición corporal en 6 semanas';
    }
  };
  
  const handleContinue = () => {
    // Avanzar al siguiente paso
    nextStep();
    // Navegar a la pantalla de registro
    navigation.navigate('Register', { fromOnboarding: true });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#3E64FF', '#5D7DFF']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tu Plan360 está listo</Text>
          <Text style={styles.headerSubtitle}>Basado en tus respuestas, hemos creado un plan totalmente personalizado</Text>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultCard}>
            <Animated.View 
              style={[
                styles.cardContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.planNameContainer}>
                <Text style={styles.planLabel}>Tu plan recomendado:</Text>
                <Text style={styles.planName}>{recommendedPlan}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.resultItem}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="calendar-clock" size={28} color="#3E64FF" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Tiempo estimado para ver resultados:</Text>
                  <Text style={styles.resultValue}>{estimatedTimeToResults}</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="weight" size={24} color="#3E64FF" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Proyección de resultados:</Text>
                  <Text style={styles.resultValue}>{getWeightGoalText()}</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.iconContainer}>
                  <Ionicons name="time-outline" size={28} color="#3E64FF" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Tiempo diario requerido:</Text>
                  <Text style={styles.resultValue}>{userProfile.availableTime} minutos</Text>
                </View>
              </View>
              
              <View style={styles.planPreviewContainer}>
                <Text style={styles.previewTitle}>Vista previa de tu plan</Text>
                <Text style={styles.previewSubtitle}>Un vistazo a lo que te espera</Text>
                
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewHeaderText}>Día 1</Text>
                  </View>
                  <View style={styles.previewContent}>
                    <Text style={styles.previewItemTitle}>Entrenamiento</Text>
                    <Text style={styles.previewItemText}>• 5 min calentamiento</Text>
                    <Text style={styles.previewItemText}>• 15 min rutina principal</Text>
                    <Text style={styles.previewItemText}>• 5 min enfriamiento</Text>
                    
                    <Text style={[styles.previewItemTitle, {marginTop: 10}]}>Nutrición</Text>
                    <Text style={styles.previewItemText}>• Desayuno balanceado</Text>
                    <Text style={styles.previewItemText}>• Almuerzo con proteínas</Text>
                    <Text style={styles.previewItemBlurred}>• Cena personalizada</Text>
                    
                    <LinearGradient
                      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,1)']}
                      style={styles.blurOverlay}
                    >
                      <View style={styles.lockContainer}>
                        <Ionicons name="lock-closed" size={24} color="#3E64FF" />
                        <Text style={styles.lockText}>Desbloquea tu plan completo</Text>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              </View>
              
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Beneficios de tu Plan360</Text>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={22} color="#3E64FF" />
                  <Text style={styles.benefitText}>Plan personalizado según tus necesidades</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={22} color="#3E64FF" />
                  <Text style={styles.benefitText}>Ajustes semanales basados en tu progreso</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={22} color="#3E64FF" />
                  <Text style={styles.benefitText}>Seguimiento detallado de tus métricas</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={22} color="#3E64FF" />
                  <Text style={styles.benefitText}>Acceso a comunidad de apoyo</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Crear mi cuenta para acceder</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.footerNote}>
            ¡A un paso de transformar tu vida con Fit360!
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardContent: {
    padding: 20,
  },
  planNameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E64FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 15,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  planPreviewContainer: {
    marginTop: 25,
    marginBottom: 15,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  previewCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  previewHeader: {
    backgroundColor: '#3E64FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  previewHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  previewContent: {
    padding: 15,
    position: 'relative',
  },
  previewItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  previewItemText: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  previewItemBlurred: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  blurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  lockText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3E64FF',
    marginLeft: 5,
  },
  benefitsContainer: {
    marginTop: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#444444',
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(62, 100, 255, 0.9)',
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  continueButtonText: {
    color: '#3E64FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  footerNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  }
});

export default ResultsPreviewScreen; 