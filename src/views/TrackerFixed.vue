<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Live Shipment Tracker</h1>
        <p class="text-gray-400">Real-time tracking of shipments across global routes</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Filter Controls -->
        <select 
          v-model="selectedFilter" 
          @change="filterShipments"
          class="bg-[#1e1e1e] border border-gray-600 text-white px-4 py-2 rounded-lg"
        >
          <option value="all">All Shipments</option>
          <option value="in_transit">In Transit</option>
          <option value="delayed">Delayed</option>
          <option value="on_time">On Time</option>
        </select>
        
        <button 
          @click="refreshTracking" 
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <RefreshCw :class="{ 'animate-spin': loading }" class="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Map Container -->
    <div class="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg overflow-hidden">
      <div class="h-[600px] relative">
        <!-- Leaflet Map will be rendered here -->
        <div ref="mapContainer" class="w-full h-full"></div>
        
        <!-- Loading Overlay -->
        <div v-if="mapLoading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div class="text-white text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p>Loading map...</p>
          </div>
        </div>

        <!-- Map Controls -->
        <div class="absolute top-4 right-4 space-y-2">
          <button 
            @click="toggleMapLayer"
            class="bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-lg text-sm"
          >
            {{ mapLayer === 'satellite' ? 'Street' : 'Satellite' }}
          </button>
          <button 
            @click="fitBounds"
            class="bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-lg text-sm"
          >
            Fit All
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">Active Shipments</p>
            <p class="text-2xl font-bold text-white">{{ filteredShipments.length }}</p>
          </div>
          <div class="p-3 bg-blue-500/20 rounded-lg">
            <Truck class="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">On Schedule</p>
            <p class="text-2xl font-bold text-green-400">{{ onTimeCount }}</p>
          </div>
          <div class="p-3 bg-green-500/20 rounded-lg">
            <CheckCircle class="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">Delayed</p>
            <p class="text-2xl font-bold text-red-400">{{ delayedCount }}</p>
          </div>
          <div class="p-3 bg-red-500/20 rounded-lg">
            <AlertTriangle class="h-6 w-6 text-red-400" />
          </div>
        </div>
      </div>

      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">In Transit</p>
            <p class="text-2xl font-bold text-blue-400">{{ inTransitCount }}</p>
          </div>
          <div class="p-3 bg-blue-500/20 rounded-lg">
            <Brain class="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Shipment List -->
    <div class="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg">
      <div class="p-6 border-b border-gray-700">
        <h2 class="text-lg font-semibold text-white flex items-center">
          <Package class="h-5 w-5 mr-2 text-green-400" />
          Active Shipments ({{ filteredShipments.length }})
        </h2>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div class="space-y-2 p-4">
          <div 
            v-for="shipment in filteredShipments.slice(0, 10)" 
            :key="shipment.id"
            @click="selectShipment(shipment)"
            class="p-4 bg-[#0f1419] rounded-lg cursor-pointer hover:bg-[#1a1f2e] transition-colors border border-gray-600"
            :class="{ 'ring-2 ring-blue-500': selectedShipment?.id === shipment.id }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-blue-400">{{ shipment.tracking_id }}</span>
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(shipment.status)"
              >
                {{ shipment.status.replace('_', ' ').toUpperCase() }}
              </span>
            </div>
            <div class="text-sm text-gray-300 mb-1">
              <span class="flex items-center">
                <MapPin class="h-3 w-3 mr-1" />
                {{ shipment.origin_city }} → {{ shipment.destination_city }}
              </span>
            </div>
            <div class="text-xs text-gray-400">
              ETA: {{ formatDate(shipment.eta) }} | {{ shipment.transport_mode }}
            </div>
            <div class="mt-2">
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>Progress</span>
                <span>{{ shipment.progress_percentage }}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  class="h-1.5 rounded-full transition-all duration-300"
                  :class="getProgressColor(shipment.status)"
                  :style="{ width: shipment.progress_percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shipment Details Modal -->
    <div v-if="selectedShipment" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="selectedShipment = null"></div>
        <div class="relative bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-white">Shipment Details</h3>
              <button @click="selectedShipment = null" class="text-gray-400 hover:text-white">
                <X class="h-6 w-6" />
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Tracking ID</label>
                  <p class="text-white font-mono">{{ selectedShipment.tracking_id }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Route</label>
                  <p class="text-white">{{ selectedShipment.origin_city }} → {{ selectedShipment.destination_city }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Transport Mode</label>
                  <p class="text-white">{{ selectedShipment.transport_mode }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="getStatusClass(selectedShipment.status)"
                  >
                    {{ selectedShipment.status.replace('_', ' ').toUpperCase() }}
                  </span>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">ETA</label>
                  <p class="text-white">{{ formatDate(selectedShipment.eta) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Progress</label>
                  <div class="flex items-center space-x-3">
                    <div class="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getProgressColor(selectedShipment.status)"
                        :style="{ width: selectedShipment.progress_percentage + '%' }"
                      ></div>
                    </div>
                    <span class="text-white text-sm">{{ selectedShipment.progress_percentage }}%</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">AI Confidence</label>
                  <p class="text-white">{{ selectedShipment.ai_confidence }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  MapPin, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  Brain,
  Package,
  RefreshCw,
  X
} from 'lucide-vue-next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const loading = ref(false)
const mapLoading = ref(true)
const selectedFilter = ref('all')
const selectedShipment = ref(null)
const mapContainer = ref(null)
const mapLayer = ref('street')
let map = null
let markers = []

// Sample shipment data with SA and EU routes
const shipments = ref([
  {
    id: 1,
    tracking_id: 'SH-2025-001',
    origin_city: 'Cape Town',
    destination_city: 'Hamburg',
    status: 'in_transit',
    eta: new Date('2025-06-15'),
    transport_mode: 'Sea Freight',
    progress_percentage: 65,
    ai_confidence: 94,
    coordinates: { lat: -33.9249, lng: 18.4241 },
    destination_coords: { lat: 53.5511, lng: 9.9937 }
  },
  {
    id: 2,
    tracking_id: 'SH-2025-002', 
    origin_city: 'Durban',
    destination_city: 'Rotterdam',
    status: 'on_time',
    eta: new Date('2025-06-12'),
    transport_mode: 'Sea Freight',
    progress_percentage: 80,
    ai_confidence: 96,
    coordinates: { lat: -29.8587, lng: 31.0218 },
    destination_coords: { lat: 51.9244, lng: 4.4777 }
  },
  {
    id: 3,
    tracking_id: 'SH-2025-003',
    origin_city: 'Johannesburg',
    destination_city: 'Frankfurt',
    status: 'delayed',
    eta: new Date('2025-06-18'),
    transport_mode: 'Air Freight',
    progress_percentage: 45,
    ai_confidence: 78,
    coordinates: { lat: -26.2041, lng: 28.0473 },
    destination_coords: { lat: 50.1109, lng: 8.6821 }
  },
  {
    id: 4,
    tracking_id: 'SH-2025-004',
    origin_city: 'Berlin',
    destination_city: 'Cape Town',
    status: 'in_transit',
    eta: new Date('2025-06-20'),
    transport_mode: 'Sea Freight',
    progress_percentage: 30,
    ai_confidence: 92,
    coordinates: { lat: 52.5200, lng: 13.4050 },
    destination_coords: { lat: -33.9249, lng: 18.4241 }
  },
  {
    id: 5,
    tracking_id: 'SH-2025-005',
    origin_city: 'Amsterdam',
    destination_city: 'Johannesburg',
    status: 'in_transit',
    eta: new Date('2025-06-14'),
    transport_mode: 'Air Freight',
    progress_percentage: 70,
    ai_confidence: 89,
    coordinates: { lat: 52.3676, lng: 4.9041 },
    destination_coords: { lat: -26.2041, lng: 28.0473 }
  }
])

const filteredShipments = computed(() => {
  if (selectedFilter.value === 'all') return shipments.value
  return shipments.value.filter(s => s.status === selectedFilter.value)
})

const onTimeCount = computed(() => {
  return shipments.value.filter(s => s.status === 'on_time').length
})

const delayedCount = computed(() => {
  return shipments.value.filter(s => s.status === 'delayed').length
})

const inTransitCount = computed(() => {
  return shipments.value.filter(s => s.status === 'in_transit').length
})

const getStatusClass = (status) => {
  switch (status) {
    case 'on_time':
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case 'delayed':
      return 'bg-red-500/20 text-red-400 border border-red-500/30'
    case 'in_transit':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}

const getProgressColor = (status) => {
  switch (status) {
    case 'on_time':
      return 'bg-green-500'
    case 'delayed':
      return 'bg-red-500'
    case 'in_transit':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const initializeMap = () => {
  if (!mapContainer.value) return

  try {
    map = L.map(mapContainer.value, {
      zoomControl: true,
      attributionControl: false
    }).setView([20, 0], 2)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    addShipmentMarkers()
    mapLoading.value = false
  } catch (error) {
    console.error('Failed to initialize map:', error)
    mapLoading.value = false
  }
}

const addShipmentMarkers = () => {
  if (!map) return

  markers.forEach(marker => map.removeLayer(marker))
  markers = []

  filteredShipments.value.forEach(shipment => {
    const markerColor = getMarkerColor(shipment.status)
    
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${markerColor};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })

    const marker = L.marker([shipment.coordinates.lat, shipment.coordinates.lng], {
      icon: customIcon
    }).addTo(map)

    marker.bindPopup(`
      <div style="color: #333; font-size: 12px;">
        <strong>${shipment.tracking_id}</strong><br>
        ${shipment.origin_city} → ${shipment.destination_city}<br>
        Status: ${shipment.status.replace('_', ' ')}<br>
        Progress: ${shipment.progress_percentage}%<br>
        ETA: ${formatDate(shipment.eta)}
      </div>
    `)

    markers.push(marker)

    if (shipment.status === 'in_transit') {
      const routeLine = L.polyline([
        [shipment.coordinates.lat, shipment.coordinates.lng],
        [shipment.destination_coords.lat, shipment.destination_coords.lng]
      ], {
        color: markerColor,
        weight: 2,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map)

      markers.push(routeLine)
    }
  })
}

const getMarkerColor = (status) => {
  switch (status) {
    case 'on_time': return '#10b981'
    case 'delayed': return '#ef4444'
    case 'in_transit': return '#3b82f6'
    default: return '#6b7280'
  }
}

const toggleMapLayer = () => {
  mapLayer.value = mapLayer.value === 'street' ? 'satellite' : 'street'
  console.log('Map layer:', mapLayer.value)
}

const fitBounds = () => {
  if (!map || markers.length === 0) return
  
  const group = new L.featureGroup(markers.filter(m => m.getLatLng))
  map.fitBounds(group.getBounds().pad(0.1))
}

const selectShipment = (shipment) => {
  selectedShipment.value = shipment
}

const filterShipments = () => {
  if (map) {
    addShipmentMarkers()
  }
}

const refreshTracking = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    shipments.value.forEach(shipment => {
      if (shipment.status === 'in_transit') {
        shipment.progress_percentage = Math.min(100, shipment.progress_percentage + Math.random() * 10)
      }
    })
    
    if (map) {
      addShipmentMarkers()
    }
  } catch (error) {
    console.error('Failed to refresh tracking data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setTimeout(initializeMap, 100)
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.tracking-card {
  transition: all 0.3s ease;
}

.tracking-card:hover {
  transform: translateY(-2px);
}
</style>
