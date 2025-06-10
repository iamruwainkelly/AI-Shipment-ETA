<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Shipments</h1>
        <p class="text-gray-600">Track and manage all shipments</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Create Shipment
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
            <p class="text-sm font-medium text-gray-600">Total Shipments</p>
            <p class="text-2xl font-bold text-gray-900">{{ shipmentsStore.shipmentsCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">In Transit</p>
            <p class="text-2xl font-bold text-gray-900">{{ inTransitCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Delivered</p>
            <p class="text-2xl font-bold text-gray-900">{{ deliveredCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <DollarSign class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Value</p>
            <p class="text-2xl font-bold text-gray-900">${{ totalValue.toLocaleString() }}</p>
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
            placeholder="Search shipments..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Shipments Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client & Product
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ETA
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="shipment in filteredShipments" :key="shipment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ shipment.tracking_number }}</div>
                <div class="text-sm text-gray-500">${{ shipment.cost?.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getClientName(shipment.client_id) }}</div>
                <div class="text-sm text-gray-500">{{ getProductName(shipment.product_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ shipment.pickup_address }}</div>
                <div class="text-sm text-gray-500">→ {{ shipment.delivery_address }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getDriverName(shipment.driver_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="shipment.estimated_delivery" class="text-sm text-gray-900">
                  {{ formatDate(shipment.estimated_delivery) }}
                </div>
                <div v-if="shipment.eta_confidence" class="text-xs text-gray-500">
                  {{ shipment.eta_confidence }}% confidence
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusColor(shipment.status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ formatStatus(shipment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewShipment(shipment)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  v-if="shipment.invoice_url"
                  @click="downloadInvoice(shipment.invoice_url)"
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  <Download class="w-4 h-4" />
                </button>
                <button
                  @click="updateStatus(shipment)"
                  class="text-purple-600 hover:text-purple-900"
                >
                  <RefreshCw class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Shipment Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Create New Shipment</h3>
        
        <form @submit.prevent="createShipment" class="space-y-6">
          <!-- Client & Product Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <select
                v-model="shipmentForm.client_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="onClientChange"
              >
                <option value="">Select Client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }} - {{ client.city }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <select
                v-model="shipmentForm.product_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }} - ${{ product.value }}
                </option>
              </select>
            </div>
          </div>

          <!-- Addresses -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
              <textarea
                v-model="shipmentForm.pickup_address"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pickup address"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
              <textarea
                v-model="shipmentForm.delivery_address"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter delivery address (auto-filled from client)"
              ></textarea>
            </div>
          </div>

          <!-- Smart Driver Matching -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Smart Driver Matching</h4>
            <div v-if="recommendedDrivers.length > 0" class="space-y-2">
              <div
                v-for="driver in recommendedDrivers"
                :key="driver.id"
                @click="selectDriver(driver)"
                :class="[
                  'p-3 border rounded-lg cursor-pointer transition-colors',
                  shipmentForm.driver_id === driver.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-medium text-gray-900">{{ driver.name }}</div>
                    <div class="text-sm text-gray-600">
                      {{ driver.current_location }} • ${{ driver.rate_per_km }}/km
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-green-600">
                      Score: {{ driver.match_score }}/100
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ driver.distance_km }}km away
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500">
              Select pickup and delivery addresses to see driver recommendations
            </div>
          </div>

          <!-- Manual Driver Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Or Select Driver Manually
            </label>
            <select
              v-model="shipmentForm.driver_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Driver</option>
              <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                {{ driver.name }} - {{ driver.current_location }} (${{ driver.rate_per_km }}/km)
              </option>
            </select>
          </div>

          <!-- ETA Preview -->
          <div v-if="etaPreview" class="bg-blue-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-blue-900 mb-2">ETA Preview</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div class="text-blue-600">Distance</div>
                <div class="font-medium">{{ etaPreview.distance_km }} km</div>
              </div>
              <div>
                <div class="text-blue-600">Duration</div>
                <div class="font-medium">{{ etaPreview.duration_hours }}h</div>
              </div>
              <div>
                <div class="text-blue-600">Estimated Cost</div>
                <div class="font-medium">${{ etaPreview.estimated_cost }}</div>
              </div>
              <div>
                <div class="text-blue-600">Confidence</div>
                <div class="font-medium">{{ etaPreview.confidence }}%</div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating || !shipmentForm.client_id || !shipmentForm.product_id || !shipmentForm.driver_id"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create Shipment' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Shipment Detail Modal -->
    <div v-if="showDetailModal && selectedShipment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            Shipment Details - {{ selectedShipment.tracking_number }}
          </h3>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-600">Client</label>
              <p class="text-gray-900">{{ getClientName(selectedShipment.client_id) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Product</label>
              <p class="text-gray-900">{{ getProductName(selectedShipment.product_id) }}</p>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-600">Pickup Address</label>
            <p class="text-gray-900">{{ selectedShipment.pickup_address }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-600">Delivery Address</label>
            <p class="text-gray-900">{{ selectedShipment.delivery_address }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-600">Driver</label>
              <p class="text-gray-900">{{ getDriverName(selectedShipment.driver_id) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Cost</label>
              <p class="text-gray-900">${{ selectedShipment.cost?.toLocaleString() }}</p>
            </div>
          </div>
          
          <div v-if="selectedShipment.estimated_delivery">
            <label class="text-sm font-medium text-gray-600">Estimated Delivery</label>
            <p class="text-gray-900">{{ formatDate(selectedShipment.estimated_delivery) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Plus, Package, Clock, CheckCircle, DollarSign, Eye, Download, 
  RefreshCw, X, User
} from 'lucide-vue-next'
import { useShipmentsStore } from '@/stores/shipments'
import { useClientsStore } from '@/stores/clients'
import { useProductsStore } from '@/stores/products'
import { useDriversStore } from '@/stores/drivers'
import type { Shipment, Driver } from '@/services/api-types'

const shipmentsStore = useShipmentsStore()
const clientsStore = useClientsStore()
const productsStore = useProductsStore()
const driversStore = useDriversStore()

const searchQuery = ref('')
const filterStatus = ref('')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedShipment = ref<Shipment | null>(null)
const creating = ref(false)

const shipmentForm = ref({
  client_id: null as number | null,
  product_id: null as number | null,
  driver_id: null as number | null,
  pickup_address: '',
  delivery_address: ''
})

const recommendedDrivers = ref<(Driver & { match_score: number; distance_km: number })[]>([])
const etaPreview = ref<any>(null)

const clients = computed(() => clientsStore.clients)
const products = computed(() => productsStore.products)
const drivers = computed(() => driversStore.drivers)

const inTransitCount = computed(() => {
  return shipmentsStore.shipments.filter(s => s.status === 'in_transit').length
})

const deliveredCount = computed(() => {
  return shipmentsStore.shipments.filter(s => s.status === 'delivered').length
})

const totalValue = computed(() => {
  return shipmentsStore.shipments.reduce((sum, s) => sum + (s.cost || 0), 0)
})

const filteredShipments = computed(() => {
  let filtered = shipmentsStore.shipments

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(shipment =>
      shipment.tracking_number.toLowerCase().includes(query) ||
      shipment.pickup_address.toLowerCase().includes(query) ||
      shipment.delivery_address.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(shipment => shipment.status === filterStatus.value)
  }

  return filtered
})

function getClientName(clientId: number) {
  const client = clients.value.find(c => c.id === clientId)
  return client?.name || 'Unknown Client'
}

function getProductName(productId: number) {
  const product = products.value.find(p => p.id === productId)
  return product?.name || 'Unknown Product'
}

function getDriverName(driverId: number) {
  const driver = drivers.value.find(d => d.id === driverId)
  return driver?.name || 'Unknown Driver'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_transit':
      return 'bg-blue-100 text-blue-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString()
}

function onClientChange() {
  if (shipmentForm.value.client_id) {
    const client = clients.value.find(c => c.id === shipmentForm.value.client_id)
    if (client) {
      shipmentForm.value.delivery_address = `${client.address}, ${client.city}`
    }
  }
}

function selectDriver(driver: Driver & { match_score: number; distance_km: number }) {
  shipmentForm.value.driver_id = driver.id
}

async function getDriverRecommendations() {
  if (shipmentForm.value.pickup_address && shipmentForm.value.delivery_address) {
    try {
      const recommendations = await shipmentsStore.getDriverRecommendations({
        pickup_address: shipmentForm.value.pickup_address,
        delivery_address: shipmentForm.value.delivery_address,
        product_id: shipmentForm.value.product_id
      })
      recommendedDrivers.value = recommendations
    } catch (error) {
      console.error('Failed to get driver recommendations:', error)
    }
  }
}

async function getETAPreview() {
  if (shipmentForm.value.pickup_address && 
      shipmentForm.value.delivery_address && 
      shipmentForm.value.driver_id) {
    try {
      const preview = await shipmentsStore.calculateETA({
        pickup_address: shipmentForm.value.pickup_address,
        delivery_address: shipmentForm.value.delivery_address,
        driver_id: shipmentForm.value.driver_id,
        product_id: shipmentForm.value.product_id
      })
      etaPreview.value = preview
    } catch (error) {
      console.error('Failed to get ETA preview:', error)
    }
  }
}

async function createShipment() {
  creating.value = true
  try {
    await shipmentsStore.createShipment(shipmentForm.value)
    closeCreateModal()
  } catch (error) {
    console.error('Failed to create shipment:', error)
  } finally {
    creating.value = false
  }
}

function closeCreateModal() {
  showCreateModal.value = false
  shipmentForm.value = {
    client_id: null,
    product_id: null,
    driver_id: null,
    pickup_address: '',
    delivery_address: ''
  }
  recommendedDrivers.value = []
  etaPreview.value = null
}

function viewShipment(shipment: Shipment) {
  selectedShipment.value = shipment
  showDetailModal.value = true
}

function downloadInvoice(url: string) {
  window.open(url, '_blank')
}

async function updateStatus(shipment: Shipment) {
  const newStatus = prompt('Enter new status (pending, in_transit, delivered, cancelled):', shipment.status)
  if (newStatus && ['pending', 'in_transit', 'delivered', 'cancelled'].includes(newStatus)) {
    try {
      await shipmentsStore.updateShipment(shipment.id, { status: newStatus })
    } catch (error) {
      console.error('Failed to update shipment status:', error)
    }
  }
}

// Watch for form changes to trigger recommendations and ETA preview
watch([
  () => shipmentForm.value.pickup_address,
  () => shipmentForm.value.delivery_address,
  () => shipmentForm.value.product_id
], () => {
  getDriverRecommendations()
})

watch(() => shipmentForm.value.driver_id, () => {
  getETAPreview()
})

onMounted(async () => {
  await Promise.all([
    shipmentsStore.fetchShipments(),
    clientsStore.fetchClients(),
    productsStore.fetchProducts(),
    driversStore.fetchDrivers()
  ])
})
</script>
