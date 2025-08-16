import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TextInputField from "@/components/TextInputField";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/configs/FirebaseConfig";
import axios from "axios";
import Constants from "expo-constants";

const SignUp = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [fullName, setFullName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const uploadImageToFirebase = async (
    imageUri: string,
    userId: string
  ): Promise<string> => {
    try {
      setIsUploadingImage(true);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(
        storage,
        `CampuSphere/profile_images/${userId}_${Date.now()}.jpg`
      );

      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);

      setIsUploadingImage(false);
      return downloadURL;
    } catch (error) {
      setIsUploadingImage(false);
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const saveUserToDatabase = async (
    name: string,
    email: string,
    image: string
  ) => {
    try {
      console.log("Saving user to database:", { name, email, image });

      const devServerUrl = Constants.expoConfig?.hostUri
        ? `http://${Constants.expoConfig.hostUri.split(":")[0]}:8081`
        : "http://localhost:8081";

      console.log("Using API URL:", `${devServerUrl}/users`);

      const response = await axios.post(
        `${devServerUrl}/users`,
        {
          name: name,
          email: email,
          image: image,
        },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User saved to database:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error saving user to database:", error);

      if (error.response) {
        console.error("Server error:", error.response.data);
        console.error("Status:", error.response.status);
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

  const onBtnPress = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please enter all details!", ToastAndroid.BOTTOM);
      return;
    }

    if (password.length < 6) {
      ToastAndroid.show(
        "Password should be at least 6 characters!",
        ToastAndroid.BOTTOM
      );
      return;
    }

    setIsLoading(true);

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created:", userCredentials.user.uid);

      let profileImageUrl = "";

      if (profileImage) {
        try {
          profileImageUrl = await uploadImageToFirebase(
            profileImage,
            userCredentials.user.uid
          );
          console.log("Profile image uploaded:", profileImageUrl);

        } catch (imageError) {
          console.error("Error uploading profile image:", imageError);
          ToastAndroid.show(
            "Account created but failed to upload profile image",
            ToastAndroid.LONG
          );
        }
      }

      await updateProfile(userCredentials.user, {
        displayName: fullName,
        photoURL: profileImageUrl || null,
      });

      try {
        await saveUserToDatabase(fullName, email, profileImageUrl || "");
        ToastAndroid.show("Account created successfully!", ToastAndroid.SHORT);
        console.log("User data saved to NileDB successfully");

      } catch (dbError) {
        console.error("Error saving to NileDB:", dbError);
        ToastAndroid.show(
          "Account created but failed to save user data",
          ToastAndroid.LONG
        );
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      ToastAndroid.show(
        error.message || "An error occurred during signup",
        ToastAndroid.BOTTOM
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      console.log(result);

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      ToastAndroid.show("Error selecting image", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="school" size={50} color="#4CAF50" />
          <Text style={styles.title}>Create New Account</Text>
        </View>

        <View style={styles.imageSection}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.imageContainer}
            disabled={isUploadingImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="person" size={50} color="#9E9E9E" />
              </View>
            )}

            <View style={styles.cameraIcon}>
              {isUploadingImage ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <AntDesign name="camera" size={20} color="white" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to add profile photo</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInputField
            label="Full Name"
            onChangeText={(v) => setFullName(v)}
          />
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
            text={isLoading ? "Creating Account..." : "Create Account"}
            onPress={onBtnPress}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
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
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2E2E2E",
    marginTop: 10,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#4CAF50",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  imageHint: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 10,
    position: "relative",
  },
  loadingIndicator: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  footerContainer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 6,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});

export default SignUp;
