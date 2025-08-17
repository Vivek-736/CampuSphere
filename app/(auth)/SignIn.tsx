import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TextInputField from "@/components/TextInputField";
import Button from "@/components/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
// @ts-ignore
import { auth } from "@/configs/FirebaseConfig";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";

const SignIn = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkUserInDatabase = async (email: string) => {
    try {
      console.log("Checking user in database:", email);

      const devServerUrl = Constants.expoConfig?.hostUri
        ? `http://${Constants.expoConfig.hostUri.split(":")[0]}:8081`
        : "http://localhost:8081";

      console.log("Using API URL:", `${devServerUrl}/auth`);

      const response = await axios.post(
        `${devServerUrl}/auth`,
        {
          email: email,
        },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User found in database:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error checking user in database:", error);

      if (error.response) {
        console.error("Server error:", error.response.data);
        console.error("Status:", error.response.status);
        
        if (error.response.status === 404) {
          throw new Error("No account found with this email address");
        }
        
        throw new Error(
          `Server error: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server - Check if your development server is running on port 8081"
        );
      } else {
        console.error("Request setup error:", error.message);
        throw error;
      }
    }
  };

  const onSignInPress = async () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter email and password!", ToastAndroid.BOTTOM);
      return;
    }

    setIsLoading(true);

    try {
      const dbUser = await checkUserInDatabase(email);
      console.log("Database user:", dbUser);

      // @ts-ignore
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase authentication successful:", userCredentials.user.uid);

      ToastAndroid.show("Sign in successful!", ToastAndroid.SHORT);

      router.push('/(tabs)/Home');
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      let errorMessage = "An error occurred during sign in";
      
      if (error.message.includes("user-not-found") || error.message.includes("No account found")) {
        errorMessage = "No account found with this email address";
      } else if (error.message.includes("wrong-password")) {
        errorMessage = "Incorrect password";
      } else if (error.message.includes("invalid-email")) {
        errorMessage = "Invalid email address";
      } else if (error.message.includes("user-disabled")) {
        errorMessage = "This account has been disabled";
      } else if (error.message.includes("too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpPress = () => {
    router.push('/(auth)/SignUp');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="school" size={50} color="#4CAF50" />
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your CampuSphere account</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInputField
            label="College Email"
            onChangeText={(v) => setEmail(v)}
          />
          <TextInputField
            label="Password"
            password={true}
            onChangeText={(v) => setPassword(v)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text={isLoading ? "Signing In..." : "Sign In"}
            onPress={onSignInPress}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={onSignUpPress}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2E2E2E",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 30,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: 15,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 30,
    position: "relative",
  },
  loadingIndicator: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  signUpText: {
    fontSize: 16,
    color: "#666",
  },
  signUpLink: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  footerContainer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default SignIn;
