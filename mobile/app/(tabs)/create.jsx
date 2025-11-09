import React, { useState } from "react";
import { View, TextInput, Button, Alert, ActivityIndicator, Text, Image } from "react-native";
import { createShowcase } from "../../services/showcaseService";
import { useRouter } from "expo-router";
import { useShowcase } from "../../context/ShowcaseContext";
import * as ImagePicker from "expo-image-picker";

export default function Create() {
  const [input, setInput] = useState("");      
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { triggerRefresh } = useShowcase();

 
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setImageData(result.assets[0].base64);
      setInput("");
    }
  };

  const submit = async () => {
    if (!input.trim() && !imageData) {
      return Alert.alert("Please enter text or pick an image");
    }

    setLoading(true);
    try {
      
      const payload = imageData ? `data:image/jpeg;base64,${imageData}` : input.trim();
      await createShowcase(payload);
      triggerRefresh();
      setInput("");
      setImageData(null);
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Paste text or link here"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          height: 120,
          marginBottom: 12,
          textAlignVertical: "top",
        }}
        multiline
        editable={!imageData} 
      />

      {imageData && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageData}` }}
          style={{ width: 200, height: 200, marginBottom: 12, borderRadius: 8 }}
        />
      )}

      <Button title="Pick Image" onPress={pickImage} />

      {loading ? (
        <View style={{ alignItems: "center", marginTop: 12 }}>
          <ActivityIndicator color="#000" />
          <Text style={{ marginTop: 8 }}>Saving...</Text>
        </View>
      ) : (
        <Button title="Save" onPress={submit} style={{ marginTop: 12 }} />
      )}
    </View>
  );
}
