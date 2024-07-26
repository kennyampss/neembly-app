<template>
  <div class="relative shadow-md sm:rounded-lg">
    <PerfectScrollbar>
      <div
        class="h-[400px]"
        :class="{ 'flex justify-center': result.length === 0 }"
      >
        <div v-if="isLoading">
          <div v-for="n in 15" :key="n">
            <TableSkeleton />
          </div>
        </div>
        <div v-else>
          <template v-if="result.length === 0">
            <Empty />
          </template>
          <template v-else>
            <fwb-table>
              <fwb-table-head>
                <slot name="header" />
              </fwb-table-head>
              <fwb-table-body>
                <!-- @vue-ignore -->
                <fwb-table-row
                  v-for="item in paginatedItems"
                  :key="item[identifierField]"
                >
                  <slot name="body" :row="item" />
                </fwb-table-row>
              </fwb-table-body>
            </fwb-table>
          </template>
        </div>
      </div>
    </PerfectScrollbar>

    <div v-if="isLoading" class="flex justify-center items-center py-4">
      <FwbSpinner size="5" />
    </div>
    <div
      class="flex justify-center items-center py-4"
      v-else-if="!isLoading && result.length !== 0"
    >
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
      <!-- @vue-ignore -->
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
import {
  FwbButton,
  FwbTable,
  FwbTableBody,
  FwbTableHead,
  FwbTableRow,
  FwbSpinner,
} from "flowbite-vue";

//stores
import { useProductStore } from "../../store/product";

//atomic components
import TableSkeleton from "../atoms/TableSkeleton.vue";

//relative components
import Empty from "../../components/Empty.vue";

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
  isLoading.value = false;
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

defineExpose({
  fetch,
});
</script>

<style scoped></style>
