<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <div class="flex justify-center mb-6">
        <img src="@/assets/logo/neembly.jpg" alt="Logo" class="w-20 h-auto" />
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <input
            v-model="form.username"
            id="username"
            type="text"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500"
            placeholder="Username"
            required
          />
        </div>
        <div class="mb-4">
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
          :disabled="isLoading"
        >
          <div v-if="isLoading" class="flex items-center justify-center">
            <FwbSpinner size="5" class="mr-2" /> Loading...
          </div>
          <div v-else>Login</div>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// npm dependencies
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FwbSpinner } from "flowbite-vue";
import { useToast } from "vue-toast-notification";

// stores
import { useAuthStore } from "../../store/auth";

// lib
import Form from "../../lib/Form";

const authStore = useAuthStore();
const router = useRouter();
const $toast = useToast();

const isLoading = ref(false);

const form: any = ref(
  new Form({
    username: "mor_2314",
    password: "83r5^_",
  })
);

const handleLogin = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    await authStore.login(form.value.username, form.value.password);
    if (authStore.token) {
      $toast.success("Login successfully!", { position: "top-right" });
      router.push("/");
    } else {
      $toast.error("Invalid username or password", { position: "top-right" });
    }
  } catch (error) {
    $toast.error("Invalid username or password", { position: "top-right" });
  } finally {
    isLoading.value = false;
    form.value.username = null;
    form.value.password = null;
  }
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
