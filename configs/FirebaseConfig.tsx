// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  console.log('Auth already initialized, getting existing instance' + error);
  auth = getAuth(app);
}

export { auth };
export const storage = getStorage(app);
export default app;