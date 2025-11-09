// import "react-native-reanimated";
// import { Slot, useRouter, useSegments } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import { ShowcaseProvider } from "../../context/ShowcaseContext";
// import { useAuthStore } from "../../store/authStore";
// import BottomBar from "../../components/BottomBar/BottomBar";

// export default function RootLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const { checkAuth, user, token } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     const inAuthScreen = segments[0] === "(auth)";
//     const isSignedIn = user && token;

//     if (!user) return; // wait until auth is loaded

//     if (!isSignedIn && !inAuthScreen) {
//       router.replace("/(auth)");
//     } else if (isSignedIn && inAuthScreen) {
//       router.replace("/(tabs)/index"); // go to main home
//     }
//   }, [user, token, segments]);

//   const inAuthScreen = segments[0] === "(auth)";

//   return (
//     <ShowcaseProvider>
//       <SafeAreaProvider>
//         <StatusBar style="light" />
//         <Slot />
//         {!inAuthScreen && <BottomBar />} {/* Persistent global bottom bar */}
//       </SafeAreaProvider>
//     </ShowcaseProvider>
//   );
// }

import "react-native-reanimated";
import { Slot, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ShowcaseProvider } from "../../context/ShowcaseContext";
import { useAuthStore } from "../../store/authStore";
import GlobalBottomBar from "../../components/BottomBar/GlobalBottomBar";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;
    setShowBar(isSignedIn && !inAuthScreen);

    if (!user) return;
    if (!isSignedIn && !inAuthScreen) router.replace("/(auth)");
    else if (isSignedIn && inAuthScreen) router.replace("/(tabs)/index");
  }, [user, token, segments]);

  return (
    <ShowcaseProvider>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#000000ff"/>
        <Slot />
        {showBar && <GlobalBottomBar />}
      </SafeAreaProvider>
    </ShowcaseProvider>
  );
}
