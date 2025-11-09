import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../services/apiClient";


export const useAuthStore = create((set, get) => ({
user: null,
token: null,
isLoading: false,
isCheckingAuth: true,
loading: true,

 checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (token && user) {
        set({ token, user: JSON.parse(user), loading: false });
      } else {
        set({ user: null, token: null, loading: false });
      }
    } catch (e) {
      console.error("Auth check error:", e);
      set({ user: null, token: null, loading: false });
    }
  },

login: async (email, password) => {
set({ isLoading: true });
try {
const { data } = await apiClient.post("/auth/login", { email, password });
await AsyncStorage.setItem("user", JSON.stringify(data.user));
await AsyncStorage.setItem("token", data.token);
// console.log("TOKEN STORED:", data.token);
set({ user: data.user, token: data.token, isLoading: false });
return { success: true };
} catch (error) {
set({ isLoading: false });
const msg = error.response?.data?.message || error.message;
return { success: false, error: msg };
}
},

register: async (username, email, password) => {
set({ isLoading: true });
try {
const { data } = await apiClient.post("/auth/register", { username, email, password });
await AsyncStorage.setItem("user", JSON.stringify(data.user));
await AsyncStorage.setItem("token", data.token);
set({ user: data.user, token: data.token, isLoading: false });
return { success: true };
} catch (error) {
set({ isLoading: false });
const msg = error.response?.data?.message || error.message;
return { success: false, error: msg };
}
},





// checkAuth: async () => {
// try {
// const token = await AsyncStorage.getItem("token");
// const userJson = await AsyncStorage.getItem("user");
// const user = userJson ? JSON.parse(userJson) : null;
// set({ token, user });
// } catch (err) {
// console.log("checkAuth error", err);
// set({ token: null, user: null });
// } finally {
// set({ isCheckingAuth: false });
// }
// },


logout: async () => {
await AsyncStorage.removeItem("token");
await AsyncStorage.removeItem("user");
set({ token: null, user: null });
},
}));