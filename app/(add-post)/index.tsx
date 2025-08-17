import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import { LinearGradient } from 'expo-linear-gradient';

export default function AddPost() {
  const { userData } = useUser();
  const router = useRouter();
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [visibility, setVisibility] = useState<"public">("public");

  const remaining = 280 - postContent.length;

  const pick = async (source: "camera" | "gallery") => {
    const perm =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {
      Alert.alert("Permission needed", "Enable permission in settings");
      return;
    }

    const res =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            quality: 0.8,
            allowsEditing: true,
          });

    if (!res.canceled) setSelectedImage(res.assets[0].uri);
    setShowImageOptions(false);
  };

  const submit = async () => {
    if (!postContent.trim()) {
      Alert.alert("Empty Post", "Please write something!");
      return;
    }

    let imageBase64: string | null = null;
    if (selectedImage) {
      const blob = await (await fetch(selectedImage)).blob();
      imageBase64 = await new Promise<string>((ok, err) => {
        const r = new FileReader();
        r.onloadend = () => ok((r.result as string).split(",")[1]);
        r.onerror = () => err("encode error");
        r.readAsDataURL(blob);
      });
    }

    const host = Constants.expoConfig?.hostUri
      ? `http://${Constants.expoConfig.hostUri.split(":")[0]}:8081`
      : "http://localhost:8081";

    try {
      const res = await fetch(`${host}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent.trim(),
          imageBase64,
          visiblein: visibility,
          createdby: userData?.email ?? "anon",
        }),
      });
      const json = await res.json();
      
      if (!res.ok || json.error) {
        throw new Error(json.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      Alert.alert("Success", "Post created!", [
        { text: "OK", onPress: () => {
          router.back();
          router.push("/(tabs)/Home");
        }},
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={st.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={st.header}
      >
        <View style={st.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={st.headerBtn}>
            <View style={st.headerBtnCircle}>
              <Ionicons name="arrow-back" size={22} color="#667eea" />
            </View>
          </TouchableOpacity>
          
          <Text style={st.hTitle}>Create Post</Text>
          
          <TouchableOpacity
            onPress={submit}
            style={[
              st.postBtn,
              !postContent.trim() && st.postBtnDisabled
            ]}
            disabled={!postContent.trim()}
          >
            <LinearGradient
              colors={postContent.trim() ? ['#6bd3ffff', '#2ec0ffff'] : ['#95a5a6', '#7f8c8d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={st.postBtnGradient}
            >
              <Text style={st.postTxt}>Post</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={st.body} showsVerticalScrollIndicator={false}>
        <View style={st.profileSection}>
          <View style={st.profileCard}>
            <View style={st.avatarContainer}>
              {userData?.image ? (
                <Image source={{ uri: userData.image }} style={st.avatar} />
              ) : (
                <LinearGradient
                  colors={['#a8edea', '#fed6e3']}
                  style={[st.avatar, st.avatarGradient]}
                >
                  <Ionicons name="person" size={28} color="#667eea" />
                </LinearGradient>
              )}
              <View style={st.onlineIndicator} />
            </View>
            
            <View style={st.userInfo}>
              <Text style={st.userName}>{userData?.name ?? "User"}</Text>
              <Text style={st.userHandle}>@{userData?.email?.split('@')[0] ?? "user"}</Text>
            </View>
          </View>
        </View>

        <View style={st.contentSection}>
          <View style={st.inputCard}>
            <TextInput
              style={st.input}
              placeholder="What's on your mind?"
              placeholderTextColor="#95a5a6"
              multiline
              maxLength={280}
              value={postContent}
              onChangeText={setPostContent}
            />
          </View>
        </View>

        {selectedImage && (
          <View style={st.imagePreview}>
            <View style={st.imageCard}>
              <Image source={{ uri: selectedImage }} style={st.previewImage} />
              <TouchableOpacity
                style={st.removeImageBtn}
                onPress={() => setSelectedImage(null)}
              >
                <LinearGradient
                  colors={['#ff6b6b', '#ee5a24']}
                  style={st.removeImageGradient}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={st.metaSection}>
          <View style={st.metaCard}>
            <View style={st.counterContainer}>
              <View style={[
                st.counterCircle,
                remaining < 20 && { borderColor: '#f39c12' },
                remaining < 0 && { borderColor: '#e74c3c' }
              ]}>
                <Text style={[
                  st.counterText,
                  remaining < 20 && { color: '#f39c12' },
                  remaining < 0 && { color: '#e74c3c' }
                ]}>
                  {remaining}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={st.visibilityBtn}
              onPress={() => setVisibilityOpen(!visibilityOpen)}
            >
              <View style={st.visibilityContent}>
                <Ionicons name="earth" size={18} color="#667eea" />
                <Text style={st.visibilityText}>{visibility}</Text>
                <Ionicons
                  name={visibilityOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#667eea"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {visibilityOpen && (
          <View style={st.visibilityDropdown}>
            <TouchableOpacity
              style={st.visibilityItem}
              onPress={() => {
                setVisibility("public");
                setVisibilityOpen(false);
              }}
            >
              <View style={st.visibilityItemContent}>
                <Ionicons name="earth" size={20} color="#27ae60" />
                <View>
                  <Text style={st.visibilityItemTitle}>Public</Text>
                  <Text style={st.visibilityItemDesc}>Everyone can see this post</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Bar */}
        <View style={st.actionBar}>
          <View style={st.actionBarContent}>
            <TouchableOpacity
              style={st.actionBtn}
              onPress={() => setShowImageOptions(!showImageOptions)}
            >
              <LinearGradient
                colors={['#a8edea', '#fed6e3']}
                style={st.actionBtnGradient}
              >
                <Ionicons name="image" size={22} color="#667eea" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={st.actionBtn}
              onPress={() => pick("camera")}
            >
              <LinearGradient
                colors={['#ffecd2', '#fcb69f']}
                style={st.actionBtnGradient}
              >
                <Ionicons name="camera" size={22} color="#e17055" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={st.actionSpacer} />
          </View>
        </View>

        {showImageOptions && (
          <View style={st.imageOptionsDropdown}>
            <View style={st.imageOptionsCard}>
              <TouchableOpacity 
                style={st.imageOption}
                onPress={() => pick("camera")}
              >
                <View style={st.imageOptionIcon}>
                  <LinearGradient
                    colors={['#ffecd2', '#fcb69f']}
                    style={st.imageOptionIconGradient}
                  >
                    <Ionicons name="camera" size={20} color="#e17055" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={st.imageOptionTitle}>Take Photo</Text>
                  <Text style={st.imageOptionDesc}>Capture a new photo</Text>
                </View>
              </TouchableOpacity>

              <View style={st.imageOptionDivider} />

              <TouchableOpacity 
                style={st.imageOption}
                onPress={() => pick("gallery")}
              >
                <View style={st.imageOptionIcon}>
                  <LinearGradient
                    colors={['#a8edea', '#fed6e3']}
                    style={st.imageOptionIconGradient}
                  >
                    <Ionicons name="images" size={20} color="#667eea" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={st.imageOptionTitle}>Choose from Gallery</Text>
                  <Text style={st.imageOptionDesc}>Select an existing photo</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    paddingTop: 60,
  },
  header: {
    paddingVertical: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerBtn: {
    padding: 4,
  },
  headerBtnCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  postBtn: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  postBtnGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  postBtnDisabled: {
    opacity: 0.6,
  },
  postTxt: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  body: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    paddingBottom: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 18,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#27ae60',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  contentSection: {
    padding: 20,
    paddingTop: 10,
  },
  inputCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  input: {
    fontSize: 18,
    minHeight: 120,
    color: '#2c3e50',
    textAlignVertical: 'top',
    lineHeight: 26,
  },
  imagePreview: {
    padding: 20,
    paddingTop: 10,
  },
  imageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 15,
    overflow: 'hidden',
  },
  removeImageGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaSection: {
    padding: 20,
    paddingTop: 10,
  },
  metaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  counterContainer: {
    alignItems: 'center',
  },
  counterCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27ae60',
  },
  visibilityBtn: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  visibilityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
  },
  visibilityText: {
    color: '#667eea',
    marginHorizontal: 8,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  visibilityDropdown: {
    padding: 20,
    paddingTop: 0,
  },
  visibilityItem: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  visibilityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  visibilityItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 16,
  },
  visibilityItemDesc: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 16,
    marginTop: 2,
  },
  actionBar: {
    padding: 20,
    paddingTop: 10,
  },
  actionBarContent: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  actionBtn: {
    marginRight: 16,
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionBtnGradient: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSpacer: {
    flex: 1,
  },
  imageOptionsDropdown: {
    padding: 20,
    paddingTop: 0,
  },
  imageOptionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  imageOptionIcon: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageOptionIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  imageOptionDesc: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  imageOptionDivider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 20,
  },
});