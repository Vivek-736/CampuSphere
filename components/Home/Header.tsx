import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useUser } from '@/context/UserContext'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function Header() {
    const { userData } = useUser()

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>
                    Hey there, <Text style={styles.username}>{userData?.name || 'User'}</Text>
                </Text>
            </View>
            
            {userData?.image ? (
                <Image 
                    source={{ uri: userData.image }} 
                    style={styles.profileImage}
                />
            ) : (
                <Ionicons name="person-circle" size={40} color="#ccc" />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    textContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 22,
        color: '#333',
        paddingLeft: 12
    },
    username: {
        fontWeight: 'bold',
        color: '#007AFF',
    },
})