import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../hooks/useOnboarding';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const { resetResponses } = useOnboarding();

  const startOnboarding = () => {
    // Reiniciamos las respuestas al comenzar
    resetResponses();
    navigation.navigate('Questionnaire');
  };

  const goToLogin = () => {
    // Marca el onboarding como completado y navega a la autenticación
    AsyncStorage.setItem('hasCompletedOnboarding', 'true')
      .then(() => {
        // El AppNavigator maneja la navegación automáticamente
      })
      .catch(error => console.error('Error storing onboarding status:', error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#3E64FF', '#5D7DFF']}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="dumbbell" size={80} color="white" />
            <Text style={styles.logoText}>FIT360</Text>
          </View>
          
          <Text style={styles.title}>Transforma tu vida en 360°</Text>
          <Text style={styles.subtitle}>
            Descubre tu Plan360 personalizado en menos de 3 minutos
          </Text>
          
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={startOnboarding}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>Descubrir mi plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={goToLogin}
          >
            <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
          </TouchableOpacity>
          
          <View style={styles.indicatorContainer}>
            <Text style={styles.indicatorText}>
              Más de 50,000 personas han transformado su vida con Fit360
            </Text>
          </View>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mainButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: width * 0.8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mainButtonText: {
    color: '#3E64FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: width * 0.8,
    alignItems: 'center',
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 30,
    width: width * 0.8,
    alignItems: 'center',
  },
  indicatorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default WelcomeScreen; 