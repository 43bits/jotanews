"use client";
import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import MovableItem from "../../components/movableitem/MovableItem";

export default function ViewUserCanvas({ searchParams }) {
  const showcases = JSON.parse(searchParams.showcases || "[]");

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {showcases.length === 0 ? (
        <Text style={{ color: "#fff" }}>No items to display</Text>
      ) : (
        showcases.map((item) => (
          <MovableItem
            key={item.id}
            item={item}
            isActive={false}
            canMove={false}
          />
        ))
      )}
    </ScrollView>
  );
}
