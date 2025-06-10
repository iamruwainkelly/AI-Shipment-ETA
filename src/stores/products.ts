import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsAPI, type Product } from '@/services/api-types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const productsCount = computed(() => products.value.length)
  
  const getProductsByCategory = computed(() => {
    const categoryGroups: Record<string, Product[]> = {}
    products.value.forEach(product => {
      if (!categoryGroups[product.category]) {
        categoryGroups[product.category] = []
      }
      categoryGroups[product.category].push(product)
    })
    return categoryGroups
  })

  const getTotalValue = computed(() => {
    return products.value.reduce((sum, product) => sum + product.value, 0)
  })

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const response = await productsAPI.getAll()
      products.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  async function createProduct(productData: Omit<Product, 'id' | 'created_at'>) {
    loading.value = true
    error.value = null
    try {
      const response = await productsAPI.create(productData)
      products.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create product'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id: number, productData: Partial<Product>) {
    loading.value = true
    error.value = null
    try {
      const response = await productsAPI.update(id, productData)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update product'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: number) {
    loading.value = true
    error.value = null
    try {
      await productsAPI.delete(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadCSV(file: File) {
    loading.value = true
    error.value = null
    try {
      const response = await productsAPI.uploadCSV(file)
      await fetchProducts()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to upload CSV'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    productsCount,
    getProductsByCategory,
    getTotalValue,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadCSV
  }
})
