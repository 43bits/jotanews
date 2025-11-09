import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";

export default function LinkPreview({ url }) {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        setMeta({
          title: data.data.title,
          description: data.data.description,
          image: data.data.image?.url,
        });
      } catch (err) {
        console.log("Failed to fetch link preview:", err);
      }
    };

    fetchMeta();
  }, [url]);

  if (!meta) return <Text style={{ color: "#fff" }}>Loading preview...</Text>;

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      style={{
        width: 160,
        backgroundColor: "#222",
        borderRadius: 10,
        overflow: "hidden",
        padding: 8,
      }}
    >
      {meta.image && (
        <Image
          source={{ uri: meta.image }}
          style={{ width: "100%", height: 80, borderRadius: 6 }}
          resizeMode="cover"
        />
      )}
      <Text style={{ color: "#fff", fontWeight: "bold", marginTop: 4 }} numberOfLines={1}>
        {meta.title || url}
      </Text>
      <Text style={{ color: "#ccc", fontSize: 12 }} numberOfLines={2}>
        {meta.description}
      </Text>
    </TouchableOpacity>
  );
}
