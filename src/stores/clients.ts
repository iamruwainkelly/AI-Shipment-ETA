import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { clientsAPI, type Client } from '@/services/api-types'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const clientsCount = computed(() => clients.value.length)
  
  const getClientsByCity = computed(() => {
    const cityGroups: Record<string, Client[]> = {}
    clients.value.forEach(client => {
      if (!cityGroups[client.city]) {
        cityGroups[client.city] = []
      }
      cityGroups[client.city].push(client)
    })
    return cityGroups
  })

  async function fetchClients() {
    loading.value = true
    error.value = null
    try {
      const response = await clientsAPI.getAll()
      clients.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch clients'
    } finally {
      loading.value = false
    }
  }

  async function createClient(clientData: Omit<Client, 'id' | 'created_at'>) {
    loading.value = true
    error.value = null
    try {
      const response = await clientsAPI.create(clientData)
      clients.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create client'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateClient(id: number, clientData: Partial<Client>) {
    loading.value = true
    error.value = null
    try {
      const response = await clientsAPI.update(id, clientData)
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update client'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteClient(id: number) {
    loading.value = true
    error.value = null
    try {
      await clientsAPI.delete(id)
      clients.value = clients.value.filter(c => c.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete client'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadCSV(file: File) {
    loading.value = true
    error.value = null
    try {
      const response = await clientsAPI.uploadCSV(file)
      await fetchClients() // Refresh the list
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to upload CSV'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    clients,
    loading,
    error,
    clientsCount,
    getClientsByCity,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    uploadCSV
  }
})
