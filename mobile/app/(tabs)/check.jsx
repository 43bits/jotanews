import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { checkFakeNews } from "../../utils/perplexity";
import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;


export default function NewsCheck() {
  const { text } = useLocalSearchParams();
  const router = useRouter();

  const [googleResults, setGoogleResults] = useState([]);
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const verdictColor = (v) => {
    if (/FAKE/i.test(v)) return "#f33";
    if (/REAL|Official/i.test(v)) return "#0f0";
    if (/Unofficial/i.test(v)) return "#ff0";
    return "#aaa";
  };

  useEffect(() => {
    if (!text) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        let headingOrText = text;
        const isVideo = /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com/.test(text);

        
        if (isVideo) {
          const googleVideoResponse = await axios.get(
            `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text)}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}`
          );
          const firstItem = googleVideoResponse.data.items?.[0];
          headingOrText = firstItem?.title || text;
        }

    
        const response = await axios.get(
          `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text)}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}`
        );

        const items = response.data.items || [];
        const googleResultsFormatted = items.slice(0, 3).map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        }));
        setGoogleResults(googleResultsFormatted);

        const apiResponse = await checkFakeNews(
          headingOrText,
          isVideo ? "Check if this video is from an official news channel or unofficial source" : ""
        );

        setApiResult({
          source: "Perplexity",
          verdict: apiResponse.verdict,
          details: apiResponse.details,
        });

      } catch (err) {
        console.log("Error fetching data:", err);
        setApiResult({
          source: "Perplexity",
          verdict: "Error fetching verdict",
          details: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [text]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Analyzing news...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 50 }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", top: 40, left: 20, zIndex: 20 }}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={{ color: "#fff", fontSize: 18, textAlign: "center", marginTop: 10 }}>
        📰 Checking authenticity of:
      </Text>
      <Text style={{ color: "#0af", textAlign: "center", fontSize: 14, marginVertical: 10, marginHorizontal: 12 }}>
        “{text?.slice(0, 250)}...”
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <View style={cardStyle}>
          <Text style={cardTitle}>Google Search</Text>
          {googleResults.map((g, idx) => (
            <TouchableOpacity key={idx} onPress={() => Linking.openURL(g.link)} style={{ marginBottom: 12 }}>
              <Text style={linkTitle}>{g.title}</Text>
              <Text style={snippetStyle}>{g.snippet}</Text>
              <Text style={linkStyle}>{g.link}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={cardStyle}>
          <Text style={cardTitle}>Perplexity AI Check</Text>
          <Text style={{ color: "#0af", fontWeight: "bold", fontSize: 16 }}>{apiResult.source}</Text>
          <Text style={{ color: verdictColor(apiResult.verdict), marginTop: 8, fontWeight: "600" }}>
            {apiResult.verdict}
          </Text>
          {apiResult.details && (
            <ScrollView style={{ maxHeight: 200, marginTop: 6 }}>
              <Text style={{ color: "#aaa", lineHeight: 18 }}>
                {apiResult.details}
              </Text>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  backgroundColor: "#181818",
  borderRadius: 14,
  padding: 16,
  marginHorizontal: 8,
  width: 280,
  minHeight: 300,
};

const cardTitle = {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
  marginBottom: 10,
};

const linkTitle = {
  color: "#0af",
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 4,
};

const snippetStyle = {
  color: "#aaa",
  fontSize: 13,
  marginBottom: 4,
};

const linkStyle = {
  color: "#0af",
  fontSize: 12,
};
