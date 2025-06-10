<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p class="text-gray-600">Manage your product catalog</p>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Add Product
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <Package class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Products</p>
            <p class="text-2xl font-bold text-gray-900">{{ productsStore.productsCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <DollarSign class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg Value</p>
            <p class="text-2xl font-bold text-gray-900">${{ averageValue }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <Weight class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg Weight</p>
            <p class="text-2xl font-bold text-gray-900">{{ averageWeight }}kg</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100">
            <AlertTriangle class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Fragile Items</p>
            <p class="text-2xl font-bold text-gray-900">{{ fragileProducts }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          v-model="filterCategory"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <select
          v-model="filterFragile"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Items</option>
          <option value="true">Fragile Only</option>
          <option value="false">Non-Fragile Only</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-600">{{ product.category }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editProduct(product)"
                class="text-blue-600 hover:text-blue-900"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="text-red-600 hover:text-red-900"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Value:</span>
              <span class="font-medium">${{ product.value.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Weight:</span>
              <span class="font-medium">{{ product.weight }}kg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Dimensions:</span>
              <span class="font-medium">{{ product.length }}×{{ product.width }}×{{ product.height }}cm</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Fragile:</span>
              <span
                :class="product.is_fragile ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ product.is_fragile ? 'Yes' : 'No' }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600">{{ product.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <Package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-600">Get started by adding your first product.</p>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditModal ? 'Edit Product' : 'Add New Product' }}
        </h3>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="productForm.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <input
                v-model="productForm.category"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="productForm.description"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Value ($)</label>
              <input
                v-model.number="productForm.value"
                type="number"
                step="0.01"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                v-model.number="productForm.weight"
                type="number"
                step="0.1"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Length (cm)</label>
              <input
                v-model.number="productForm.length"
                type="number"
                step="0.1"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Width (cm)</label>
              <input
                v-model.number="productForm.width"
                type="number"
                step="0.1"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                v-model.number="productForm.height"
                type="number"
                step="0.1"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="productForm.is_fragile"
              type="checkbox"
              id="fragile"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="fragile" class="ml-2 block text-sm text-gray-900">
              This product is fragile
            </label>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="productsStore.loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ productsStore.loading ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Package, DollarSign, Weight, AlertTriangle, Edit, Trash2 } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/services/api-types'

const productsStore = useProductsStore()

const searchQuery = ref('')
const filterCategory = ref('')
const filterFragile = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref<Product | null>(null)

const productForm = ref({
  name: '',
  category: '',
  description: '',
  value: 0,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  is_fragile: false
})

const categories = computed(() => {
  const cats = new Set(productsStore.products.map(p => p.category))
  return Array.from(cats).sort()
})

const averageValue = computed(() => {
  if (productsStore.products.length === 0) return 0
  const total = productsStore.products.reduce((sum, p) => sum + p.value, 0)
  return Math.round(total / productsStore.products.length)
})

const averageWeight = computed(() => {
  if (productsStore.products.length === 0) return 0
  const total = productsStore.products.reduce((sum, p) => sum + p.weight, 0)
  return Math.round((total / productsStore.products.length) * 10) / 10
})

const fragileProducts = computed(() => {
  return productsStore.products.filter(p => p.is_fragile).length
})

const filteredProducts = computed(() => {
  let filtered = productsStore.products

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }

  if (filterCategory.value) {
    filtered = filtered.filter(product => product.category === filterCategory.value)
  }

  if (filterFragile.value) {
    const isFragile = filterFragile.value === 'true'
    filtered = filtered.filter(product => product.is_fragile === isFragile)
  }

  return filtered
})

function editProduct(product: Product) {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    category: product.category,
    description: product.description || '',
    value: product.value,
    weight: product.weight,
    length: product.length,
    width: product.width,
    height: product.height,
    is_fragile: product.is_fragile
  }
  showEditModal.value = true
}

async function deleteProduct(id: number) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productsStore.deleteProduct(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    category: '',
    description: '',
    value: 0,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    is_fragile: false
  }
}

async function submitForm() {
  try {
    if (showEditModal.value && editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, productForm.value)
    } else {
      await productsStore.createProduct(productForm.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save product:', error)
  }
}

onMounted(() => {
  productsStore.fetchProducts()
})
</script>
