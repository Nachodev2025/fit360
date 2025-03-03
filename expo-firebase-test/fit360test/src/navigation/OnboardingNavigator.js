import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importamos las pantallas de onboarding
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import QuestionnaireScreen from '../screens/onboarding/QuestionnaireScreen';
import PersonalizationScreen from '../screens/onboarding/PersonalizationScreen';
import ResultsPreviewScreen from '../screens/onboarding/ResultsPreviewScreen';
import PaywallScreen from '../screens/onboarding/PaywallScreen';

// Importamos las pantallas de autenticación necesarias para el flujo
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
  // Para depuración: imprimir las rutas disponibles
  useEffect(() => {
    console.log('OnboardingNavigator rutas disponibles:');
    console.log('- Welcome');
    console.log('- Questionnaire');
    console.log('- Personalization');
    console.log('- ResultsPreview');
    console.log('- Register');
    console.log('- Paywall');
  }, []);

  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' }
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
      <Stack.Screen name="Personalization" component={PersonalizationScreen} />
      <Stack.Screen name="ResultsPreview" component={ResultsPreviewScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator; 