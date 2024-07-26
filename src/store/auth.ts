import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("authToken"));
  const router = useRouter();

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

    router.push("/login");
  };

  return { token, login, logout };
});
