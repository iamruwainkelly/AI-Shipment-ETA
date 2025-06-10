<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Page header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p class="mt-2 text-sm text-gray-700">
          Import your clients, products, drivers, and transporters from CSV files
        </p>
      </div>
    </div>

    <!-- Upload cards grid -->
    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Clients Upload -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center mb-4">
            <Users class="h-6 w-6 text-blue-500 mr-2" />
            <h3 class="text-lg font-medium text-gray-900">Clients</h3>
          </div>
          
          <div
            @drop="handleDrop($event, 'clients')"
            @dragover.prevent
            @dragenter.prevent
            class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
            :class="{ 'border-blue-400 bg-blue-50': dragOverType === 'clients' }"
          >
            <div class="space-y-1 text-center">
              <Upload class="mx-auto h-12 w-12 text-gray-400" />
              <div class="flex text-sm text-gray-600">
                <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload CSV file</span>
                  <input
                    type="file"
                    accept=".csv"
                    class="sr-only"
                    @change="handleFileSelect($event, 'clients')"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">CSV up to 10MB</p>
            </div>
          </div>

          <div class="mt-4 text-xs text-gray-500">
            <p class="font-medium">Required columns:</p>
            <p>name, email, phone, address, city, country</p>
          </div>
          
          <div v-if="uploadStatus.clients" class="mt-3">
            <div class="flex items-center text-sm">
              <CheckCircle v-if="uploadStatus.clients.success" class="h-4 w-4 text-green-500 mr-1" />
              <AlertCircle v-else class="h-4 w-4 text-red-500 mr-1" />
              <span :class="uploadStatus.clients.success ? 'text-green-700' : 'text-red-700'">
                {{ uploadStatus.clients.message }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Upload -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center mb-4">
            <Package class="h-6 w-6 text-green-500 mr-2" />
            <h3 class="text-lg font-medium text-gray-900">Products</h3>
          </div>
          
          <div
            @drop="handleDrop($event, 'products')"
            @dragover.prevent
            @dragenter.prevent
            class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
            :class="{ 'border-green-400 bg-green-50': dragOverType === 'products' }"
          >
            <div class="space-y-1 text-center">
              <Upload class="mx-auto h-12 w-12 text-gray-400" />
              <div class="flex text-sm text-gray-600">
                <label class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                  <span>Upload CSV file</span>
                  <input
                    type="file"
                    accept=".csv"
                    class="sr-only"
                    @change="handleFileSelect($event, 'products')"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">CSV up to 10MB</p>
            </div>
          </div>

          <div class="mt-4 text-xs text-gray-500">
            <p class="font-medium">Required columns:</p>
            <p>name, category, weight, dimensions, value</p>
          </div>
          
          <div v-if="uploadStatus.products" class="mt-3">
            <div class="flex items-center text-sm">
              <CheckCircle v-if="uploadStatus.products.success" class="h-4 w-4 text-green-500 mr-1" />
              <AlertCircle v-else class="h-4 w-4 text-red-500 mr-1" />
              <span :class="uploadStatus.products.success ? 'text-green-700' : 'text-red-700'">
                {{ uploadStatus.products.message }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Drivers Upload -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center mb-4">
            <Truck class="h-6 w-6 text-purple-500 mr-2" />
            <h3 class="text-lg font-medium text-gray-900">Drivers</h3>
          </div>
          
          <div
            @drop="handleDrop($event, 'drivers')"
            @dragover.prevent
            @dragenter.prevent
            class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
            :class="{ 'border-purple-400 bg-purple-50': dragOverType === 'drivers' }"
          >
            <div class="space-y-1 text-center">
              <Upload class="mx-auto h-12 w-12 text-gray-400" />
              <div class="flex text-sm text-gray-600">
                <label class="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                  <span>Upload CSV file</span>
                  <input
                    type="file"
                    accept=".csv"
                    class="sr-only"
                    @change="handleFileSelect($event, 'drivers')"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">CSV up to 10MB</p>
            </div>
          </div>

          <div class="mt-4 text-xs text-gray-500">
            <p class="font-medium">Required columns:</p>
            <p>name, license_number, phone, email, vehicle_type, capacity, current_location, rating</p>
          </div>
          
          <div v-if="uploadStatus.drivers" class="mt-3">
            <div class="flex items-center text-sm">
              <CheckCircle v-if="uploadStatus.drivers.success" class="h-4 w-4 text-green-500 mr-1" />
              <AlertCircle v-else class="h-4 w-4 text-red-500 mr-1" />
              <span :class="uploadStatus.drivers.success ? 'text-green-700' : 'text-red-700'">
                {{ uploadStatus.drivers.message }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transporters Upload -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center mb-4">
            <Building class="h-6 w-6 text-orange-500 mr-2" />
            <h3 class="text-lg font-medium text-gray-900">Transporters</h3>
          </div>
          
          <div
            @drop="handleDrop($event, 'transporters')"
            @dragover.prevent
            @dragenter.prevent
            class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
            :class="{ 'border-orange-400 bg-orange-50': dragOverType === 'transporters' }"
          >
            <div class="space-y-1 text-center">
              <Upload class="mx-auto h-12 w-12 text-gray-400" />
              <div class="flex text-sm text-gray-600">
                <label class="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
                  <span>Upload CSV file</span>
                  <input
                    type="file"
                    accept=".csv"
                    class="sr-only"
                    @change="handleFileSelect($event, 'transporters')"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">CSV up to 10MB</p>
            </div>
          </div>

          <div class="mt-4 text-xs text-gray-500">
            <p class="font-medium">Required columns:</p>
            <p>name, contact_person, email, phone, vehicle_types, base_rate, rating</p>
          </div>
          
          <div v-if="uploadStatus.transporters" class="mt-3">
            <div class="flex items-center text-sm">
              <CheckCircle v-if="uploadStatus.transporters.success" class="h-4 w-4 text-green-500 mr-1" />
              <AlertCircle v-else class="h-4 w-4 text-red-500 mr-1" />
              <span :class="uploadStatus.transporters.success ? 'text-green-700' : 'text-red-700'">
                {{ uploadStatus.transporters.message }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sample CSV Downloads -->
    <div class="mt-8 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Sample CSV Templates
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Download sample CSV files to see the expected format for each data type.
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <button
            @click="downloadSample('clients')"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download class="h-4 w-4 mr-2" />
            Clients Sample
          </button>
          <button
            @click="downloadSample('products')"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download class="h-4 w-4 mr-2" />
            Products Sample
          </button>
          <button
            @click="downloadSample('drivers')"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download class="h-4 w-4 mr-2" />
            Drivers Sample
          </button>
          <button
            @click="downloadSample('transporters')"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download class="h-4 w-4 mr-2" />
            Transporters Sample
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Upload,
  Users,
  Package,
  Truck,
  Building,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-vue-next'
import { useClientsStore } from '@/stores/clients'
import { useProductsStore } from '@/stores/products'
import { useDriversStore } from '@/stores/drivers'
import { transportersAPI } from '@/services/api-types'

const clientsStore = useClientsStore()
const productsStore = useProductsStore()
const driversStore = useDriversStore()

const dragOverType = ref<string | null>(null)
const uploadStatus = ref<Record<string, { success: boolean; message: string }>>({})

async function handleDrop(event: DragEvent, type: string) {
  event.preventDefault()
  dragOverType.value = null
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    await uploadFile(files[0], type)
  }
}

async function handleFileSelect(event: Event, type: string) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    await uploadFile(files[0], type)
  }
}

async function uploadFile(file: File, type: string) {
  if (!file.name.endsWith('.csv')) {
    uploadStatus.value[type] = {
      success: false,
      message: 'Please upload a CSV file'
    }
    return
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    uploadStatus.value[type] = {
      success: false,
      message: 'File size must be less than 10MB'
    }
    return
  }

  try {
    let response
    switch (type) {
      case 'clients':
        response = await clientsStore.uploadCSV(file)
        break
      case 'products':
        response = await productsStore.uploadCSV(file)
        break
      case 'drivers':
        response = await driversStore.uploadCSV(file)
        break
      case 'transporters':
        const formData = new FormData()
        formData.append('file', file)
        response = await transportersAPI.uploadCSV(file)
        response = response.data
        break
      default:
        throw new Error('Invalid upload type')
    }

    uploadStatus.value[type] = {
      success: true,
      message: `Successfully imported ${response.count} ${type}`
    }
  } catch (error: any) {
    uploadStatus.value[type] = {
      success: false,
      message: error.response?.data?.detail || `Failed to upload ${type}`
    }
  }
}

function downloadSample(type: string) {
  const samples = {
    clients: 'name,email,phone,address,city,country\nJohn Doe,john@example.com,+1234567890,123 Main St,New York,USA\nJane Smith,jane@example.com,+1987654321,456 Oak Ave,Los Angeles,USA',
    products: 'name,category,weight,dimensions,value\nLaptop,Electronics,2.5,30x20x3,1500\nT-Shirt,Clothing,0.2,25x35x1,25',
    drivers: 'name,license_number,phone,email,vehicle_type,capacity,current_location,rating\nMike Wilson,DL123456,+1555123456,mike@example.com,Van,1000,New York,4.8\nSarah Johnson,DL789012,+1555789012,sarah@example.com,Truck,5000,Chicago,4.9',
    transporters: 'name,contact_person,email,phone,vehicle_types,base_rate,rating\nFast Logistics,Tom Brown,tom@fastlogistics.com,+1555001122,"Van,Truck",50,4.7\nQuick Transport,Lisa Davis,lisa@quicktransport.com,+1555334455,"Truck,Semi",75,4.5'
  }

  const content = samples[type as keyof typeof samples]
  const blob = new Blob([content], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${type}_sample.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
</script>
