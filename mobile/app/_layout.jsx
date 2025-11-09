import "react-native-reanimated";
import { Slot, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ShowcaseProvider } from "../context/ShowcaseContext";
import { useAuthStore } from "../store/authStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SafeScreen from "../components/SafeScreen";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return; 

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, loading]);

  
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000" }}>
      <ShowcaseProvider>
        <SafeAreaProvider style={{ backgroundColor: "#000" }}>
          <SafeScreen>
              <StatusBar style="light" translucent backgroundColor="transparent" />
            <Slot />
          </SafeScreen>
        </SafeAreaProvider>
      </ShowcaseProvider>
    </GestureHandlerRootView>
  );
}
