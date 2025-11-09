import React, { useState, useEffect, useRef } from "react";
import { View, Image, Text, TextInput, Keyboard, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { updateShowcase, deleteShowcase, updateShowcasePosition, voteShowcase } from "../../services/showcaseService";
import YouTubeMiniPlayer from "./YouTubeMiniPlayer";
import LinkPreview from "./LinkPreview";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MovableItem({ item, isActive, setActive, onUpdated, canMove }) {
  const router = useRouter();

  const x = useSharedValue(item.initialX);
  const y = useSharedValue(item.initialY);
  const offsetX = useSharedValue(x.value);
  const offsetY = useSharedValue(y.value);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.inputRaw);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [thumbUp, setThumbUp] = useState(item.thumbUp || false);
  const [thumbDown, setThumbDown] = useState(item.thumbDown || false);
  const [thumbUpCount, setThumbUpCount] = useState(item.thumbUpCount || 0);
  const [thumbDownCount, setThumbDownCount] = useState(item.thumbDownCount || 0);
  const inputRef = useRef(null);

  const savePosition = async (posx, posy) => {
    try { await updateShowcasePosition(item.id, { posx, posy }); } 
    catch (err) { console.log("Position save failed:", err); }
  };

  const dragGesture = Gesture.Pan().enabled(canMove)
    .onStart(() => { offsetX.value = x.value; offsetY.value = y.value; })
    .onUpdate(e => { x.value = offsetX.value + e.translationX; y.value = offsetY.value + e.translationY; })
    .onEnd(() => runOnJS(savePosition)(Math.floor(x.value), Math.floor(y.value)));

  const longPressGesture = Gesture.LongPress()
    .minDuration(800)
    .onStart(() => runOnJS(setActive)());

  const combinedGesture = Gesture.Simultaneous(dragGesture, longPressGesture);
  const style = useAnimatedStyle(() => ({ position: "absolute", left: x.value, top: y.value }));

  const startEditing = () => {
    setIsEditing(true);
    runOnJS(setActive)();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submitEdit = async () => {
    if (!editText.trim()) return setIsEditing(false);
    const updated = await updateShowcase(item.id, { input: editText });
    onUpdated?.(updated);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteShowcase(item.id);
    onUpdated?.(null, item.id);
    setConfirmDelete(false);
  };

  const handleSearchPredict = () => {
    let query = item.type === "text" ? item.inputRaw : item.url || "";
    if (!query) return;
    router.push({ pathname: "/check", params: { text: query, type: item.type, url: item.url || "" } });
  };

  const handleThumbUp = async () => {
    let newUp = !thumbUp;
    let newDown = thumbDown && newUp ? false : thumbDown;
    setThumbUp(newUp);
    setThumbDown(newDown);
    setThumbUpCount(prev => newUp ? prev + 1 : prev - 1);
    if (thumbDown && newUp) setThumbDownCount(prev => prev - 1);

    await voteShowcase(item.id, { up: newUp, down: newDown });
  };

  const handleThumbDown = async () => {
    let newDown = !thumbDown;
    let newUp = thumbUp && newDown ? false : thumbUp;
    setThumbDown(newDown);
    setThumbUp(newUp);
    setThumbDownCount(prev => newDown ? prev + 1 : prev - 1);
    if (thumbUp && newDown) setThumbUpCount(prev => prev - 1);

    await voteShowcase(item.id, { up: newUp, down: newDown });
  };

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidHide", () => { if (isEditing) submitEdit(); });
    return () => sub.remove();
  }, [isEditing, editText]);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={[style, { padding: 4, zIndex: 10 }]}>

        {isActive && !isEditing && (
          <View style={{ position: "absolute", top: -30, right: -10, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 20, padding: 4 }}>
            {item.type === "text" && (
              <TouchableOpacity onPress={startEditing} style={{ marginHorizontal: 4 }}>
                <Ionicons name="pencil" size={20} color="#0f0" />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleSearchPredict} style={{ marginHorizontal: 4 }}>
              <Ionicons name="search" size={20} color="#0af" />
            </TouchableOpacity>

            {/* 👍 Thumbs Up */}
            <TouchableOpacity onPress={handleThumbUp} style={{ marginHorizontal: 4, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="thumbs-up" size={20} color={thumbUp ? "#0f0" : "#888"} />
              <Text style={{ color: "#fff", marginLeft: 2 }}>{thumbUpCount}</Text>
            </TouchableOpacity>

            {/* 👎 Thumbs Down */}
            <TouchableOpacity onPress={handleThumbDown} style={{ marginHorizontal: 4, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="thumbs-down" size={20} color={thumbDown ? "#f33" : "#888"} />
              <Text style={{ color: "#fff", marginLeft: 2 }}>{thumbDownCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setConfirmDelete(true)} style={{ marginHorizontal: 4 }}>
              <Ionicons name="trash" size={20} color="#f00" />
            </TouchableOpacity>
          </View>
        )}

        {/* Confirm Delete */}
        {confirmDelete && (
          <View style={{ position: "absolute", top: -50, right: -10, backgroundColor: "#222", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity onPress={() => setConfirmDelete(false)}>
              <Text style={{ color: "#0f0", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={{ color: "#f33", fontWeight: "600" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        {item.type === "text" && (
          <View style={{ backgroundColor: "#333", padding: 10, borderRadius: 8, maxWidth: 200 }}>
            {isEditing ? (
              <TextInput
                ref={inputRef}
                value={editText}
                onChangeText={setEditText}
                onSubmitEditing={submitEdit}
                style={{ color: "#fff", fontSize: 14, padding: 0 }}
                multiline
                blurOnSubmit
              />
            ) : (
              <Text style={{ color: "#fff", fontSize: 14 }}>{item.inputRaw}</Text>
            )}
          </View>
        )}

        {item.type === "image" && (
          <Image
            source={{ uri: item.url }}
            style={{ width: item.width || 200, height: item.height || 200, borderRadius: 10, resizeMode: "contain" }}
          />
        )}

        {item.type === "youtube" && <YouTubeMiniPlayer url={item.url} thumbnail={item.previewMeta?.thumbnail} />}
        {item.type === "link" && <LinkPreview url={item.url} />}
      </Animated.View>
    </GestureDetector>
  );
}
