<template>
  <header class="bg-white border-solid border-b">
    <div class="text-white py-2 flex items-center justify-end w-[80%] mx-auto">
      <p class="text-[12px] font-semibold text-gray-700 mr-3">
        {{ currentUser.name }}
      </p>
      <fwb-tooltip theme="light">
        <template #trigger>
          <fwb-button
            size="xs"
            color="light"
            class="rounded-md"
            outlined
            @click="logout"
          >
            <i class="fas fa-sign-out-alt"></i>
          </fwb-button>
        </template>
        <template #content> <span class="text-[12px]">Logout</span> </template>
      </fwb-tooltip>
    </div>
  </header>

  <div class="w-[80%] mx-auto py-4">
    <div class="flex mb-4 items-center">
      <!-- fake logo -->
      <img
        src="@/assets/logo/fakestoreapi.png"
        alt="Logo"
        class="w-10 h-auto"
      />
      <h6 class="text-gray-700 font-semibold mb-0 mx-2">Products</h6>
      <div class="ml-auto flex items-center">
        <fwb-button size="xs" class="rounded mr-2" @click="add">
          <i class="fas fa-add mr-1"></i> Add Product</fwb-button
        >
        <fwb-button
          size="xs"
          :class="{
            'bg-red-500 hover:bg-red-700': hasCheckedMoreThanOne,
            'bg-gray-300 !text-gray-700 !hover:bg-gray-300 ':
              !hasCheckedMoreThanOne,
          }"
          :disabled="!hasCheckedMoreThanOne"
          @click="openMultipleDeleteConfirmation"
          class="flex items-center rounded text-white"
        >
          <i class="fas fa-trash mr-1"></i> Multiple Delete
        </fwb-button>
      </div>
    </div>

    <Table
      :ajaxUrl="'https://fakestoreapi.com/products'"
      identifierField="id"
      ref="table"
    >
      <template v-slot:header>
        <!-- <fwb-table-head> -->
        <fwb-table-cell>
          <input
            type="checkbox"
            v-model="selectAll"
            @change="toggleAll"
            class="form-checkbox cursor-pointer"
          />
        </fwb-table-cell>
        <fwb-table-cell> ID </fwb-table-cell>
        <fwb-table-cell> Title </fwb-table-cell>
        <fwb-table-cell> Price </fwb-table-cell>
        <fwb-table-cell> Category </fwb-table-cell>
        <fwb-table-cell> Description </fwb-table-cell>
        <fwb-table-cell> Image </fwb-table-cell>
        <fwb-table-cell> Actions </fwb-table-cell>
        <!-- </fwb-table-head> -->
      </template>

      <template v-slot:body="item">
        <fwb-table-cell>
          <input
            type="checkbox"
            v-model="item.row.checked"
            @change="updateChecked(item.row)"
            class="form-checkbox cursor-pointer"
          />
        </fwb-table-cell>
        <fwb-table-cell>
          {{ item.row.id }}
        </fwb-table-cell>
        <fwb-table-cell class="text-[12px] font-semibold">
          {{ item.row.title }}
        </fwb-table-cell>
        <fwb-table-cell class="text-[12px] font-semibold">
          {{ item.row.price }}
        </fwb-table-cell>
        <fwb-table-cell class="text-[12px]">
          {{ item.row.category }}
        </fwb-table-cell>
        <fwb-table-cell class="text-[12px] w-[300px]">
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
        </fwb-table-cell>
        <fwb-table-cell>
          <div class="flex justify-center">
            <img :src="item.row.image" class="w-[40px]" />
          </div>
        </fwb-table-cell>
        <fwb-table-cell>
          <button
            class="text-blue-500 hover:text-blue-700"
            @click="openUpdateModal(item.row)"
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
        </fwb-table-cell>
      </template>
    </Table>
  </div>

  <CreateUpdateModal
    ref="createUpdateModal"
    :actionType="modalActionType"
    :item="selectedItem"
    @created="handleCreated"
    @updated="handleUpdated"
  />

  <Modal ref="deleteModal">
    <div class="w-[500px] bg-white rounded">
      <div class="flex items-center border-b px-6 py-2">
        <p class="font-bold text-gray-900">Confirm Deletion</p>
      </div>

      <div class="mb-4 text-gray-600 px-6 pb-2 pt-4">
        <p v-if="multipleDelete">
          Are you sure you want to delete {{ itemsToDeleteCount }} Product(s)?
        </p>
        <p v-else>Are you sure you want to delete this Product?</p>
      </div>

      <div class="flex justify-end items-center p-2">
        <FwbButton
          @click="hideConfirm"
          size="sm"
          class="rounded mr-2"
          color="light"
        >
          Cancel
        </FwbButton>
        <FwbButton
          @click="confirmDelete"
          size="sm"
          class="rounded mr-2"
          color="red"
        >
          <div class="flex">
            <FwbSpinner size="5" v-if="isLoadingDelete" class="mr-2" />
            Delete
          </div>
        </FwbButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
