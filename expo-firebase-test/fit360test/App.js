import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

import { AuthProvider } from './src/hooks/useAuth';
import { OnboardingProvider } from './src/hooks/useOnboarding';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorar algunos mensajes de advertencia específicos
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted from react-native',
  'Non-serializable values were found in the navigation state',
]);

// Definir un tema personalizado para la aplicación
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3E64FF',
    accent: '#5D7DFF',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    error: '#FF6B6B',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <PaperProvider theme={theme}>
        <AuthProvider>
          <OnboardingProvider>
            <AppNavigator />
          </OnboardingProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
