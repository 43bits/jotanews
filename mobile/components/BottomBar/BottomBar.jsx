import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";

export default function BottomBar() {
  const router = useRouter();
  const segments = useSegments();
  const current = segments[1] || "index"; 

  const tabs = [
    { name: "index", icon: "home-outline", path: "/(tabs)/" },
    { name: "create", icon: "add-circle-outline", path: "/(tabs)/create" },
    { name: "profile", icon: "person-outline", path: "/(tabs)/profile" },
  ];

  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "#222",
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingVertical: 10,
        elevation: 8,
        shadowColor: "#000",
      }}
    >
      {tabs.map((tab) => {
        const isActive = current === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => {
              try {
                router.push(tab.path);
              } catch (err) {
                console.warn("Navigation error:", err);
              }
            }}
            style={{ marginHorizontal: 15 }}
          >
            <Ionicons
              name={tab.icon}
              size={28}
              color={isActive ? "#4CAF50" : "#fff"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
