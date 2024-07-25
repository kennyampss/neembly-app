<template>
  <div class="relative shadow-md sm:rounded-lg">
    <PerfectScrollbar>
      <div class="h-[450px]">
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <slot name="header" />
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedItems"
              :key="item[identifierField]"
              class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <slot name="body" :row="item" />
            </tr>
          </tbody>
        </table>
      </div>
    </PerfectScrollbar>

    <div class="flex justify-center items-center py-4">
      <fwb-button
        size="xs"
        class="rounded hover:bg-gray-300 mr-1"
        color="light"
        outlined
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        <span class="text-xs">&larr;</span></fwb-button
      >

      <fwb-button
        v-for="page in totalPages"
        :key="page"
        size="xs"
        class="rounded mx-1"
        @click="gotoPage(page)"
        :class="{
          'bg-blue-700 text-white': currentPage === page,
          'text-gray-700 bg-gray-200 hover:bg-gray-300': currentPage !== page,
        }"
      >
        {{ page }}
      </fwb-button>

      <fwb-button
        size="xs"
        class="rounded hover:bg-gray-300 ml-1"
        color="light"
        outlined
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        <span class="text-xs">&rarr;</span></fwb-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
//npm dependencies
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { FwbButton } from "flowbite-vue";

//stores
import { useProductStore } from "@/store/product.ts";

const props = defineProps({
  ajaxUrl: {
    type: String,
    required: true,
  },
  identifierField: {
    type: String,
    default: "id",
  },
});

const productStore = useProductStore();
const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const result = computed(() => productStore.items);

const totalPages = computed(() => {
  return Math.ceil(result.value.length / itemsPerPage.value);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return result.value.slice(start, end);
});

const fetch = async () => {
  isLoading.value = true;
  await productStore.fetchItems(props.ajaxUrl);
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const gotoPage = (page: number) => {
  currentPage.value = page;
};

onMounted(() => {
  fetch();
});
</script>

<style scoped></style>
