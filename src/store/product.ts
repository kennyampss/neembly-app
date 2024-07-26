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

  const addItem = async (newItem: any) => {
    if (isLoading.value) return;
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.post(
        "https://fakestoreapi.com/products",
        newItem
      );

      // Only saved to the state, but when refreshed, it returns to the original data.
      // Fake store returned success, but it will not be added to their database.
      const maxId = items.value.reduce(
        (max, item) => Math.max(max, item.id),
        0
      );
      const newProduct = {
        ...response.data,
        id: maxId + 1,
        checked: false,
      };

      // Add the new product to the state, display it first in the list.
      items.value.unshift(newProduct);
    } catch (err) {
      error.value = "Error adding data";
      console.error("Error adding data:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const updateItem = async (productId: number, updatedItem: any) => {
    if (isLoading.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.put(
        `https://fakestoreapi.com/products/${productId}`,
        updatedItem
      );
      // Update the item in the state
      items.value = items.value.map((item) =>
        item.id === productId ? response.data : item
      );
    } catch (err) {
      error.value = "Error updating data";
      console.error("Error updating data:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${itemId}`);
      // Remove the item from the state
      items.value = items.value.filter((item) => item.id !== itemId);
    } catch (err) {
      error.value = "Error deleting data";
    } finally {
      isLoading.value = false;
    }
  };

  // updates toggle checked in pinia state
  const toggleChecked = async (itemId: number, checked: boolean) => {
    const index = items.value.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      items.value[index].checked = checked;
    }
  };

  return {
    items,
    isLoading,
    error,
    toggleChecked,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  };
});
