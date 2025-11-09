import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";


const GOOGLE_API_KEY = "AIzaSyDXM8ht8304PRECU0547oL3I1vza3mIwcI";
const GOOGLE_CX = "819ec3ca38b294903";


const PERPLEXITY_API_KEY = "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";


const getTrustInfo = async (title, url) => {
  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a fact-checker. Determine whether the news item is real or fake, official or unofficial, using the provided text or URL."
          },
          {
            role: "user",
            content: `News title: "${title}"\nURL: ${url}`
          }
        ],
        temperature: 0.0
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const verdictText = response.data.choices?.[0]?.message?.content || "";
    console.log("Perplexity response for", url, ":", verdictText);

    const lower = verdictText.toLowerCase();
    if (lower.includes("fake") || lower.includes("false") || lower.includes("untrusted")) {
      return { label: "Untrusted", color: "#FF4444" };
    } else if (lower.includes("real") || lower.includes("trusted") || lower.includes("official")) {
      return { label: "Trusted", color: "#00BFFF" };
    } else {
      return { label: "Unknown", color: "#888" };
    }
  } catch (err) {
    console.error("Perplexity API error:", err.message);
    return { label: "Unknown", color: "#888" };
  }
};

export default function HybridNewsExplorer() {
  const [query, setQuery] = useState("");
  const [currentUrl, setCurrentUrl] = useState(null);
  const [results, setResults] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainTrust, setMainTrust] = useState({ label: "Trusted", color: "#00BFFF" });

  const lastTap = useRef(null);
  const screenHeight = Dimensions.get("window").height;


  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setCurrentUrl(null);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          query
        )}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}`
      );

      const items = response.data.items || [];
      if (items.length > 0) setCurrentUrl(items[0].link);

  
      const related = await Promise.all(
        items.slice(1, 5).map(async (item) => {
          const trust = await getTrustInfo(item.title, item.link);
          return {
            title: item.title,
            url: item.link,
            trusted: trust.label === "Trusted",
            label: trust.label,
            color: trust.color,
          };
        })
      );

      setResults(related);
    } catch (err) {
      console.error("Search API error:", err.message);
      alert("Error fetching search results. Check API key and CX.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!currentUrl) return;
    const fetchTrust = async () => {
      const trust = await getTrustInfo(query, currentUrl);
      setMainTrust(trust);
    };
    fetchTrust();
  }, [currentUrl]);

 
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      setIsFullScreen(true);
    }
    lastTap.current = now;
  };

  const openArticle = (url) => {
    setCurrentUrl(url);
    setIsFullScreen(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="newspaper-outline" size={28} color="#00BFFF" />
        <Text style={styles.headerTitle}>Hybrid News Explorer</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Search topic or website..."
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={26} color="#00BFFF" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#00BFFF" style={{ margin: 10 }} />}

      {/* Main WebView */}
      {currentUrl && (
        <View
          style={[
            styles.webviewContainer,
            { height: isFullScreen ? screenHeight - 20 : screenHeight * 0.35 },
          ]}
        >
          {isFullScreen && (
            <TouchableOpacity
              style={styles.shrinkButtonLeft}
              onPress={() => setIsFullScreen(false)}
            >
              <Ionicons name="remove-circle" size={28} color="#00BFFF" />
            </TouchableOpacity>
          )}

          {/* Domain badge */}
          <View
            style={[
              styles.domainBadgeTopRight,
              { backgroundColor: mainTrust.color },
            ]}
          >
            <Text style={styles.domainBadgeText}>{new URL(currentUrl).hostname}</Text>
          </View>

          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleDoubleTap}>
            <WebView
              source={{ uri: currentUrl }}
              style={styles.webview}
              startInLoadingState
              nestedScrollEnabled
              scalesPageToFit
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Related articles */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.trusted ? styles.trusted : styles.untrusted]}
            onPress={() => openArticle(item.url)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.domainBadge}>
              <Ionicons
                name={item.trusted ? "shield-checkmark" : "alert-circle"}
                color={item.color}
                size={18}
              />
              <Text style={[styles.domainText, { color: item.color }]}>
                {item.label}: {new URL(item.url).hostname}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", paddingTop: 40 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginBottom: 10 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600", marginLeft: 10 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#111", borderRadius: 12, padding: 10, marginHorizontal: 10, marginBottom: 10 },
  input: { flex: 1, color: "#fff", marginHorizontal: 10, fontSize: 16 },
  webviewContainer: { marginHorizontal: 10, borderRadius: 12, overflow: "hidden", backgroundColor: "#0A4EFF", marginBottom: 10, position: "relative" },
  webview: { flex: 1, borderRadius: 12 },
  shrinkButtonLeft: { position: "absolute", top: 10, left: 10, zIndex: 2 },
  domainBadgeTopRight: { position: "absolute", top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 2 },
  domainBadgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  card: { margin: 10, padding: 14, borderRadius: 12, backgroundColor: "#111", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4 },
  title: { fontSize: 16, color: "#fff", fontWeight: "500", marginBottom: 8 },
  domainBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  domainText: { fontSize: 13 },
  trusted: { borderLeftWidth: 4, borderLeftColor: "#00BFFF" },
  untrusted: { borderLeftWidth: 4, borderLeftColor: "#FF4444" },
});
