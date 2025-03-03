import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from '../../hooks/useOnboarding';

const { width, height } = Dimensions.get('window');

const PLANS = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: 'Gratis',
    features: [
      'Rutinas de ejercicio básicas',
      'Consejos generales de nutrición',
      'Seguimiento manual',
      'Acceso a 3 meditaciones'
    ],
    limited: true,
    color: ['#f5f5f5', '#f9f9f9'],
    recommended: false
  },
  {
    id: 'premium',
    name: 'Plan360 Premium',
    originalPrice: '$19.99',
    price: '$9.99',
    period: 'mes',
    discount: '50% OFF',
    features: [
      'Plan personalizado completo',
      'Adaptación semanal automática',
      'Seguimiento detallado de progreso',
      'Acceso a todas las meditaciones',
      'Recetas personalizadas',
      'Soporte comunitario',
      'Sin anuncios'
    ],
    limited: false,
    color: ['#3E64FF', '#5D7DFF'],
    recommended: true
  },
  {
    id: 'pro',
    name: 'Plan360+',
    price: '$14.99',
    period: 'mes',
    features: [
      'Todo lo del Plan Premium',
      'Sesiones virtuales mensuales',
      'Consultas nutricionales',
      'Prioridad en soporte',
      'Acceso anticipado a nuevas funciones'
    ],
    limited: false,
    color: ['#333333', '#555555'],
    recommended: false
  }
];

