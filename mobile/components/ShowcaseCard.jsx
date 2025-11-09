import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";


export default function ShowcaseCard({ item }) {
const router = useRouter();
return (
<Pressable onPress={() => router.push(`/showcase/${item.id}`)} style={styles.card}>
{item.previewMeta?.image || item.previewMeta?.url ? (
<Image source={{ uri: item.previewMeta?.image || item.url }} style={styles.image} />
) : null}
<View style={styles.content}>
<Text numberOfLines={2} style={styles.title}>
{item.previewMeta?.title || item.inputRaw || "Untitled"}
</Text>
<Text numberOfLines={2} style={styles.desc}>
{item.previewMeta?.description || ""}
</Text>
</View>
</Pressable>
);
}


const styles = StyleSheet.create({
card: { flexDirection: "row", padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
image: { width: 96, height: 64, borderRadius: 6, marginRight: 12 },
content: { flex: 1, justifyContent: "center" },
title: { fontWeight: "700", marginBottom: 4 },
desc: { color: "#555", fontSize: 13 },
});