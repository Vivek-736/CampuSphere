import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        style="dark" 
        backgroundColor="rgba(255,255,255,0.9)"
        translucent={true}
      />
      
      <Stack
        screenOptions={{
          headerShown: false,
          statusBarStyle: "dark",
          statusBarBackgroundColor: "transparent",
          animation: "slide_from_right",
          presentation: "card",
          contentStyle: {
            backgroundColor: "white",
          }
        }}
      >
        <Stack.Screen
          name="landing"
          options={{
            headerShown: false,
            statusBarStyle: "dark",
            gestureEnabled: false,
            statusBarBackgroundColor: "transparent",
          }}
        />
        <Stack.Screen
          name="(auth)/SignUp"
          options={{
            headerShown: false,
            statusBarStyle: "dark",
            presentation: "modal",
            gestureEnabled: true,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="(auth)/SignIn"
          options={{
            headerShown: false,
            statusBarStyle: "dark",
            presentation: "modal",
            gestureEnabled: true,
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </View>
  );
}