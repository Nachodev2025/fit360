import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, Text, Snackbar, Card } from 'react-native-paper';
import firebase from '../util/firebase';

const ExpoAuthTest = () => {
  // State for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for signup
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  
  // State for messages
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  
  // State for user
  const [user, setUser] = useState<firebase.User | null>(null);
  
  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Function to handle login
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter email and password');
      setVisible(true);
      return;
    }
    
    try {
      setLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setMessage('Login successful!');
      setVisible(true);
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during login');
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle signup
  const handleSignup = async () => {
    if (!signupEmail || !signupPassword) {
      setMessage('Please enter email and password');
      setVisible(true);
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setVisible(true);
      return;
    }
    
    try {
      setSignupLoading(true);
      await firebase.auth().createUserWithEmailAndPassword(signupEmail, signupPassword);
      setMessage('Account created successfully!');
      setVisible(true);
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during signup');
      setVisible(true);
    } finally {
      setSignupLoading(false);
    }
  };
  
  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      setMessage('Signed out successfully');
      setVisible(true);
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign out');
      setVisible(true);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Title style={styles.title}>Fit360 Firebase Auth Test</Title>
        <Text style={styles.subtitle}>Test your Firebase authentication with this simple login/signup form</Text>
      </View>
      
      {user ? (
        <Card style={styles.section}>
          <Card.Content>
            <Title>Currently Signed In</Title>
            <Text>Email: {user.email}</Text>
            <Text>User ID: {user.uid}</Text>
            <Text>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={handleSignOut}>Sign Out</Button>
          </Card.Actions>
        </Card>
      ) : (
        <>
          <View style={styles.section}>
            <Title>Login</Title>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />
            <Button 
              mode="contained" 
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            >
              Login
            </Button>
          </View>
          
          <View style={styles.section}>
            <Title>Create Account</Title>
            <TextInput
              label="Email"
              value={signupEmail}
              onChangeText={setSignupEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={confirmPassword !== '' && signupPassword !== confirmPassword}
            />
            <Button 
              mode="contained" 
              onPress={handleSignup}
              loading={signupLoading}
              style={styles.button}
              disabled={confirmPassword !== '' && signupPassword !== confirmPassword}
            >
              Create Account
            </Button>
          </View>
        </>
      )}
      
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {message}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});

export default ExpoAuthTest; 