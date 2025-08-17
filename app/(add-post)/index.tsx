import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useUser } from '@/context/UserContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddPost() {
    const { userData } = useUser();
    const router = useRouter();
    const [postContent, setPostContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showImageOptions, setShowImageOptions] = useState(false);

    const characterLimit = 280;
    const remainingChars = characterLimit - postContent.length;

    const pickImageFromLibrary = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access photo library is required!');
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!pickerResult.canceled) {
            setSelectedImage(pickerResult.assets[0].uri);
        }
        setShowImageOptions(false);
    };

    const pickImageFromCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access camera is required!');
            return;
        }
        const pickerResult = await ImagePicker.launchCameraAsync({
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!pickerResult.canceled) {
            setSelectedImage(pickerResult.assets[0].uri);
        }
        setShowImageOptions(false);
    };

    const selectImageOption = (option: any) => {
        if (option === 'Camera') {
            pickImageFromCamera();
        } else if (option === 'Gallery') {
            pickImageFromLibrary();
        }
    };

    const handlePost = () => {
        if (postContent.trim().length === 0) {
            Alert.alert('Empty Post', 'Please write something before posting!');
            return;
        }
        Alert.alert('Success', 'Post created successfully!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="close" size={24} color="#1DA1F2" />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Compose</Text>
                
                <TouchableOpacity 
                    style={[
                        styles.postButton, 
                        postContent.trim().length === 0 && styles.postButtonDisabled
                    ]}
                    onPress={handlePost}
                    disabled={postContent.trim().length === 0}
                >
                    <Text style={[
                        styles.postButtonText,
                        postContent.trim().length === 0 && styles.postButtonTextDisabled
                    ]}>
                        Post
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.userSection}>
                    <View style={styles.userImageContainer}>
                        {userData?.image ? (
                            <Image 
                                source={{ uri: userData.image }} 
                                style={styles.userImage}
                            />
                        ) : (
                            <View style={styles.defaultUserImage}>
                                <Ionicons name="person" size={24} color="#657786" />
                            </View>
                        )}
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={styles.userName}>
                            {userData?.name || 'User'}
                        </Text>

                        <TextInput
                            style={styles.textInput}
                            placeholder="What's happening?"
                            placeholderTextColor="#657786"
                            multiline
                            value={postContent}
                            onChangeText={setPostContent}
                            maxLength={characterLimit}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {selectedImage && (
                    <View style={styles.largeImageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.largePreviewImage} />
                        <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Ionicons name="close-circle" size={28} color="#1DA1F2" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.characterCount}>
                    <Text style={[
                        styles.characterText,
                        remainingChars < 20 && styles.characterWarning,
                        remainingChars < 0 && styles.characterError
                    ]}>
                        {remainingChars}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => setShowImageOptions(!showImageOptions)}
                    >
                        <Ionicons name="image" size={24} color="#1DA1F2" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={pickImageFromCamera}
                    >
                        <Ionicons name="camera" size={24} color="#1DA1F2" />
                    </TouchableOpacity>
                </View>

                {showImageOptions && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity 
                            style={styles.dropdownItem}
                            onPress={() => selectImageOption('Camera')}
                        >
                            <Ionicons name="camera" size={20} color="#14171A" />
                            <Text style={styles.dropdownText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.dropdownItem}
                            onPress={() => selectImageOption('Gallery')}
                        >
                            <Ionicons name="image" size={20} color="#14171A" />
                            <Text style={styles.dropdownText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
        backgroundColor: '#FFFFFF',
    },
    cancelButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#14171A',
    },
    postButton: {
        backgroundColor: '#1DA1F2',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonDisabled: {
        backgroundColor: '#AAB8C2',
    },
    postButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    postButtonTextDisabled: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#F7F9FA',
    },
    userSection: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 8,
    },
    userImageContainer: {
        marginRight: 12,
    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E1E8ED',
    },
    defaultUserImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E1E8ED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputSection: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#14171A',
        marginBottom: 8,
    },
    textInput: {
        fontSize: 18,
        color: '#14171A',
        lineHeight: 24,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    largeImageContainer: {
        margin: 16,
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    largePreviewImage: {
        width: '100%',
        height: 300,
        borderRadius: 16,
    },
    removeImageButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 14,
        padding: 2,
    },
    characterCount: {
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    characterText: {
        fontSize: 14,
        color: '#657786',
    },
    characterWarning: {
        color: '#FFAD1F',
    },
    characterError: {
        color: '#E0245E',
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E1E8ED',
    },
    actionButton: {
        marginRight: 20,
        padding: 8,
    },
    dropdown: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownText: {
        fontSize: 16,
        color: '#14171A',
        marginLeft: 12,
    },
});