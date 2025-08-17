import Category from '@/components/Home/Category'
import Header from '@/components/Home/Header'
import React from 'react'
import { View } from 'react-native'

export default function Home() {
    return (
        <View style={{
            padding: 20,
            paddingTop: 60,
        }}>
            <Header />
            <Category />
        </View>
    )
}