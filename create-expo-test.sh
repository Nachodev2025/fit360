#!/bin/bash

# Create a directory for the test app
mkdir -p expo-firebase-test
cd expo-firebase-test

# Initialize a new Expo app
npx create-expo-app@latest fit360test --template blank

# Navigate to the app directory
cd fit360test

# Install Firebase
npm install firebase

# Create a simple Firebase test file
cat > App.js << 'EOL'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW0LYX4WZ-TUj0h5clHNbYL6U-qXQaAHg",
  authDomain: "fit360-120bb.firebaseapp.com",
  projectId: "fit360-120bb",
  storageBucket: "fit360-120bb.firebasestorage.app",
  messagingSenderId: "575088424012",
  appId: "1:575088424012:web:acc7fd7c152c03ac3ab0e9",
  measurementId: "G-4R1R5N2SLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);
  
  const handleSignUp = async () => {
    setLoading(true);
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Account created: ' + userCredential.user.email);
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('Signed in: ' + userCredential.user.email);
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await signOut(auth);
      setMessage('Signed out successfully');
    } catch (error) {
      setMessage('Error signing out: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Fit360 Firebase Test</Text>
        
        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.subtitle}>Current User</Text>
            <Text>Email: {user.email}</Text>
            <Text>UID: {user.uid}</Text>
            <Text>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</Text>
            <Button title="Sign Out" onPress={handleSignOut} disabled={loading} />
          </View>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <View style={styles.buttonContainer}>
                <Button title="Sign In" onPress={handleSignIn} disabled={loading} />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>Create Account</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <Button title="Sign Up" onPress={handleSignUp} disabled={loading} />
            </View>
          </>
        )}
        
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 8,
  },
  userInfo: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#e7f3ff',
    marginBottom: 20,
  },
  message: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#ffe7e7',
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 10,
  },
});
EOL

# Start the Expo development server
echo "Starting Expo server..."
npx expo start 