import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, ingresa tu email y contraseña');
      setSnackbarVisible(true);
      return;
    }

    try {
      await signIn(email, password);
      // No need to navigate - AuthNavigator will handle this automatically
    } catch (error) {
      let message = 'Error de inicio de sesión';
      
      if (error.message.includes('auth/user-not-found') || error.message.includes('auth/wrong-password')) {
        message = 'Email o contraseña incorrectos';
      } else if (error.message.includes('auth/invalid-email')) {
        message = 'Email inválido';
      } else if (error.message.includes('auth/too-many-requests')) {
        message = 'Demasiados intentos fallidos. Intenta más tarde';
      }
      
      setErrorMessage(message);
      setSnackbarVisible(true);
    }
  };

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
          <Text style={styles.title}>Iniciar Sesión</Text>
          
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
          
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : "Iniciar Sesión"}
          </Button>
          
          <View style={styles.registerContainer}>
            <Text>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Regístrate</Text>
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#3E64FF',
  },
  button: {
    padding: 5,
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#3E64FF',
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#ff3b30',
  },
});

export default LoginScreen; 