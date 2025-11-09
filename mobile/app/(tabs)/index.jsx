import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { getShowcases } from "../../services/showcaseService";
import { useShowcase } from "../../context/ShowcaseContext";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import MovableItem from "../../components/movableitem/MovableItem";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";


const { width, height } = Dimensions.get("window");
const canvasWidth = width * 4;
const canvasHeight = height * 2;



export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshFlag } = useShowcase();
  const [activeItemId, setActiveItemId] = useState(null);
  const [locked, setLocked] = useState(true); 

  const scale = useSharedValue(0.7);
  const savedScale = useSharedValue(0.7);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  
  const canvasStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

 
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getShowcases(1, 50);
      const positioned = res.showcases.map((i, idx) => ({
        ...i,
        initialX: i.posx ?? 100 + idx * 60,
        initialY: i.posy ?? 100 + idx * 40,
      }));
      setItems(positioned);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshFlag]);


  const pinchGesture = Gesture.Pinch()
    .onStart(() => { savedScale.value = scale.value; })
    .onUpdate((e) => {
      const minScale = 0.4;
      const maxScale = 3;
      const targetScale = savedScale.value * e.scale;
      if (targetScale < minScale) scale.value = withTiming(minScale, { duration: 50 });
      else if (targetScale > maxScale) scale.value = withTiming(maxScale, { duration: 50 });
      else scale.value = targetScale;
    })
    .onEnd(() => { if (scale.value < 0.7) scale.value = withTiming(0.7, { duration: 200 }); });

  
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    });


  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      const newScale = Math.min(scale.value + 0.4, 3); 
      scale.value = withTiming(newScale, { duration: 150 });
    });


  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  const handleCanvasTouch = () => setActiveItemId(null);

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <StatusBar style="light" backgroundColor="#000" translucent />
      <ActivityIndicator color="#fff" size="large" />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#111" }}>
      <TouchableWithoutFeedback onPress={handleCanvasTouch}>
        <View style={{ flex: 1 }}>
        
          <TouchableOpacity
            onPress={() => setLocked(prev => !prev)}
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              zIndex: 20,
              backgroundColor: "rgba(0,0,0,0.4)",
              padding: 6,
              borderRadius: 20,
            }}
          >
            <Ionicons name={locked ? "lock-closed" : "lock-open"} size={24} color="#fff" />
          </TouchableOpacity>

          <GestureDetector gesture={combinedGesture}>
            <Animated.View
              style={[
                { width: canvasWidth, height: canvasHeight, backgroundColor: "#181818", borderRadius: 20 },
                canvasStyle
              ]}
            >
              {items.map(item => (
                <MovableItem
                  key={item.id}
                  item={item}
                  isActive={activeItemId === item.id}
                  setActive={() => setActiveItemId(item.id)}
                  canMove={!locked} 
                  onUpdated={(updated, deletedId) => {
                    if (deletedId) setItems(prev => prev.filter(i => i.id !== deletedId));
                    else setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
                  }}
                />
              ))}
            </Animated.View>
          </GestureDetector>

          {refreshing && (
            <View style={{ position: "absolute", top: 40, right: 20, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 20, padding: 6 }}>
              <ActivityIndicator color="#fff" size="small" />
            </View>
          )}

        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}
