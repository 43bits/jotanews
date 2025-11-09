import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createShowcase } from "../../services/showcaseService";

export default function InputModal({ visible, onClose, onSubmit }) {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]); 
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() && !selectedImage) return;
    setSaving(true);
    try {
      const data = selectedImage
        ? `data:image/jpeg;base64,${selectedImage.base64}`
        : input;
      await createShowcase(data);
      onSubmit(); 
      setInput("");
      setSelectedImage(null);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: "#222",
                padding: 20,
                borderRadius: 12,
                width: "90%",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>
                {selectedImage ? "Selected Image" : "Add Text or Image"}
              </Text>

              {selectedImage ? (
                <View
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: 10,
                    width: "100%",
                    aspectRatio: selectedImage.width / selectedImage.height, 
                  }}
                >
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain", 
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 15,
                      padding: 4,
                    }}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type something..."
                  placeholderTextColor="#888"
                  style={{
                    backgroundColor: "#333",
                    color: "#fff",
                    borderRadius: 8,
                    padding: 12,
                    height: 100,
                    textAlignVertical: "top",
                  }}
                  multiline
                />
              )}

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                {!selectedImage && (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      backgroundColor: "#333",
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="image-outline" size={18} color="#fff" />
                    <Text style={{ color: "#fff", marginLeft: 5 }}>Add Image</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: "#007AFF",
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    borderRadius: 8,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  disabled={saving}
                  onPress={handleSubmit}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>
                    {saving ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
