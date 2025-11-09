import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Register() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handle = async () => {
    const res = await register(username, email, password);
    if (res.success) router.replace("/(tabs)");
    else setError(res.error);
  };

  
  const registerImage = require("../../assets/images/register.png");

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image source={registerImage} style={styles.image} resizeMode="contain" />

      <Text style={styles.title}>Create Account</Text>
      {error && <Text style={styles.err}>{error}</Text>}

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <Button title="Register" onPress={handle} color="#4A90E2" />

      {/* Link to Login */}
      <TouchableOpacity onPress={() => router.replace("/(auth)/")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    width: "100%",
    color: "#fff",
    backgroundColor: "#1e1e1e",
  },
  err: {
    color: "#FF4B5C",
    marginBottom: 8,
  },
  link: {
    marginTop: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
});
