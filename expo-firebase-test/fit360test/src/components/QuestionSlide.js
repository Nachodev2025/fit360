import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const QuestionSlide = ({ 
  question, 
  options, 
  onOptionSelect, 
  progressValue,
  insightText,
  animationValue = new Animated.Value(0)
}) => {
  
  // Animación para entrada de preguntas
  React.useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderOption = (option, index) => {
    const { text, emoji, value } = option;
    
    return (
      <TouchableOpacity
        key={index}
        style={styles.optionButton}
        onPress={() => onOptionSelect(value)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F5F7FF']}
          style={styles.optionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.optionEmoji}>{emoji}</Text>
          <Text style={styles.optionText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const slideInStyles = {
    opacity: animationValue,
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, slideInStyles]}>
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
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map(renderOption)}
      </View>
      
      {insightText && (
        <View style={styles.insightContainer}>
          <MaterialIcons name="lightbulb-outline" size={20} color="#5D7DFF" />
          <Text style={styles.insightText}>{insightText}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E0E0E0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3E64FF',
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  insightText: {
    fontSize: 14,
    color: '#5D7DFF',
    marginLeft: 10,
    flex: 1,
  }
});

export default QuestionSlide; 