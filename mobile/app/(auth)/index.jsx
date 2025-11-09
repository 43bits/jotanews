import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handle = async () => {
    const res = await login(email, password);
    if (res.success) router.replace("/(tabs)");
    else setError(res.error);
  };

  const loginImage = require("../../assets/images/login.png");

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image source={loginImage} style={styles.image} resizeMode="contain" />

      <Text style={styles.title}>Sign In</Text>
      {error && <Text style={styles.err}>{error}</Text>}

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
      <Button title="Login" onPress={handle} color="#4A90E2" />

      <Link href="/register">
        <Text style={styles.link}>Create account</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#121212", 
    alignItems: "center",
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
  link: {
    marginTop: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
  err: {
    color: "#FF4B5C",
    marginBottom: 8,
  },
});
