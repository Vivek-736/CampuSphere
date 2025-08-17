import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const boxSize = (width - 44) / 2;
const categoryOptions = [
    {
        name: 'Events',
        banner: require('./../../assets/images/news.png'),
        path: '/(tabs)/Event',
        gradientStart: '#FF6B6B',
        gradientEnd: '#FF8E72',
    },
    {
        name: 'Latest Posts',
        banner: require('./../../assets/images/post.png'),
        path: '/(tabs)/Home',
        gradientStart: '#4ECDC4',
        gradientEnd: '#556270',
    },
    {
        name: 'Clubs',
        banner: require('./../../assets/images/clubs.png'),
        path: '/(tabs)/Clubs',
        gradientStart: '#C7F464',
        gradientEnd: '#81C784',
    },
    {
        name: 'Add New Post',
        banner: require('./../../assets/images/add.png'),
        path: '/add-post',
        gradientStart: '#6A82FB',
        gradientEnd: '#FC5C7D',
    }
];

export default function Category() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {categoryOptions.slice(0, 2).map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.boxWrapper}
                        activeOpacity={0.8}
                        // @ts-ignore
                        onPress={() => router.push(item.path)}
                    >
                        <LinearGradient
                            colors={[item.gradientStart, item.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientBox}
                        >
                            <View style={styles.imageContainer}>
                                <Image 
                                    source={item.banner} 
                                    style={styles.banner} 
                                    resizeMode="contain" 
                                />
                            </View>
                            <Text style={styles.boxText}>{item.name}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
            
            <View style={styles.row}>
                {categoryOptions.slice(2, 4).map((item, index) => (
                    <TouchableOpacity
                        key={index + 2}
                        style={styles.boxWrapper}
                        activeOpacity={0.8}
                        // @ts-ignore
                        onPress={() => router.push(item.path)}
                    >
                        <LinearGradient
                            colors={[item.gradientStart, item.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientBox}
                        >
                            <View style={styles.imageContainer}>
                                <Image 
                                    source={item.banner} 
                                    style={styles.banner} 
                                    resizeMode="contain" 
                                />
                            </View>
                            <Text style={styles.boxText}>{item.name}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    boxWrapper: {
        width: boxSize,
        height: boxSize * 0.8,
        borderRadius: 36,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        padding: 6
    },
    gradientBox: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    banner: {
        width: 38,
        height: 38,
    },
    boxText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        lineHeight: 16,
        marginTop: 8,
    },
});