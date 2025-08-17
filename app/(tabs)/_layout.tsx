import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useUser } from '@/context/UserContext'
import { Image } from 'react-native'
import Colors from '@/data/Colors'

export default function TabLayout() {
    const { userData } = useUser()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.PRIMARY,
                headerShown: false
            }}
        >
            <Tabs.Screen name="Home"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
                }}
            />

            <Tabs.Screen name="Event"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />
                }}
            />

            <Tabs.Screen name="Clubs"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />
                }}
            />
            
            <Tabs.Screen name="Profile"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        userData?.image ? (
                            <Image 
                                source={{ uri: userData.image }} 
                                style={{ 
                                    width: size, 
                                    height: size, 
                                    borderRadius: size / 2,
                                    borderWidth: 1,
                                    borderColor: color
                                }} 
                            />
                        ) : (
                            <Ionicons name="person-circle" size={size} color={color} />
                        )
                    )
                }}
            />
        </Tabs>
    )
}