// npm dependencies
import { ref, computed, watch } from "vue";
import { FwbSpinner, FwbButton, FwbTableCell, FwbTooltip } from "flowbite-vue";
import { useToast } from "vue-toast-notification";

//stores
import { useProductStore } from "../../store/product";
import { useAuthStore } from "../../store/auth";

// atomic components
import Table from "../../atomic-components/molecules/Table.vue";
import Modal from "../../atomic-components/molecules/Modal.vue";
import CreateUpdateModal from "../../atomic-components/organisms/CreateUpdateModal.vue";

const currentUser = ref({ name: "Kenny Amper" });
const createUpdateModal = ref<InstanceType<typeof CreateUpdateModal>>();
const deleteModal = ref<InstanceType<typeof Modal>>();
const table = ref<InstanceType<typeof Table>>();
const $toast = useToast();
const showMore = ref<{ [key: string]: boolean }>({});
const productStore = useProductStore();
const authStore = useAuthStore();
const productToDelete = ref<number | null>(null);
const selectAll = ref(false);
const modalActionType = ref<"create" | "delete">("create");
const selectedItem = ref<any>(null);
const isLoadingDelete = ref(false);

const multipleDelete = ref(false);
const itemsToDeleteCount = ref(0);

const hasCheckedMoreThanOne = computed(() => {
  return productStore.items.filter((item) => item.checked).length > 1;
});

const openMultipleDeleteConfirmation = () => {
  multipleDelete.value = true;
  itemsToDeleteCount.value = productStore.items.filter(
    (item) => item.checked
  ).length;
  deleteModal.value.show();
};

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
  productStore.items.forEach((item: any) => {
    item.checked = checked;
    productStore.toggleChecked(item.id, checked);
  });
};

const updateChecked = (item: any) => {
  productStore.toggleChecked(item.id, item.checked);
};

function openDeleteConfirmation(itemId: number) {
  productToDelete.value = itemId;
  deleteModal.value.show();
}

function handleCreated() {
  // this code watch the table in every new item
  // table.value.fetch();
}

function handleUpdated() {
  // this code watch the table in every new item
  // table.value.fetch();
}

function add() {
  modalActionType.value = "create";
  // @ts-ignore
  createUpdateModal.value.show();
}

function openUpdateModal(item: any) {
  // @ts-ignore
  modalActionType.value = "update";
  selectedItem.value = item;
  createUpdateModal.value?.show();
}

async function confirmDelete() {
  isLoadingDelete.value = true;
  try {
    if (multipleDelete.value) {
      const itemsToDelete = productStore.items
        .filter((item) => item.checked)
        .map((item) => item.id);
      await Promise.all(itemsToDelete.map((id) => productStore.deleteItem(id)));
      $toast.success("Products deleted successfully!", {
        position: "top-right",
      });
    } else {
      await productStore.deleteItem(productToDelete.value);
      $toast.success("Product deleted successfully!", {
        position: "top-right",
      });
    }
    deleteModal.value.hide();
  } catch (error) {
    $toast.error("Error deleting product(s). Please try again.", {
      position: "top-right",
    });
  } finally {
    isLoadingDelete.value = false;
    deleteModal.value.hide();
    multipleDelete.value = false;
  }
}

function hideConfirm() {
  deleteModal.value.hide();
}

function logout() {
  authStore.logout();
}

watch(
  () => productStore.items.some((item: any) => item.checked),
  (hasChecked) => {
    selectAll.value = productStore.items.every((item) => item.checked);
  }
);
</script>
