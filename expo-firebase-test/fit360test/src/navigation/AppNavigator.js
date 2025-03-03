import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import OnboardingNavigator from './OnboardingNavigator';

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [checkingOnboardingStatus, setCheckingOnboardingStatus] = useState(true);

  // Verificar si el usuario ya completó el onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasCompletedOnboarding');
        setHasCompletedOnboarding(value === 'true');
        setCheckingOnboardingStatus(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setCheckingOnboardingStatus(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (loading || checkingOnboardingStatus) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3E64FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!hasCompletedOnboarding ? (
        <OnboardingNavigator />
      ) : (
        user ? <HomeNavigator /> : <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default AppNavigator; 