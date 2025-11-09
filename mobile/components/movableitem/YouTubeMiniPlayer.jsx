import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

export default function YouTubeMiniPlayer({ url, thumbnail }) {
  const [play, setPlay] = useState(false);

  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  return (
    <View style={{ width: 200, height: 120 }}>
      {videoId && play ? (
        <WebView
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          source={{
            uri: `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&controls=1`,
          }}
        />
      ) : (
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => videoId && setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 32 }}>▶</Text>
          </View>
        </TouchableOpacity>
      )}
      {!videoId && !play && (
        <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>
          Invalid YouTube URL
        </Text>
      )}
    </View>
  );
}