<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Page header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">
          Overview of your shipment operations and ETA predictions
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="refreshAll"
          :disabled="loading"
          class="btn-primary"
        >
          <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Shipments -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Package class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Shipments
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ shipmentsStore.shipmentsCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- In Transit -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Truck class="h-6 w-6 text-blue-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  In Transit
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ shipmentsStore.inTransitShipments.length }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Drivers -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Users class="h-6 w-6 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Available Drivers
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ driversStore.availableDriversCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Average ETA Confidence -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Target class="h-6 w-6 text-purple-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Avg ETA Confidence
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ Math.round(shipmentsStore.averageConfidenceScore * 100) }}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Shipments -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Shipments
          </h3>
          <div class="space-y-3">
            <div
              v-for="shipment in recentShipments"
              :key="shipment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="getStatusColor(shipment.status)"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ shipment.client?.name }} - {{ shipment.product?.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ shipment.origin }} → {{ shipment.destination }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-900">
                  {{ formatDate(shipment.estimated_eta) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ shipment.confidence_score * 100 }}% confidence
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <router-link
              to="/shipments"
              class="text-sm text-primary-600 hover:text-primary-500"
            >
              View all shipments →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div class="space-y-3">
            <router-link
              to="/upload"
              class="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Upload class="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p class="text-sm font-medium text-gray-900">Upload CSV Data</p>
                <p class="text-xs text-gray-500">
                  Import clients, products, or drivers
                </p>
              </div>
            </router-link>
            
            <router-link
              to="/shipments"
              class="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Plus class="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p class="text-sm font-medium text-gray-900">Create Shipment</p>
                <p class="text-xs text-gray-500">
                  Set up new delivery with ETA prediction
                </p>
              </div>
            </router-link>
            
            <router-link
              to="/drivers"
              class="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <UserPlus class="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p class="text-sm font-medium text-gray-900">Manage Drivers</p>
                <p class="text-xs text-gray-500">
                  View and update driver availability
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ETA Calculation Demo -->
    <div class="mt-8 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          ETA Calculator
        </h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Origin</label>
            <input
              v-model="etaForm.origin"
              type="text"
              placeholder="Enter origin address"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Destination</label>
            <input
              v-model="etaForm.destination"
              type="text"
              placeholder="Enter destination address"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="calculateETA"
              :disabled="!etaForm.origin || !etaForm.destination || etaLoading"
              class="btn-primary w-full"
            >
              <Calculator class="h-4 w-4 mr-2" />
              Calculate ETA
            </button>
          </div>
        </div>
        
        <div v-if="etaResult" class="mt-4 p-4 bg-blue-50 rounded-md">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-4">
            <div>
              <p class="text-xs text-gray-500">Estimated ETA</p>
              <p class="text-sm font-medium">{{ formatDate(etaResult.estimated_eta) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Distance</p>
              <p class="text-sm font-medium">{{ (etaResult.route_distance / 1000).toFixed(1) }} km</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Duration</p>
              <p class="text-sm font-medium">{{ Math.round(etaResult.route_duration / 60) }} min</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Confidence</p>
              <p class="text-sm font-medium">{{ Math.round(etaResult.confidence_score * 100) }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Package,
  Truck,
  Users,
  Target,
  Upload,
  Plus,
  UserPlus,
  Calculator,
  RefreshCw
} from 'lucide-vue-next'
import { useShipmentsStore } from '@/stores/shipments'
import { useDriversStore } from '@/stores/drivers'
import { useClientsStore } from '@/stores/clients'
import { useProductsStore } from '@/stores/products'
import type { ETACalculation } from '@/services/api-types'

const shipmentsStore = useShipmentsStore()
const driversStore = useDriversStore()
const clientsStore = useClientsStore()
const productsStore = useProductsStore()

const loading = ref(false)
const etaLoading = ref(false)
const etaForm = ref({
  origin: '',
  destination: ''
})
const etaResult = ref<ETACalculation | null>(null)

const recentShipments = computed(() => {
  return shipmentsStore.shipments
    .slice()
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 5)
})

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-400'
    case 'in_transit':
      return 'bg-blue-400'
    case 'delivered':
      return 'bg-green-400'
    case 'delayed':
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function refreshAll() {
  loading.value = true
  try {
    await Promise.all([
      shipmentsStore.fetchShipments(),
      driversStore.fetchDrivers(),
      clientsStore.fetchClients(),
      productsStore.fetchProducts()
    ])
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    loading.value = false
  }
}

async function calculateETA() {
  if (!etaForm.value.origin || !etaForm.value.destination) return
  
  etaLoading.value = true
  try {
    etaResult.value = await shipmentsStore.calculateETA(
      etaForm.value.origin,
      etaForm.value.destination
    )
  } catch (error) {
    console.error('Failed to calculate ETA:', error)
  } finally {
    etaLoading.value = false
  }
}

onMounted(() => {
  refreshAll()
})
</script>
