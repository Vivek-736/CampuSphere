import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import TextInputField from '@/components/TextInputField';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';

const SignUp = () => {
    const [profileImage, setProfileImage] = useState<string | undefined>();
    const [fullName, setFullName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    const onBtnPress = () => {

    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5
        });

        console.log(result);

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    }

    return (
        <View style={{
            paddingTop: 60,
            padding: 10,
        }}>
            <Text style={{
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                Create New Account
            </Text>

            <View style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <View>
                    <TouchableOpacity onPress={() => pickImage()}>
                        {profileImage ? <Image source={{ uri: profileImage }} 
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 99,
                                marginTop: 20
                            }} /> : <Image source={require('./../../assets/images/user.png')} 
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 99,
                                marginTop: 20
                            }}
                        />}
                        <AntDesign name="camera" size={24} color="green"
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TextInputField label='Full Name' onChangeText={(v) => setFullName(v)} />
            <TextInputField label='College Mail' onChangeText={(v) => setEmail(v)} />
            <TextInputField label='Password' password={true} onChangeText={(v) => setPassword(v)} />
            
            <View style={{
                marginTop: 28
            }}>
                <Button text='Create Account' onPress={() => onBtnPress()} />
            </View>
        </View>
    )
}

export default SignUp
