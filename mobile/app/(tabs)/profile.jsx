import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "expo-router";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/");
  };

  const profileImage = require("../../assets/images/profile.png");

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image source={profileImage} style={styles.avatar} resizeMode="contain" />

      {/* User Info */}
      <Text style={styles.username}>{user?.username || "Demo User"}</Text>
      <Text style={styles.email}>{user?.email || "demo@example.com"}</Text>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#121212", 
  },
  avatar: {
    width: 250, // adjust width
    height: 150, // adjust height
    marginBottom: 24,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: "#FF4B5C",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
