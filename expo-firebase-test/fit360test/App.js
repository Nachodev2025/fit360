import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

// Definir el tema personalizado
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3E64FF',
    accent: '#FF3A59',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#2E2E2E',
    error: '#ff3b30',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
