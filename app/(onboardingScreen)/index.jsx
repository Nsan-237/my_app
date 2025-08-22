import React, { useState, useRef } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

const { width } = Dimensions.get('window')

export default function OnboardingScreen() {
  const router = useRouter()
  const scrollViewRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const onboardingData = [
    {
    id: 1,
      title: "CONFIRMATION",
      subtitle: "Confirm your waste pickup location by setting your precise address",
      image: require('./../../assets/images/location-confirm.jpg'),
      buttonText: "Next"
    },
    {
      id: 2,
      title: "THE KEY TO YOUR\nCLEAN ENVIRONMENT",
      subtitle: "No more waste lying around in your neighborhood",
      image: require('./../../assets/images/clean-environment.jpg'),
      buttonText: "Join",
      isMainScreen: true
    },
    {
      id: 3,
      title: "COLLECTIONS",
      subtitle: "Manage your waste collections quickly and easily from your pocket",
      image: require('./../../assets/images/waste-schedule.jpg'),
      buttonText: "Get Started"
    }
  ]
    // Navigate to next screen or sign in

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true })
    } else {
      // Navigate to sign in screen
      router.push('/(auth)/signIn');
    }
  }

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / width)
    setCurrentIndex(index)
  }

  const renderScreen = (item, index) => {
    return (
      <View key={item.id} style={[styles.screenContainer, item.isMainScreen && styles.mainScreen]}>
        {/* Top Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={item.image} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View style={[styles.content, item.isMainScreen && styles.mainContent]}>
          <Text style={[styles.title, item.isMainScreen && styles.mainTitle]}>
            {item.title}
          </Text>

          <Text style={[styles.subtitle, item.isMainScreen && styles.mainSubtitle]}>
            {item.subtitle}
          </Text>

          <TouchableOpacity 
            style={[styles.button, item.isMainScreen && styles.mainButton]}
            onPress={handleNext}
          >
            <Text style={[styles.buttonText, item.isMainScreen && styles.mainButtonText]}>
              {item.buttonText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicators */}
        {!item.isMainScreen && (
          <View style={styles.progressContainer}>
            {onboardingData.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.progressDot, 
                  i === index && styles.progressDotActive
                ]} 
              />
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={styles.container}
    >
      {onboardingData.map((item, index) => renderScreen(item, index))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  screenContainer: {
    width: width,
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 60
  },
  mainScreen: {
    backgroundColor: Colors.PRIMARY
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 40,
    flex: 1,
    justifyContent: 'center'
  },
  image: {
    width: 280,
    height: 280
  },
  content: {
    padding: 40,
    paddingBottom: 80
  },
  mainContent: {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 20
  },
  mainTitle: {
    fontSize: 28,
    color: "white",
    lineHeight: 34
  },
  subtitle: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40
  },
  mainSubtitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 50
  },
  button: {
    padding: 16,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    marginHorizontal: 20
  },
  mainButton: {
    backgroundColor: "white",
    paddingHorizontal: 60
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "600"
  },
  mainButtonText: {
    color: Colors.PRIMARY
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4
  },
  progressDotActive: {
    backgroundColor: Colors.PRIMARY,
    width: 12,
    height: 12,
    borderRadius: 6
  }
})

// English Version Alternative
export const OnboardingScreenEN = () => {
  const router = useRouter()
  const scrollViewRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const onboardingData = [
    // French Version
   // {
    //   id: 1,
    //   title: "CONFIRMATION",
    //   subtitle: "Confirmez votre emplacement de collecte en définissant votre adresse précise",
    //   image: require('./../../assets/images/location-confirm.jpg'), // Your location confirmation image
    //   buttonText: "Suivant"
    // },
    // {
    //   id: 2,
    //   title: "LA CLÉ DE VOTRE\nENVIRONNEMENT PROPRE",
    //   subtitle: "Fini les déchets qui traînent dans votre quartier",
    //   image: require('./../../assets/images/clean-environment.jpg'), // Your main value prop image
    //   buttonText: "Rejoindre",
    //   isMainScreen: true
    // },
    // {
    //   id: 3,
    //   title: "COLLECTES",
    //   subtitle: "Gérez vos collectes de déchets rapidement et facilement depuis votre poche",
    //   image: require('./../../assets/images/waste-schedule.jpg'), // Your scheduling image
    //   buttonText: "Commencer"
    // }
  ]
  // Same component logic as above...
}