import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, Animated, Dimensions, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../hooks/useOnboarding';
import QuestionSlide from '../../components/QuestionSlide';

const { width, height } = Dimensions.get('window');

// Conjunto de preguntas para el cuestionario
const QUESTIONS = [
  {
    id: 'primaryFocus',
    question: '¿Qué aspecto de tu vida te gustaría transformar primero?',
    options: [
      { text: 'Mi cuerpo y salud física', emoji: '💪', value: 'physical' },
      { text: 'Mi bienestar mental y emocional', emoji: '🧠', value: 'mental' },
      { text: 'Mi energía y productividad diaria', emoji: '⚡', value: 'energy' }
    ],
    insight: 'El 78% de los usuarios de Fit360 logran mejores resultados cuando eligen un área de enfoque principal.'
  },
  {
    id: 'socialMedia',
    question: 'Cuando estás estresado, ¿te descubres abriendo redes sociales casi por instinto?',
    options: [
      { text: 'Constantemente, es casi automático', emoji: '📱', value: 'high' },
      { text: 'A veces, pero soy consciente de ello', emoji: '🤔', value: 'medium' },
      { text: 'Rara vez, tengo buen control', emoji: '✨', value: 'low' }
    ],
    insight: 'El 67% de las personas experimentan mejoras en su concentración cuando reducen el uso de redes sociales.'
  },
  {
    id: 'stress',
    question: '¿Has notado que tus pensamientos acelerados te impiden disfrutar momentos importantes?',
    options: [
      { text: 'Sí, y ya no sé qué hacer al respecto', emoji: '😞', value: 'high' },
      { text: 'A veces, pero puedo manejarlo', emoji: '🌿', value: 'medium' },
      { text: 'No, tengo técnicas para mantener la calma', emoji: '😌', value: 'low' }
    ],
    insight: 'Las técnicas de mindfulness de Fit360 han ayudado al 82% de los usuarios a reducir su estrés diario.'
  },
  {
    id: 'nutrition',
    question: 'Al final del día, ¿sientes que tu alimentación te está dando energía o quitándotela?',
    options: [
      { text: 'Me quita energía, como sin pensar', emoji: '🍔', value: 'poor' },
      { text: 'Intento comer bien, pero no siempre lo logro', emoji: '🥗', value: 'average' },
      { text: 'Mi alimentación me da energía constante', emoji: '🍎', value: 'good' }
    ],
    insight: 'Pequeños cambios en la alimentación pueden aumentar tus niveles de energía hasta un 40% en 2 semanas.'
  },
  {
    id: 'previousAttempts',
    question: '¿Qué has intentado antes para mejorar tu bienestar?',
    options: [
      { text: 'Varias apps y métodos sin resultados duraderos', emoji: '📉', value: 'multiple_failed' },
      { text: 'Intentos por mi cuenta pero sin estructura', emoji: '🔄', value: 'unstructured' },
      { text: 'Es la primera vez que busco ayuda seria', emoji: '🆕', value: 'first_time' }
    ],
    insight: 'Los usuarios con experiencias previas tienen un 64% más de probabilidades de éxito con un enfoque estructurado.'
  },
  {
    id: 'obstacle',
    question: '¿Cuál ha sido tu mayor obstáculo para lograr tus objetivos de bienestar?',
    options: [
      { text: 'Falta de tiempo', emoji: '⏰', value: 'time' },
      { text: 'Falta de motivación constante', emoji: '🔥', value: 'motivation' },
      { text: 'No saber exactamente qué hacer', emoji: '🧭', value: 'guidance' },
      { text: 'Comenzar bien pero abandonar después', emoji: '📉', value: 'consistency' }
    ],
    insight: 'Fit360 está diseñado para superar estos obstáculos comunes con microrrutinas y seguimiento personalizado.'
  },
  {
    id: 'commitment',
    question: '¿Estás dispuesto a dedicar 20 minutos al día para transformar tu salud?',
    options: [
      { text: 'Sí, puedo comprometerme con eso', emoji: '✅', value: 'yes' },
      { text: 'Tal vez, depende del día', emoji: '🤷‍♂️', value: 'maybe' },
      { text: 'No estoy seguro de poder hacerlo', emoji: '🤔', value: 'unsure' }
    ],
    insight: 'El 92% de los usuarios que dedican 20 minutos diarios logran resultados visibles en 3 semanas.'
  }
];

const QuestionnaireScreen = ({ navigation }) => {
  const { 
    addResponse, 
    responses, 
    nextStep, 
    currentStep 
  } = useOnboarding();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const progressValue = useRef(new Animated.Value(0)).current;
  const animationValue = useRef(new Animated.Value(1)).current;
  
  // Actualizar la barra de progreso
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: (currentQuestionIndex + 1) / QUESTIONS.length,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [currentQuestionIndex]);
  
  const handleOptionSelect = (value) => {
    const question = QUESTIONS[currentQuestionIndex];
    
    // Guardar la respuesta
    addResponse(question.id, value);
    
    // Animar la transición
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        delay: 100
      })
    ]).start();
    
    // Avanzar a la siguiente pregunta o a la siguiente pantalla
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Avanzar al siguiente paso del onboarding
        nextStep();
        navigation.navigate('Personalization');
      }
    }, 300);
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigation.goBack();
    }
  };
  
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
      >
        <Ionicons name="chevron-back" size={24} color="#3E64FF" />
        <Text style={styles.backText}>Atrás</Text>
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionSlide
          question={currentQuestion.question}
          options={currentQuestion.options}
          onOptionSelect={handleOptionSelect}
          progressValue={progressValue}
          insightText={currentQuestion.insight}
          animationValue={animationValue}
        />
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pregunta {currentQuestionIndex + 1} de {QUESTIONS.length}
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 14,
    color: '#777777',
  }
});

export default QuestionnaireScreen; 