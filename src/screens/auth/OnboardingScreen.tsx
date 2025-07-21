import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

const onboardingData = [
  {
    title: 'Découvrez la Nature',
    description: 'Explorez les forêts et trouvez de vrais champignons dans leur habitat naturel',
    emoji: '🌲',
  },
  {
    title: 'Identifiez avec l\'IA',
    description: 'Prenez une photo et notre IA identifie instantanément l\'espèce et sa comestibilité',
    emoji: '📸',
  },
  {
    title: 'Gagnez des Points',
    description: 'Plus le champignon est rare, plus vous gagnez de points. Montez en niveau!',
    emoji: '🏆',
  },
  {
    title: 'Partagez vos Spots',
    description: 'Rejoignez une communauté passionnée et partagez vos meilleurs coins',
    emoji: '👥',
  },
];

export function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<NavigationProp>();

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.navigate('Register');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-forest-dark">
      <View className="flex-1">
        {/* Skip button */}
        <TouchableOpacity
          onPress={handleSkip}
          className="absolute top-4 right-4 z-10 px-4 py-2"
        >
          <Text className="text-forest-light">Passer</Text>
        </TouchableOpacity>

        {/* Content */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentOffset={{ x: currentPage * 375, y: 0 }}
        >
          {onboardingData.map((item, index) => (
            <View key={index} className="flex-1 items-center justify-center px-8" style={{ width: 375 }}>
              <Text className="text-8xl mb-8">{item.emoji}</Text>
              <Text className="text-white text-3xl font-bold text-center mb-4">
                {item.title}
              </Text>
              <Text className="text-forest-light text-center text-lg">
                {item.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View className="flex-row justify-center mb-8">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentPage ? 'bg-primary-500' : 'bg-gray-500'
              }`}
            />
          ))}
        </View>

        {/* Next button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary-600 mx-8 mb-8 py-4 rounded-full"
        >
          <Text className="text-white text-center font-bold text-lg">
            {currentPage === onboardingData.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}