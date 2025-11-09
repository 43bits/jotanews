import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { useShowcase } from "../../context/ShowcaseContext";
import InputModal from "../InputModel/InputModal";

export default function GlobalBottomBar() {
  const router = useRouter();
  const segments = useSegments();
  const currentPage = segments[1] || "index";
  const { triggerRefresh } = useShowcase();

  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    if (currentPage === "index") {
      triggerRefresh();
    } else {
      router.push("/(tabs)/");
      setTimeout(() => triggerRefresh(), 500);
    }
  };

  const barItems = [
    { icon: "home-outline", label: "Home", onPress: () => router.push("/(tabs)/") },
    { icon: "create-outline", label: "Text", onPress: () => setModalVisible(true) },
    { icon: "person-outline", label: "Browser", onPress: () => router.push("/(tabs)/browser") },
    { icon: "person-outline", label: "profile", onPress: () => router.push("/(tabs)/profile") },
    { icon: "person-outline", label: "com", onPress: () => router.push("/(tabs)/community") },
    { icon: "person-outline", label: "check", onPress: () => router.push("/(tabs)/check") },
    { icon: "settings-outline", label: "Settings", onPress: () => {} },
  ];

  const iconWidth = 80; 

  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: 30,
          alignSelf: "center",
          flexDirection: "row",
          backgroundColor: "#222",
          borderRadius: 40,
          paddingVertical: 10,
          paddingHorizontal: 15,
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
          width: 300, 
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}
        >
          {barItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: iconWidth,
                justifyContent: "center",
                marginHorizontal: 5,
              }}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={20} color="#fff" />
              <Text style={{ color: "#fff", marginLeft: 5 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <InputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
