import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("https://fakestoreapi.com/auth/login", {
        username: username,
        password: password,
      });
      const data = await response.data;
      if (data.token) {
        token.value = data.token;
        localStorage.setItem("authToken", data.token);
        console.log("Login successful:", data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    token.value = null;
    localStorage.removeItem("authToken");
  };

  return { token, login, logout };
});
