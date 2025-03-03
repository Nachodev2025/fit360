import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importaremos las pantallas de onboarding a medida que las creemos
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import QuestionnaireScreen from '../screens/onboarding/QuestionnaireScreen';
import PersonalizationScreen from '../screens/onboarding/PersonalizationScreen';
import ResultsPreviewScreen from '../screens/onboarding/ResultsPreviewScreen';
import PaywallScreen from '../screens/onboarding/PaywallScreen';

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
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
      <Stack.Screen name="Paywall" component={PaywallScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator; 