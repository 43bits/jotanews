import { Stack } from "expo-router";
import "react-native-reanimated";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
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
  return <Stack screenOptions={{ headerShown: false }} />;

}