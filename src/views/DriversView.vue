<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Drivers</h1>
        <p class="text-gray-600">Manage your driver network</p>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Add Driver
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Drivers</p>
            <p class="text-2xl font-bold text-gray-900">{{ driversStore.driversCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Available</p>
            <p class="text-2xl font-bold text-gray-900">{{ availableDrivers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">On Duty</p>
            <p class="text-2xl font-bold text-gray-900">{{ onDutyDrivers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <DollarSign class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg Rate</p>
            <p class="text-2xl font-bold text-gray-900">${{ averageRate }}/km</p>
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
            placeholder="Search drivers..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="on_duty">On Duty</option>
          <option value="off_duty">Off Duty</option>
        </select>
        <select
          v-model="filterLocation"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>
    </div>

    <!-- Drivers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="driver in filteredDrivers"
        :key="driver.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User class="w-6 h-6 text-gray-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ driver.name }}</h3>
                <p class="text-sm text-gray-600">{{ driver.email }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editDriver(driver)"
                class="text-blue-600 hover:text-blue-900"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button
                @click="deleteDriver(driver.id)"
                class="text-red-600 hover:text-red-900"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Phone:</span>
              <span class="font-medium">{{ driver.phone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">License:</span>
              <span class="font-medium">{{ driver.license_number }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Rate:</span>
              <span class="font-medium">${{ driver.rate_per_km }}/km</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Location:</span>
              <span class="font-medium">{{ driver.current_location }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Status:</span>
              <span
                :class="getStatusColor(driver.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ formatStatus(driver.status) }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <div class="flex items-center text-sm text-gray-600">
                <Star class="w-4 h-4 text-yellow-400 mr-1" />
                <span>{{ driver.rating || 'N/A' }}</span>
              </div>
              <div class="text-sm text-gray-600">
                {{ driver.total_trips || 0 }} trips
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredDrivers.length === 0" class="text-center py-12">
      <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
      <p class="text-gray-600">Get started by adding your first driver.</p>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditModal ? 'Edit Driver' : 'Add New Driver' }}
        </h3>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="driverForm.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="driverForm.email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input
                v-model="driverForm.phone"
                type="tel"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">License Number</label>
              <input
                v-model="driverForm.license_number"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Rate per KM ($)</label>
              <input
                v-model.number="driverForm.rate_per_km"
                type="number"
                step="0.01"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                v-model="driverForm.status"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="on_duty">On Duty</option>
                <option value="off_duty">Off Duty</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Location</label>
            <input
              v-model="driverForm.current_location"
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
              :disabled="driversStore.loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ driversStore.loading ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Users, CheckCircle, Clock, DollarSign, User, Star, Edit, Trash2 } from 'lucide-vue-next'
import { useDriversStore } from '@/stores/drivers'
import type { Driver } from '@/services/api-types'

const driversStore = useDriversStore()

const searchQuery = ref('')
const filterStatus = ref('')
const filterLocation = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingDriver = ref<Driver | null>(null)

const driverForm = ref({
  name: '',
  email: '',
  phone: '',
  license_number: '',
  rate_per_km: 0,
  status: 'available' as 'available' | 'on_duty' | 'off_duty',
  current_location: ''
})

const locations = computed(() => {
  const locs = new Set(driversStore.drivers.map(d => d.current_location))
  return Array.from(locs).sort()
})

const availableDrivers = computed(() => {
  return driversStore.drivers.filter(d => d.status === 'available').length
})

const onDutyDrivers = computed(() => {
  return driversStore.drivers.filter(d => d.status === 'on_duty').length
})

const averageRate = computed(() => {
  if (driversStore.drivers.length === 0) return 0
  const total = driversStore.drivers.reduce((sum, d) => sum + d.rate_per_km, 0)
  return Math.round((total / driversStore.drivers.length) * 100) / 100
})

const filteredDrivers = computed(() => {
  let filtered = driversStore.drivers

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(driver =>
      driver.name.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.phone.includes(query) ||
      driver.license_number.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(driver => driver.status === filterStatus.value)
  }

  if (filterLocation.value) {
    filtered = filtered.filter(driver => driver.current_location === filterLocation.value)
  }

  return filtered
})

function getStatusColor(status: string) {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'on_duty':
      return 'bg-yellow-100 text-yellow-800'
    case 'off_duty':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function editDriver(driver: Driver) {
  editingDriver.value = driver
  driverForm.value = {
    name: driver.name,
    email: driver.email,
    phone: driver.phone,
    license_number: driver.license_number,
    rate_per_km: driver.rate_per_km,
    status: driver.status,
    current_location: driver.current_location
  }
  showEditModal.value = true
}

async function deleteDriver(id: number) {
  if (confirm('Are you sure you want to delete this driver?')) {
    try {
      await driversStore.deleteDriver(id)
    } catch (error) {
      console.error('Failed to delete driver:', error)
    }
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingDriver.value = null
  driverForm.value = {
    name: '',
    email: '',
    phone: '',
    license_number: '',
    rate_per_km: 0,
    status: 'available',
    current_location: ''
  }
}

async function submitForm() {
  try {
    if (showEditModal.value && editingDriver.value) {
      await driversStore.updateDriver(editingDriver.value.id, driverForm.value)
    } else {
      await driversStore.createDriver(driverForm.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save driver:', error)
  }
}

onMounted(() => {
  driversStore.fetchDrivers()
})
</script>
