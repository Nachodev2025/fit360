import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(true);
  const { resetPassword, loading } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      setMessage('Por favor, ingresa tu dirección de email');
      setIsError(true);
      setSnackbarVisible(true);
      return;
    }

    try {
      await resetPassword(email);
      setMessage('Se ha enviado un enlace de recuperación a tu email');
      setIsError(false);
      setSnackbarVisible(true);
      // Limpiar el campo de email después de un envío exitoso
      setEmail('');
    } catch (error) {
      let errorMsg = 'Error al enviar el email de recuperación';
      
      if (error.message.includes('auth/user-not-found')) {
        errorMsg = 'No hay cuenta asociada a este email';
      } else if (error.message.includes('auth/invalid-email')) {
        errorMsg = 'Email inválido';
      }
      
      setMessage(errorMsg);
      setIsError(true);
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.logo}
          />
          <Text style={styles.appName}>Fit360</Text>
        </View>
        
        <Surface style={styles.formContainer}>
          <Text style={styles.title}>Recuperar Contraseña</Text>
          
          <Text style={styles.instructions}>
            Ingresa la dirección de email asociada a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
          
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
          
          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : "Enviar Enlace"}
          </Button>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Volver a Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={isError ? styles.errorSnackbar : styles.successSnackbar}
      >
        {message}
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3E64FF',
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
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    color: '#666',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    padding: 5,
    marginBottom: 20,
  },
  linksContainer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#3E64FF',
    fontWeight: 'bold',
  },
  errorSnackbar: {
    backgroundColor: '#ff3b30',
  },
  successSnackbar: {
    backgroundColor: '#34c759',
  },
});

export default ForgotPasswordScreen; 