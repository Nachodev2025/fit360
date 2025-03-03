import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto
const OnboardingContext = createContext();

// Proveedor del contexto
export const OnboardingProvider = ({ children }) => {
  const [responses, setResponses] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Cargar datos guardados (si existen)
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedResponses = await AsyncStorage.getItem('onboardingResponses');
        const savedProfile = await AsyncStorage.getItem('userProfile');
        const savedStep = await AsyncStorage.getItem('currentOnboardingStep');
        
        if (savedResponses) setResponses(JSON.parse(savedResponses));
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));
        if (savedStep) setCurrentStep(parseInt(savedStep, 10));
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    };
    
    loadSavedData();
  }, []);
  
  // Guardar respuestas cuando cambien
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      AsyncStorage.setItem('onboardingResponses', JSON.stringify(responses))
        .catch(error => console.error('Error saving responses:', error));
    }
  }, [responses]);
  
  // Guardar perfil cuando cambie
  useEffect(() => {
    if (Object.keys(userProfile).length > 0) {
      AsyncStorage.setItem('userProfile', JSON.stringify(userProfile))
        .catch(error => console.error('Error saving user profile:', error));
    }
  }, [userProfile]);
  
  // Guardar paso actual
  useEffect(() => {
    AsyncStorage.setItem('currentOnboardingStep', currentStep.toString())
      .catch(error => console.error('Error saving current step:', error));
  }, [currentStep]);
  
  // Añadir una respuesta
  const addResponse = (questionId, response) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };
  
  // Actualizar el perfil del usuario
  const updateUserProfile = (data) => {
    setUserProfile(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Avanzar al siguiente paso
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  // Retroceder al paso anterior
  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  // Marcar el onboarding como completado
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setIsComplete(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };
  
  // Reiniciar solo las respuestas
  const resetResponses = () => {
    setResponses({});
    AsyncStorage.removeItem('onboardingResponses')
      .catch(error => console.error('Error removing responses:', error));
  };
  
  // Reiniciar el onboarding
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.multiRemove([
        'onboardingResponses',
        'userProfile',
        'currentOnboardingStep',
        'hasCompletedOnboarding'
      ]);
      setResponses({});
      setUserProfile({});
      setCurrentStep(0);
      setIsComplete(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };
  
  // Calcular resultados basados en respuestas
  const calculateResults = () => {
    // Aquí implementaremos la lógica para calcular resultados personalizados
    // basados en las respuestas del usuario
    const primaryFocus = responses.primaryFocus || 'physical';
    
    // Cálculos de ejemplo
    let results = {
      focusArea: primaryFocus,
      potentialProgress: {
        physical: primaryFocus === 'physical' ? 'alto' : 'medio',
        mental: primaryFocus === 'mental' ? 'alto' : 'medio',
        energy: primaryFocus === 'energy' ? 'alto' : 'medio'
      },
      recommendedPlan: `Plan360 ${primaryFocus.charAt(0).toUpperCase() + primaryFocus.slice(1)}`,
      estimatedTimeToResults: primaryFocus === 'physical' ? '8 semanas' : '4 semanas'
    };
    
    return results;
  };
  
  const value = {
    responses,
    userProfile,
    currentStep,
    isComplete,
    addResponse,
    updateUserProfile,
    nextStep,
    prevStep,
    completeOnboarding,
    resetOnboarding,
    resetResponses,
    calculateResults
  };
  
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook personalizado
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding debe usarse dentro de un OnboardingProvider');
  }
  return context;
};

export default useOnboarding; 