import React, { useState } from 'react'
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    ToastAndroid, 
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TextInputField from '@/components/TextInputField';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/configs/FirebaseConfig';

const SignUp = () => {
    const [profileImage, setProfileImage] = useState<string | undefined>();
    const [fullName, setFullName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

    const uploadImageToFirebase = async (imageUri: string, userId: string): Promise<string> => {
        try {
            setIsUploadingImage(true);
            
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const imageRef = ref(storage, `CampuSphere/profile_images/${userId}_${Date.now()}.jpg`);
            
            await uploadBytes(imageRef, blob);
            
            const downloadURL = await getDownloadURL(imageRef);
            
            setIsUploadingImage(false);
            return downloadURL;
        } catch (error) {
            setIsUploadingImage(false);
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const onBtnPress = async () => {
        if(!email || !password || !fullName) {
            ToastAndroid.show('Please enter all details!', ToastAndroid.BOTTOM);
            return;
        }

        if(password.length < 6) {
            ToastAndroid.show('Password should be at least 6 characters!', ToastAndroid.BOTTOM);
            return;
        }

        setIsLoading(true);

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created:', userCredentials.user.uid);
            
            let profileImageUrl = '';
            
            if (profileImage) {
                try {
                    profileImageUrl = await uploadImageToFirebase(profileImage, userCredentials.user.uid);
                    console.log('Profile image uploaded:', profileImageUrl);
                } catch (imageError) {
                    console.error('Error uploading profile image:', imageError);
                    ToastAndroid.show('Account created but failed to upload profile image', ToastAndroid.LONG);
                }
            }

            await updateProfile(userCredentials.user, {
                displayName: fullName,
                photoURL: profileImageUrl || null
            });
            
        } catch (error: any) {
            console.error('Signup error:', error);
            ToastAndroid.show(error.message || 'An error occurred during signup', ToastAndroid.BOTTOM);
        } finally {
            setIsLoading(false);
        }
    }

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (permissionResult.granted === false) {
                Alert.alert('Permission Required', 'Permission to access camera roll is required!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7
            });

            console.log(result);

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            ToastAndroid.show('Error selecting image', ToastAndroid.SHORT);
        }
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <MaterialIcons name="school" size={50} color="#4CAF50" />
                    <Text style={styles.title}>Create New Account</Text>
                </View>

                <View style={styles.imageSection}>
                    <TouchableOpacity 
                        onPress={pickImage} 
                        style={styles.imageContainer}
                        disabled={isUploadingImage}
                    >
                        {profileImage ? (
                            <Image 
                                source={{ uri: profileImage }}
                                style={styles.profileImage} 
                            />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <MaterialIcons name="person" size={50} color="#9E9E9E" />
                            </View>
                        )}
                        
                        <View style={styles.cameraIcon}>
                            {isUploadingImage ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <AntDesign name="camera" size={20} color="white" />
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.imageHint}>Tap to add profile photo</Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInputField 
                        label='Full Name' 
                        onChangeText={(v) => setFullName(v)}
                    />
                    <TextInputField 
                        label='College Email' 
                        onChangeText={(v) => setEmail(v)}
                    />
                    <TextInputField 
                        label='Password' 
                        password={true} 
                        onChangeText={(v) => setPassword(v)}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button 
                        text={isLoading ? 'Creating Account...' : 'Create Account'} 
                        onPress={onBtnPress}
                    />
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2E2E2E',
        marginTop: 10,
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#4CAF50',
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    imageHint: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 30,
    },
    buttonContainer: {
        marginBottom: 10,
        position: 'relative',
    },
    loadingIndicator: {
        position: 'absolute',
        right: 20,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    footerContainer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 6,
        color: '#999',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 20,
    },
});

export default SignUp
