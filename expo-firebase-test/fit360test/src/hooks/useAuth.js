import { useState, useEffect, createContext, useContext } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  connectAuthEmulator
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';

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

// Initialize Firebase - solo inicializar si no existe ya una instancia
let app;
if (getApps().length === 0) {
  console.log('Inicializando Firebase por primera vez');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Firebase ya estaba inicializado');
  app = getApp();
}

const auth = getAuth(app);

// En desarrollo, puedes utilizar el emulador de Firebase (descomenta estas líneas si lo necesitas)
// if (__DEV__) {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   console.log('Usando emulador de Firebase Auth');
// }

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      console.log('useAuth: Iniciando proceso de signUp');
      setLoading(true);
      setError(null);
      
      console.log('useAuth: Intentando crear usuario con Firebase');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('useAuth: Usuario creado exitosamente');
      return userCredential.user;
    } catch (error) {
      console.error('useAuth: Error en signUp:', error.code, error.message);
      setError(error.message);
      throw error;
    } finally {
      console.log('useAuth: Finalizando proceso de signUp');
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth; 