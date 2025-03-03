import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useOnboarding } from '../../hooks/useOnboarding';

const { width, height } = Dimensions.get('window');

const PersonalizationScreen = ({ navigation }) => {
  const { updateUserProfile, nextStep } = useOnboarding();
  
  const [userData, setUserData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: 'moderado',
    dietPreference: '',
    sleepQuality: 'regular',
    mainGoal: '',
    availableTime: '20',
  });
  
  const [currentSection, setCurrentSection] = useState(0);
  const progressValue = useRef(new Animated.Value(0)).current;
  
  // Actualizar barra de progreso
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: (currentSection + 1) / 3, // 3 secciones en total
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [currentSection]);
  
  const handleTextChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleOptionSelect = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNext = () => {
    if (currentSection < 2) {
      setCurrentSection(currentSection + 1);
    } else {
      // Guardar datos del usuario
      updateUserProfile(userData);
      // Avanzar al siguiente paso
      nextStep();
      // Navegar a la siguiente pantalla
      navigation.navigate('ResultsPreview');
    }
  };
  
  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      navigation.goBack();
    }
  };
  
  const isCurrentSectionValid = () => {
    switch (currentSection) {
      case 0:
        return userData.weight !== '' && userData.height !== '' && userData.age !== '';
      case 1:
        return userData.activityLevel !== '' && userData.dietPreference !== '';
      case 2:
        return userData.mainGoal !== '' && userData.availableTime !== '';
      default:
        return false;
    }
  };
  
  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Datos básicos</Text>
            <Text style={styles.sectionSubtitle}>Necesitamos algunos datos para personalizar tu plan</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: 70"
                keyboardType="numeric"
                value={userData.weight}
                onChangeText={(value) => handleTextChange('weight', value)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estatura (cm)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: 170"
                keyboardType="numeric"
                value={userData.height}
                onChangeText={(value) => handleTextChange('height', value)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Edad</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: 30"
                keyboardType="numeric"
                value={userData.age}
                onChangeText={(value) => handleTextChange('age', value)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Género</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    userData.gender === 'masculino' && styles.selectedOption
                  ]}
                  onPress={() => handleOptionSelect('gender', 'masculino')}
                >
                  <Text style={userData.gender === 'masculino' ? styles.selectedOptionText : styles.optionText}>Masculino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    userData.gender === 'femenino' && styles.selectedOption
                  ]}
                  onPress={() => handleOptionSelect('gender', 'femenino')}
                >
                  <Text style={userData.gender === 'femenino' ? styles.selectedOptionText : styles.optionText}>Femenino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    userData.gender === 'otro' && styles.selectedOption
                  ]}
                  onPress={() => handleOptionSelect('gender', 'otro')}
                >
                  <Text style={userData.gender === 'otro' ? styles.selectedOptionText : styles.optionText}>Otro</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Estilo de vida</Text>
            <Text style={styles.sectionSubtitle}>Cuéntanos un poco sobre tus hábitos actuales</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nivel de actividad física</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Sedentario</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={2}
                  step={1}
                  minimumTrackTintColor="#3E64FF"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#3E64FF"
                  value={userData.activityLevel === 'sedentario' ? 0 : userData.activityLevel === 'moderado' ? 1 : 2}
                  onValueChange={(value) => {
                    const levels = ['sedentario', 'moderado', 'activo'];
                    handleOptionSelect('activityLevel', levels[value]);
                  }}
                />
                <Text style={styles.sliderLabel}>Muy activo</Text>
              </View>
              <Text style={styles.selectedValue}>
                {userData.activityLevel.charAt(0).toUpperCase() + userData.activityLevel.slice(1)}
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferencia alimenticia</Text>
              <View style={styles.dietOptions}>
                {[
                  { label: 'Sin restricciones', value: 'omnivoro' },
                  { label: 'Vegetariano', value: 'vegetariano' },
                  { label: 'Vegano', value: 'vegano' },
                  { label: 'Keto', value: 'keto' },
                  { label: 'Bajo en carbohidratos', value: 'low_carb' }
                ].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dietOption,
                      userData.dietPreference === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleOptionSelect('dietPreference', option.value)}
                  >
                    <Text 
                      style={
                        userData.dietPreference === option.value 
                          ? styles.selectedOptionText 
                          : styles.optionText
                      }
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Calidad de sueño</Text>
              <View style={styles.sleepOptions}>
                {[
                  { label: 'Mala', value: 'mala', emoji: '😴' },
                  { label: 'Regular', value: 'regular', emoji: '😐' },
                  { label: 'Buena', value: 'buena', emoji: '😊' }
                ].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sleepOption,
                      userData.sleepQuality === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleOptionSelect('sleepQuality', option.value)}
                  >
                    <Text style={styles.sleepEmoji}>{option.emoji}</Text>
                    <Text 
                      style={
                        userData.sleepQuality === option.value 
                          ? styles.selectedOptionText 
                          : styles.optionText
                      }
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tus objetivos</Text>
            <Text style={styles.sectionSubtitle}>¿Qué quieres lograr con Fit360?</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Objetivo principal</Text>
              <View style={styles.goalOptions}>
                {[
                  { label: 'Perder peso', value: 'perder_peso' },
                  { label: 'Ganar músculo', value: 'ganar_musculo' },
                  { label: 'Mejorar condición física', value: 'condicion' },
                  { label: 'Reducir estrés', value: 'reducir_estres' },
                  { label: 'Mejorar energía diaria', value: 'energia' }
                ].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.goalOption,
                      userData.mainGoal === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleOptionSelect('mainGoal', option.value)}
                  >
                    <Text 
                      style={
                        userData.mainGoal === option.value 
                          ? styles.selectedOptionText 
                          : styles.optionText
                      }
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tiempo disponible para entrenar (minutos/día)</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>10</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={10}
                  maximumValue={60}
                  step={5}
                  minimumTrackTintColor="#3E64FF"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#3E64FF"
                  value={parseInt(userData.availableTime)}
                  onValueChange={(value) => handleTextChange('availableTime', value.toString())}
                />
                <Text style={styles.sliderLabel}>60</Text>
              </View>
              <Text style={styles.selectedValue}>
                {userData.availableTime} minutos
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>¿A qué hora del día te sientes con más energía?</Text>
              <View style={styles.timeOptions}>
                {[
                  { label: 'Mañana', value: 'manana' },
                  { label: 'Mediodía', value: 'mediodia' },
                  { label: 'Tarde', value: 'tarde' },
                  { label: 'Noche', value: 'noche' }
                ].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeOption,
                      userData.bestTime === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleOptionSelect('bestTime', option.value)}
                  >
                    <Text 
                      style={
                        userData.bestTime === option.value 
                          ? styles.selectedOptionText 
                          : styles.optionText
                      }
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            {
              width: progressValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })
            }
          ]}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
      >
        <Ionicons name="chevron-back" size={24} color="#3E64FF" />
        <Text style={styles.backText}>Atrás</Text>
      </TouchableOpacity>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderSection()}
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !isCurrentSectionValid() && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!isCurrentSectionValid()}
        >
          <Text style={styles.nextButtonText}>
            {currentSection < 2 ? 'Continuar' : 'Ver resultados'}
          </Text>
          {currentSection < 2 ? (
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          ) : (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <Text style={styles.footerText}>
          Paso {currentSection + 1} de 3
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E0E0E0',
    zIndex: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3E64FF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#3E64FF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666666',
  },
  selectedValue: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#3E64FF',
  },
  dietOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  dietOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sleepOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sleepOption: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sleepEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  goalOptions: {
    flexDirection: 'column',
  },
  goalOption: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  timeOption: {
    width: '45%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#EBF0FF',
    borderColor: '#3E64FF',
  },
  optionText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedOptionText: {
    fontSize: 14,
    color: '#3E64FF',
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#3E64FF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#B8C2E0',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#777777',
  }
});

export default PersonalizationScreen; 