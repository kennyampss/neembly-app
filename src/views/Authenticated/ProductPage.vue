<template>
  <div class="w-[80%] mx-auto py-4 bg-[#f1f1f1]">
    <div class="flex mb-4 items-center">
      <!-- fake logo -->
      <img
        src="@/assets/logo/fakestoreapi.png"
        alt="Logo"
        class="w-10 h-auto"
      />
      <h6 class="text-gray-700 font-semibold mb-0 mx-2">Products</h6>
      <div class="ml-auto">
        <fwb-button size="xs" class="rounded"> Add New Product</fwb-button>
      </div>
    </div>

    <Table :ajaxUrl="'https://fakestoreapi.com/products'" identifierField="id">
      <template v-slot:header>
        <tr class="bg-gray-50 text-center th:border-r">
          <th
            scope="col"
            class="px-4 py-2 text-gray-700 text-center border-r font-bold text-base"
          >
            <input
              type="checkbox"
              v-model="selectAll"
              @change="toggleAll"
              class="form-checkbox"
            />
          </th>
          <th
            scope="col"
            class="px-4 py-2 text-gray-700 !text-[12px] text-center border-r font-bold text-base"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-4 py-2 text-gray-700 !text-[12px] text-center border-r font-bold text-base"
          >
            Title
          </th>
          <th
            scope="col"
            class="px-4 py-2 text-gray-700 !text-[12px] text-center border-r font-bold text-base"
          >
            Price
          </th>
          <th
            class="px-4 py-2 text-gray-700 !text-[12px] text-center border-r font-bold text-base"
          >
            Category
          </th>
          <th
            scope="col"
            class="px-4 py-2 text-gray-700 !text-[12px] text-center border-r font-bold text-base"
          >
            Description
          </th>
          <th
            scope="col"
            class="px-4 py-2 text-gray-700 !text-[12px] text-center border-r font-bold text-base"
          >
            Image
          </th>
          <th
            scope="col"
            class="px-4 py-2 text-gray-700 !text-[12px] text-center border-r font-bold text-base"
          >
            Actions
          </th>
        </tr>
      </template>
      <template v-slot:body="item">
        <td class="border-r border-b text-base py-2 px-1 text-center">
          <input
            type="checkbox"
            v-model="item.row.checked"
            @change="updateChecked(item.row)"
            class="form-checkbox"
          />
        </td>
        <td
          class="border-r border-b text-base text-gray-500 p-4 !text-[11px] whitespace-normal leading-normal text-ellipsis w-[20px]"
        >
          {{ item.row.id }}
        </td>
        <td
          class="border-r border-b text-base text-gray-600 p-4 !text-[12px] font-semibold whitespace-normal leading-normal"
        >
          {{ item.row.title }}
        </td>
        <td
          class="border-r border-b text-base text-gray-600 p-4 text-[12px] font-semibold whitespace-normal leading-normal"
        >
          {{ item.row.price }}
        </td>
        <td
          class="border-r border-b text-base text-gray-500 p-4 !text-[11px] whitespace-normal leading-normal"
        >
          {{ item.row.category }}
        </td>
        <td
          class="border-r border-b text-base text-gray-500 p-4 !text-[11px] whitespace-normal leading-normal w-[300px]"
        >
          <span v-if="!showMore[item.row.id]">{{
            truncatedDescription(item.row.description)
          }}</span>
          <span v-else>{{ item.row.description }}</span>
          <button
            class="text-blue-500 ml-2 focus:outline-none"
            @click="toggleDescription(item.row.id)"
          >
            {{ showMore[item.row.id] ? "See Less" : "See More" }}
          </button>
        </td>
        <td class="border-r border-b text-base py-2 px-1">
          <div class="flex justify-center">
            <img :src="item.row.image" class="w-[40px]" />
          </div>
        </td>
        <td class="border-r border-b text-base py-2 px-1 text-center">
          <button
            @click="editItem(item.row.row)"
            class="text-blue-500 hover:text-blue-700"
          >
            <!-- FontAwesome Pencil Icon -->
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button
            @click="openDeleteConfirmation(item.row.id)"
            class="text-red-500 hover:text-red-700 ml-2"
          >
            <!-- FontAwesome Trash Icon -->
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
// npm dependencies
import { ref, onMounted, watch } from "vue";
import { FwbButton } from "flowbite-vue";

//stores
import { useProductStore } from "@/store/product.ts";

// atomic components
import Table from "@/atomic-components/molecules/Table.vue";

const showMore = ref<{ [key: string]: boolean }>({});
const productStore = useProductStore();
const newProduct = ref({ name: "", description: "" });
const currentProduct = ref<any>(null);
const productToDelete = ref<number | null>(null);
const selectAll = ref(false);

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirmation = ref(false);

const toggleDescription = (id: string) => {
  showMore.value[id] = !showMore.value[id];
};

const truncatedDescription = (description: string, wordLimit = 10) => {
  const words = description.split(" ");
  if (words.length <= wordLimit) return description;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const toggleAll = () => {
  const checked = selectAll.value;
  productStore.items.forEach((item) => {
    item.checked = checked;
    productStore.toggleChecked(item.id, checked);
  });
};

const editItem = (item: any) => {
  currentProduct.value = { ...item };
  showEditModal.value = true;
};

const updateChecked = (item: any) => {
  productStore.toggleChecked(item.id, item.checked);
};

const confirmDelete = () => {
  if (productToDelete.value !== null) {
    productStore.deleteItem(productToDelete.value);
    $toast.success("Product deleted successfully!", { position: "top-right" });
    productToDelete.value = null;
    showDeleteConfirmation.value = false;
  }
};

watch(
  () => productStore.items.some((item) => item.checked),
  (hasChecked) => {
    selectAll.value = productStore.items.every((item) => item.checked);
  }
);
</script>
