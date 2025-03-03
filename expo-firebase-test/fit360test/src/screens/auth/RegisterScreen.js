import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { useOnboarding } from '../../hooks/useOnboarding';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signUp, loading } = useAuth();
  const { responses, userProfile } = useOnboarding();
  
  // Verificar si viene del onboarding
  const fromOnboarding = route.params?.fromOnboarding;
  
  useEffect(() => {
    // Si viene de onboarding, podemos personalizar la experiencia
    if (fromOnboarding) {
      // Podríamos precompletar algún dato si lo hubiéramos recolectado
    }
  }, [fromOnboarding]);

  const validatePassword = (password) => {
    // Al menos 8 caracteres, una letra y un número
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleRegister = async () => {
    // Validaciones
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Por favor, completa todos los campos');
      setSnackbarVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setSnackbarVisible(true);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números');
      setSnackbarVisible(true);
      return;
    }

    try {
      await signUp(email, password);
      // Si viene del onboarding, navegar a la pantalla de paywall
      if (fromOnboarding) {
        navigation.navigate('Paywall');
      }
      // De lo contrario, el AuthNavigator manejará la navegación
    } catch (error) {
      let message = 'Error al crear la cuenta';
      
      if (error.message.includes('auth/email-already-in-use')) {
        message = 'Este email ya está en uso';
      } else if (error.message.includes('auth/invalid-email')) {
        message = 'Email inválido';
      } else if (error.message.includes('auth/weak-password')) {
        message = 'La contraseña es demasiado débil';
      }
      
      setErrorMessage(message);
      setSnackbarVisible(true);
    }
  };

  // Renderizar una versión especial si viene del onboarding
  if (fromOnboarding) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.onboardingContainer}
      >
        <ScrollView contentContainerStyle={styles.onboardingScrollContent}>
          <LinearGradient
            colors={['#3E64FF', '#5D7DFF']}
            style={styles.onboardingHeader}
          >
            <Text style={styles.onboardingTitle}>¡Tu Plan360 está listo!</Text>
            <Text style={styles.onboardingSubtitle}>
              Crea tu cuenta para acceder a tu plan personalizado
            </Text>
          </LinearGradient>
          
          <Surface style={styles.onboardingFormContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
            />
            
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
              left={<TextInput.Icon icon="lock" />}
            />

            <TextInput
              label="Confirmar Contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
              left={<TextInput.Icon icon="lock-check" />}
              error={confirmPassword !== '' && password !== confirmPassword}
            />
            
            {password !== '' && !validatePassword(password) && (
              <Text style={styles.passwordHint}>
                La contraseña debe tener al menos 8 caracteres, incluyendo letras y números
              </Text>
            )}
            
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.onboardingButton}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : "Crear cuenta y ver mi plan"}
            </Button>
            
            <View style={styles.loginContainer}>
              <Text>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Inicia Sesión</Text>
              </TouchableOpacity>
            </View>
          </Surface>
        </ScrollView>
        
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {errorMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    );
  }

  // Renderizar la versión original si no viene del onboarding
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.logo}
          />
          <Text style={styles.appName}>Fit360</Text>
          <Text style={styles.tagline}>Tu compañero fitness integral</Text>
        </View>
        
        <Surface style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />
          
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
            left={<TextInput.Icon icon="lock" />}
          />

          <TextInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
            left={<TextInput.Icon icon="lock-check" />}
            error={confirmPassword !== '' && password !== confirmPassword}
          />
          
          {password !== '' && !validatePassword(password) && (
            <Text style={styles.passwordHint}>
              La contraseña debe tener al menos 8 caracteres, incluyendo letras y números
            </Text>
          )}
          
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : "Registrarse"}
          </Button>
          
          <View style={styles.loginContainer}>
            <Text>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {errorMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#3E64FF',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  passwordHint: {
    color: 'orange',
    fontSize: 12,
    marginBottom: 15,
  },
  button: {
    padding: 5,
    marginVertical: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#3E64FF',
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#ff3b30',
  },
  
  // Estilos para el flujo de onboarding
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  onboardingScrollContent: {
    flexGrow: 1,
  },
  onboardingHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  onboardingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  onboardingFormContainer: {
    marginTop: -20,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  onboardingButton: {
    padding: 5,
    marginVertical: 20,
    backgroundColor: '#3E64FF',
  }
});

export default RegisterScreen; 