import Button from '@/components/Button'
import Colors from '@/data/Colors'
import React from 'react'
import { View, Image, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native'

const { height } = Dimensions.get('window')

const LandingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image 
                    source={require('./../assets/images/Landing.jpg')}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
                
                <View style={styles.textContainer}>
                    <Text style={styles.welcomeTitle}>
                        Welcome to CampuSphere
                    </Text>

                    <Text style={styles.subtitle}>
                        Your College news, updates in your pocket, Join in a club, register for an event and many more
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Button 
                            text='Get Started' 
                            onPress={() => console.log("Button Pressed")}
                            style={styles.getStartedButton}
                        />
                        
                        <Text style={styles.signInText}>
                            Already have an account?{' '}
                            <Text style={styles.signInLink}>Sign In Here</Text>
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* Space reserved for navigation buttons */}
            <View style={styles.navigationSpace} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    heroImage: {
        width: '100%',
        height: height * 0.55,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2C3E50',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 1,
        color: Colors.GRAY || '#7F8C8D',
        lineHeight: 26,
        paddingHorizontal: 8,
        fontWeight: '500',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 0,
    },
    getStartedButton: {
        paddingVertical: 18,
        paddingHorizontal: 60,
        borderRadius: 30,
        backgroundColor: Colors.PRIMARY || '#3498DB',
        elevation: 8,
        shadowColor: Colors.PRIMARY || '#3498DB',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        transform: [{ scale: 1 }],
    },
    signInText: {
        fontSize: 12,
        textAlign: 'center',
        color: Colors.GRAY || '#7F8C8D',
        fontWeight: '500',
        marginTop: 16
    },
    signInLink: {
        color: Colors.PRIMARY || '#3498DB',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 12,
        marginTop: 16
    },
    navigationSpace: {
        height: 80,
        backgroundColor: 'transparent',
    },
})

export default LandingScreen
