"use client";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { getAllUsers, getUserShowcases } from "../../services/communityService";
import { useRouter } from "expo-router";

export default function CommunityPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("getAllUsers error:", err.response?.data || err.message);
        Alert.alert("Error fetching users", err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openUserCanvas = async (userId) => {
    try {
      const showcases = await getUserShowcases(userId);
      router.push({
        pathname: "/view-user",
        params: { userId, showcases: JSON.stringify(showcases) },
      });
    } catch (err) {
      console.error("Error fetching user canvas:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to load user's showcases");
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#0af" />
    </View>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => openUserCanvas(item.id)}>
          <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  userItem: {
    padding: 16,
    backgroundColor: "#222",
    borderRadius: 8,
    marginBottom: 12,
  },
  username: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
