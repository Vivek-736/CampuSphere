import { Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useUser } from "@/context/UserContext";

export default function Index() {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ 
          marginTop: 10, 
          fontSize: 16, 
          color: '#666',
          fontWeight: '500'
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (user) {
    console.log('User authenticated, redirecting to home');
    return <Redirect href="/(tabs)/Home" />;
  } else {
    console.log('User not authenticated, redirecting to landing');
    return <Redirect href="/landing" />;
  }
}