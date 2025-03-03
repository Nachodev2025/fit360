import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button, Card, Surface, Avatar } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';

const HomeScreen = () => {
  const { user, signOut } = useAuth();
  
  // Generar iniciales para el avatar del usuario
  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.appName}>Fit360</Text>
        </View>
        <View style={styles.userInfo}>
          <Avatar.Text 
            size={40} 
            label={getInitials(user?.email)} 
            backgroundColor="#3E64FF"
          />
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <Surface style={styles.statsCard}>
          <View style={styles.userProfile}>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userStatus}>
              {user?.emailVerified ? 'Email verificado ✓' : 'Email no verificado'}
            </Text>
          </View>
          
          <Button 
            mode="contained" 
            onPress={signOut}
            style={styles.logoutButton}
          >
            Cerrar Sesión
          </Button>
        </Surface>
        
        <Text style={styles.sectionTitle}>Próximas Funcionalidades</Text>
        
        <View style={styles.featuresContainer}>
          <Card style={styles.featureCard}>
            <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} />
            <Card.Title title="Seguimiento de Entrenamientos" />
            <Card.Content>
              <Text>Registra tus entrenamientos y sigue tu progreso en el tiempo.</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.featureCard}>
            <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} />
            <Card.Title title="Plan de Nutrición" />
            <Card.Content>
              <Text>Controla tu alimentación y sigue planes nutricionales personalizados.</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.featureCard}>
            <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} />
            <Card.Title title="Estadísticas" />
            <Card.Content>
              <Text>Visualiza tu progreso con gráficos detallados y estadísticas.</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E64FF',
  },
  userInfo: {
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  userProfile: {
    marginBottom: 15,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userStatus: {
    color: '#666',
  },
  logoutButton: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureCard: {
    marginBottom: 15,
    elevation: 2,
  },
});

export default HomeScreen; 