const PaywallScreen = ({ navigation, route }) => {
  const { completeOnboarding } = useOnboarding();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [timerHours, setTimerHours] = useState(23);
  const [timerMinutes, setTimerMinutes] = useState(59);
  const [timerSeconds, setTimerSeconds] = useState(59);
  const fadeAnim = new Animated.Value(0);
  
  // Iniciar contador de tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerSeconds > 0) {
        setTimerSeconds(timerSeconds - 1);
      } else {
        if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          if (timerHours > 0) {
            setTimerHours(timerHours - 1);
            setTimerMinutes(59);
            setTimerSeconds(59);
          } else {
            clearInterval(interval);
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerHours, timerMinutes, timerSeconds]);
  
  // Animar la aparición de la pantalla
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start();
  }, []);
  
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };
  
  const handleContinue = async () => {
    // Simular compra del plan
    await AsyncStorage.setItem('userPlan', selectedPlan);
    
    // Marcar el onboarding como completado
    await completeOnboarding();
    
    // Navegar a la pantalla principal
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };
  
  const handleSkip = async () => {
    // Seleccionar plan básico
    await AsyncStorage.setItem('userPlan', 'basic');
    
    // Marcar el onboarding como completado
    await completeOnboarding();
    
    // Navegar a la pantalla principal
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };
  
  const renderPlanCard = (plan) => {
    const isSelected = selectedPlan === plan.id;
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlanCard
        ]}
        onPress={() => handleSelectPlan(plan.id)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={plan.color}
          style={styles.planCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {plan.recommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Recomendado</Text>
            </View>
          )}
          
          <View style={styles.planHeader}>
            <Text style={[
              styles.planName,
              plan.id !== 'basic' && styles.premiumPlanName
            ]}>
              {plan.name}
            </Text>
            
            <View style={styles.priceContainer}>
              {plan.originalPrice && (
                <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
              )}
              <Text style={[
                styles.planPrice,
                plan.id !== 'basic' && styles.premiumPlanPrice
              ]}>
                {plan.price}
              </Text>
              {plan.period && (
                <Text style={[
                  styles.pricePeriod,
                  plan.id !== 'basic' && styles.premiumPricePeriod
                ]}>
                  /{plan.period}
                </Text>
              )}
            </View>
            
            {plan.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{plan.discount}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.featuresContainer}>
            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={18} 
                  color={plan.id !== 'basic' ? '#FFFFFF' : '#3E64FF'} 
                />
                <Text style={[
                  styles.featureText,
                  plan.id !== 'basic' && styles.premiumFeatureText
                ]}>
                  {feature}
                </Text>
              </View>
            ))}
            
            {plan.limited && (
              <View style={styles.limitedContainer}>
                <Ionicons name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={styles.limitedText}>Funciones limitadas</Text>
              </View>
            )}
          </View>
          
          <View style={styles.selectContainer}>
            <View style={[
              styles.radioButton,
              isSelected && styles.radioButtonSelected,
              plan.id !== 'basic' && isSelected && styles.premiumRadioSelected
            ]}>
              {isSelected && (
                <View style={[
                  styles.radioInner,
                  plan.id !== 'basic' && styles.premiumRadioInner
                ]} />
              )}
            </View>
            <Text style={[
              styles.selectText,
              plan.id !== 'basic' && styles.premiumSelectText
            ]}>
              {isSelected ? 'Seleccionado' : 'Seleccionar'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Elige tu Plan360</Text>
          <Text style={styles.headerSubtitle}>
            Selecciona el plan que mejor se adapte a tus objetivos
          </Text>
        </View>
        
        <View style={styles.timerContainer}>
          <FontAwesome name="clock-o" size={18} color="#FF6B6B" />
          <Text style={styles.timerText}>
            Oferta por tiempo limitado: {timerHours.toString().padStart(2, '0')}:
            {timerMinutes.toString().padStart(2, '0')}:
            {timerSeconds.toString().padStart(2, '0')}
          </Text>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.plansContainer}
          showsVerticalScrollIndicator={false}
        >
          {PLANS.map(plan => renderPlanCard(plan))}
          
          <View style={styles.guaranteeContainer}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#3E64FF" />
            <Text style={styles.guaranteeText}>
              Garantía de devolución de 14 días sin preguntas
            </Text>
          </View>
          
          <View style={styles.testimonialsContainer}>
            <Text style={styles.testimonialsTitle}>Lo que dicen nuestros usuarios</Text>
            
            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatar}>
                  <Text style={styles.avatarText}>MR</Text>
                </View>
                <View>
                  <Text style={styles.testimonialName}>María R.</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Ionicons 
                        key={star} 
                        name="star" 
                        size={14} 
                        color="#FFD700" 
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "Después de probar muchas apps, Fit360 es la única que realmente se adaptó a mi rutina. 
                He perdido 8kg en 2 meses siguiendo mi Plan360 personalizado."
              </Text>
            </View>
            
            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={[styles.testimonialAvatar, { backgroundColor: '#5D7DFF' }]}>
                  <Text style={styles.avatarText}>JL</Text>
                </View>
                <View>
                  <Text style={styles.testimonialName}>Juan L.</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Ionicons 
                        key={star} 
                        name="star" 
                        size={14} 
                        color="#FFD700" 
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "Mi nivel de estrés ha bajado considerablemente desde que uso la app. 
                Las meditaciones y ejercicios recomendados son justo lo que necesitaba."
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              {selectedPlan === 'basic' ? 'Continuar con plan básico' : 'Obtener mi Plan360'}
            </Text>
          </TouchableOpacity>
          
          {selectedPlan !== 'basic' && (
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>No ahora, usar versión básica</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEAEA',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  plansContainer: {
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  planCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: '#3E64FF',
  },
  planCardGradient: {
    borderRadius: 16,
    padding: 15,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3E64FF',
  },
  planHeader: {
    marginBottom: 15,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  premiumPlanName: {
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  premiumPlanPrice: {
    color: '#FFFFFF',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#555555',
    marginLeft: 2,
  },
  premiumPricePeriod: {
    color: 'rgba(255,255,255,0.9)',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  featuresContainer: {
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
    flex: 1,
  },
  premiumFeatureText: {
    color: '#FFFFFF',
  },
  limitedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  limitedText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 5,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3E64FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    borderColor: '#3E64FF',
  },
  premiumRadioSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3E64FF',
  },
  premiumRadioInner: {
    backgroundColor: '#FFFFFF',
  },
  selectText: {
    fontSize: 14,
    color: '#3E64FF',
    fontWeight: '500',
  },
  premiumSelectText: {
    color: '#FFFFFF',
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  guaranteeText: {
    fontSize: 14,
    color: '#444444',
    marginLeft: 8,
  },
  testimonialsContainer: {
    marginTop: 10,
  },
  testimonialsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3E64FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  testimonialText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#3E64FF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'underline',
  }
});

export default PaywallScreen; 