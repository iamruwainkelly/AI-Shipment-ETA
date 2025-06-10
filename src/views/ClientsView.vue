<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
        <p class="text-gray-600">Manage your client database</p>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Add Client
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Clients</p>
            <p class="text-2xl font-bold text-gray-900">{{ clientsStore.clientsCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <MapPin class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Cities Covered</p>
            <p class="text-2xl font-bold text-gray-900">{{ Object.keys(clientsStore.getClientsByCity).length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <Building class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active This Month</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeClients }}</p>
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
            placeholder="Search clients..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          v-model="filterCity"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Cities</option>
          <option v-for="city in Object.keys(clientsStore.getClientsByCity)" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                  <div class="text-sm text-gray-500">{{ client.company || 'Individual' }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ client.email }}</div>
                <div class="text-sm text-gray-500">{{ client.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ client.city }}</div>
                <div class="text-sm text-gray-500">{{ client.address }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(client.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editClient(client)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click="deleteClient(client.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditModal ? 'Edit Client' : 'Add New Client' }}
        </h3>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="clientForm.name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Company</label>
            <input
              v-model="clientForm.company"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="clientForm.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              v-model="clientForm.phone"
              type="tel"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              v-model="clientForm.address"
              required
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">City</label>
            <input
              v-model="clientForm.city"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              :disabled="clientsStore.loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ clientsStore.loading ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Users, MapPin, Building, Edit, Trash2 } from 'lucide-vue-next'
import { useClientsStore } from '@/stores/clients'
import type { Client } from '@/services/api-types'

const clientsStore = useClientsStore()

const searchQuery = ref('')
const filterCity = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingClient = ref<Client | null>(null)

const clientForm = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  city: ''
})

const activeClients = computed(() => {
  // This would typically be calculated based on recent shipments
  return Math.floor(clientsStore.clientsCount * 0.7)
})

const filteredClients = computed(() => {
  let filtered = clientsStore.clients

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(client =>
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.company?.toLowerCase().includes(query) ||
      client.city.toLowerCase().includes(query)
    )
  }

  if (filterCity.value) {
    filtered = filtered.filter(client => client.city === filterCity.value)
  }

  return filtered
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

function editClient(client: Client) {
  editingClient.value = client
  clientForm.value = {
    name: client.name,
    company: client.company || '',
    email: client.email,
    phone: client.phone,
    address: client.address,
    city: client.city
  }
  showEditModal.value = true
}

async function deleteClient(id: number) {
  if (confirm('Are you sure you want to delete this client?')) {
    try {
      await clientsStore.deleteClient(id)
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingClient.value = null
  clientForm.value = {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  }
}

async function submitForm() {
  try {
    if (showEditModal.value && editingClient.value) {
      await clientsStore.updateClient(editingClient.value.id, clientForm.value)
    } else {
      await clientsStore.createClient(clientForm.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save client:', error)
  }
}

onMounted(() => {
  clientsStore.fetchClients()
})
</script>
