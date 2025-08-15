// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDl0ZlhVuc_pYndARggD_n8AR8d0TQ2z58',
    authDomain: 'vidgenius-4ad7e.firebaseapp.com',
    projectId: 'vidgenius-4ad7e',
    storageBucket: 'vidgenius-4ad7e.firebasestorage.app',
    messagingSenderId: '57678161119',
    appId: '1:57678161119:web:f785a069aec6a16582f56a',
    measurementId: 'G-K01SYB2MQP'
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});