<template>
  <Modal ref="modal">
    <div class="w-[500px] bg-white rounded">
      <div class="flex items-center border-b px-4 py-2">
        <p class="font-bold text-gray-900">{{ formTitle }}</p>
        <div class="ml-auto">
          <div class="text-gray-900 cursor-pointer" @click="hide">
            <i class="fas fa-close"></i>
          </div>
        </div>
      </div>
      <div>
        <div class="p-4">
          <div class="mb-3">
            <fwb-input
              v-model="addProductForm.title"
              label="Title"
              size="sm"
              required
              :class="{ 'border-red-500': addProductForm.errors.title }"
            />
            <p v-if="addProductForm.errors.title" class="text-red-500 text-sm">
              {{ addProductForm.errors.title }}
            </p>
          </div>
          <div class="mb-3">
            <fwb-input
              v-model="addProductForm.price"
              label="Price"
              size="sm"
              type="number"
              required
              :class="{ 'border-red-500': addProductForm.errors.price }"
            />
            <p v-if="addProductForm.errors.price" class="text-red-500 text-sm">
              {{ addProductForm.errors.price }}
            </p>
          </div>
          <div class="mb-3">
            <fwb-select
              v-model="addProductForm.category"
              :options="categories"
              label="Select a category"
              size="sm"
              required
              :class="{ 'border-red-500': addProductForm.errors.category }"
            />
            <p
              v-if="addProductForm.errors.category"
              class="text-red-500 text-sm"
            >
              {{ addProductForm.errors.category }}
            </p>
          </div>
          <div class="mb-3">
            <fwb-textarea
              v-model="addProductForm.description"
              :rows="4"
              label="Product description"
              class="text-gray-900"
              placeholder="Write your product description..."
              required
              :class="{ 'border-red-500': addProductForm.errors.description }"
            />
            <p
              v-if="addProductForm.errors.description"
              class="text-red-500 text-sm"
            >
              {{ addProductForm.errors.description }}
            </p>
          </div>
          <div class="mb-3">
            <fwb-file-input
              v-model="addProductForm.file"
              label="Upload file"
              class="text-gray-500"
              size="sm"
              required
              :class="{ 'border-red-500': addProductForm.errors.file }"
            />
            <p v-if="addProductForm.errors.file" class="text-red-500 text-sm">
              {{ addProductForm.errors.file }}
            </p>
          </div>
        </div>
      </div>
      <div class="border-t flex p-3">
        <div class="ml-auto flex items-center">
          <FwbButton
            @click="hide"
            size="sm"
            class="rounded mr-2 text-gray-600"
            color="light"
          >
            Cancel
          </FwbButton>
          <FwbButton
            @click="submit"
            :disabled="addProductForm.busy"
            size="sm"
            class="rounded"
          >
            <div class="flex">
              <FwbSpinner size="5" v-if="addProductForm.busy" class="mr-2" />
              {{ actionText }}
            </div>
          </FwbButton>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
// npm dependencies
import { ref, computed, watch } from "vue";
import {
  FwbSpinner,
  FwbButton,
  FwbInput,
  FwbSelect,
  FwbTextarea,
  FwbFileInput,
} from "flowbite-vue";
import { useToast } from "vue-toast-notification";

// stores
import { useProductStore } from "../../store/product";

// lib
import Form from "../../lib/Form";

// common components
import Modal from "../molecules/Modal.vue";

const props = defineProps<{
  actionType: "create" | "update";
  item?: any; // item to update
}>();

const addProductForm: any = ref(
  new Form({
    title: null,
    price: null,
    category: null,
    description: null,
    image: null,
  })
);

const emits = defineEmits(["created", "updated"]);
const productStore = useProductStore();
const $toast = useToast();
const modal = ref<InstanceType<typeof Modal>>();

const categories = [
  { value: "women's clothing", name: `Women's Clothing` },
  { value: "electronics", name: "Electronics" },
  { value: "food", name: "Food" },
];

const formTitle = computed(() =>
  props.actionType === "create" ? "Create Product" : "Update Product"
);
const actionText = computed(() =>
  props.actionType === "create" ? "Save" : "Update"
);

const initializeForm = () => {
  if (props.actionType === "update" && props.item) {
    addProductForm.value.fill(props.item); // Fill form with item data
  } else {
    addProductForm.value.reset(); // reset if created
  }
};

// methods
const validateForm = () => {
  const errors: any = {};

  if (!addProductForm.value.title) {
    errors.title = "Title is required";
  }
  if (!addProductForm.value.price) {
    errors.price = "Price is required";
  }
  if (!addProductForm.value.category) {
    errors.category = "Category is required";
  }
  if (!addProductForm.value.description) {
    errors.description = "Description is required";
  }
  if (!addProductForm.value.file) {
    errors.file = "File is required";
  }

  addProductForm.value.errors = errors;

  return Object.keys(errors).length === 0;
};

const submit = async () => {
  if (!validateForm()) {
    return;
  }
  addProductForm.value.busy = true;
  try {
    if (props.actionType === "create") {
      await productStore.addItem({
        ...addProductForm.value,
        id: Date.now(),
        checked: false,
      });
      emits("created");
      $toast.success("Product created successfully!", {
        position: "top-right",
      });
    } else {
      await productStore.updateItem(props.item.id, addProductForm.value);
      emits("updated");
      $toast.success("Product updated successfully!", {
        position: "top-right",
      });
    }
    hide();
  } catch (error) {
    $toast.error(
      `Error ${
        props.actionType === "create" ? "creating" : "updating"
      } product. Please try again.`,
      {
        position: "top-right",
      }
    );
  } finally {
    addProductForm.value.busy = false;
  }
};

function show() {
  initializeForm();
  modal.value?.show();
}

function hide() {
  modal.value?.hide();
}

watch(() => props.item, initializeForm, { immediate: true });

defineExpose({
  show,
  hide,
});
</script>
