import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

interface Item {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export const useProductStore = defineStore("product", () => {
  const items = ref<Array<Item>>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchItems = async (url: string) => {
    if (isLoading.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(url);
      items.value = response.data;

      // Optionally, sort items by id in descending order
      items.value.sort((a, b) => b.id - a.id);
    } catch (err) {
      error.value = "Error fetching data";
      console.error("Fetch error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const toggleChecked = async (itemId: number, checked: boolean) => {
    const index = items.value.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      items.value[index].checked = checked;
      // await localForage.setItem(CACHE_KEY, this.items);
    }
  };

  return { fetchItems, items, isLoading, error, toggleChecked };
});
