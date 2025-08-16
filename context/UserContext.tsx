import { auth } from '@/configs/FirebaseConfig';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  image?: string;
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  updateUserData: (data: UserData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        setUser(firebaseUser);

        const extractedUserData: UserData = {
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          image: firebaseUser.photoURL || '',
        };
        
        setUserData(extractedUserData);
        console.log('User data set:', extractedUserData);
      } else {
        setUser(null);
        setUserData(null);
        console.log('User signed out');
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserData(null);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserData = (data: UserData) => {
    setUserData(prevData => ({
      ...prevData,
      ...data
    }));
    console.log('User data updated:', data);
  };

  const value: UserContextType = {
    user,
    userData,
    isLoading,
    signOut,
    updateUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
