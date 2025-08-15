import Colors from '@/data/Colors';
import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

interface TextInputFieldProps {
    label: string;
    onChangeText: (text: string) => void;
    password?: boolean;
}

const TextInputField = ({ label, onChangeText, password = false }: TextInputFieldProps) => {
    return (
        <View style={{
            marginTop: 14
        }}>
            <Text style={{ color: Colors.GRAY }}>       
                {label}
            </Text>
            <TextInput style={styles.textInput} placeholder={label} secureTextEntry={password} />
        </View>
    )
}

export default TextInputField

const styles = StyleSheet.create({
    textInput: {
        padding: 15,
        borderWidth: 0.2,
        borderRadius: 5,
        marginTop: 5,
        fontSize: 17
    }
})