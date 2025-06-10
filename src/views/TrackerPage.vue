<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">🗺️ Live Shipment Tracker</h1>
      <p class="text-gray-400">Real-time tracking with AI-powered route optimization</p>
    </div>

    <!-- Search Section -->
    <div class="bg-[#1f1f1f] rounded-lg border border-gray-800 p-6 mb-8">
      <h2 class="text-xl font-semibold text-white mb-4">🔍 Track Shipment</h2>
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="trackingNumber"
            type="text"
            placeholder="Enter tracking number (e.g., SH001-2025-001)..."
            class="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent transition-all duration-200"
            @keyup.enter="trackShipment"
          />
        </div>
        <button
          @click="trackShipment"
          :disabled="loading || !trackingNumber.trim()"
          class="px-6 py-3 bg-[#1e88e5] text-white rounded-lg hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
        >
          <span class="text-lg">🔍</span>
          Track
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e88e5]"></div>
      <p class="text-gray-400 mt-2">Tracking shipment...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-8">
      <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <div class="flex items-center">
          <span class="text-red-400 mr-2">⚠️</span>
          <span class="text-red-300">{{ error }}</span>
        </div>
      </div>
    </div>

    <!-- Live Map Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Map Container -->
      <div class="lg:col-span-2 bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white flex items-center">
            🌍 Live Route Map
            <span class="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">LIVE</span>
          </h3>
        </div>
        <div class="h-96">
          <ShipmentMap 
            :shipments="liveShipments" 
            :selectedShipment="trackingData"
            @shipment-selected="selectShipment"
          />
        </div>
      </div>

      <!-- Tracking Info Panel -->
      <div class="space-y-4">
        <!-- Quick Stats -->
        <div class="bg-[#1f1f1f] rounded-lg border border-gray-800 p-4">
          <h4 class="text-lg font-semibold text-white mb-3">📊 Quick Stats</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-400">Active Shipments:</span>
              <span class="text-white font-semibold">1,247</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">In Transit:</span>
              <span class="text-[#1e88e5] font-semibold">847</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Delivered Today:</span>
              <span class="text-green-400 font-semibold">156</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Average ETA Accuracy:</span>
              <span class="text-[#f59e0b] font-semibold">94.2%</span>
            </div>
          </div>
        </div>

        <!-- Route Optimization -->
        <div class="bg-[#1f1f1f] rounded-lg border border-gray-800 p-4">
          <h4 class="text-lg font-semibold text-white mb-3">🤖 AI Optimization</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Route Efficiency:</span>
              <div class="flex items-center">
                <div class="w-16 bg-gray-700 rounded-full h-2 mr-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 96%"></div>
                </div>
                <span class="text-green-400 text-sm">96%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Fuel Savings:</span>
              <span class="text-green-400 font-semibold">23%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Time Reduction:</span>
              <span class="text-[#1e88e5] font-semibold">18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tracking Results -->
    <div v-if="trackingData && !loading" class="space-y-6">
      <!-- Shipment Info Card -->
      <div class="bg-[#1f1f1f] rounded-lg border border-gray-800 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">
            📦 Tracking #{{ trackingData.tracking_number }}
          </h3>
          <span
            :class="getStatusColor(trackingData.status)"
            class="px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ trackingData.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-400">From</label>
            <p class="text-white">{{ trackingData.origin }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-400">To</label>
            <p class="text-white">{{ trackingData.destination }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-400">Estimated Delivery</label>
            <p class="text-white">{{ formatDate(trackingData.estimated_delivery) }}</p>
          </div>
        </div>

        <!-- AI Confidence Score -->
        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="flex items-center justify-between">
            <span class="text-gray-400">AI Confidence Score:</span>
            <div class="flex items-center">
              <div class="w-24 bg-gray-700 rounded-full h-2 mr-2">
                <div :class="getConfidenceColor(trackingData.confidence)" 
                     :style="{ width: trackingData.confidence + '%' }" 
                     class="h-2 rounded-full transition-all duration-300"></div>
              </div>
              <span class="text-white font-semibold">{{ trackingData.confidence }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Timeline -->
      <div class="bg-[#1f1f1f] rounded-lg border border-gray-800 p-6">
        <h3 class="text-lg font-semibold text-white mb-6">🚚 Tracking History</h3>
        
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>
          
          <div v-for="(event, index) in trackingData.events" :key="index" class="relative flex items-start mb-6 last:mb-0">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center relative z-10 border-2',
                event.completed ? 'bg-green-500 border-green-400' : 'bg-gray-600 border-gray-500'
              ]"
            >
              <span v-if="event.completed" class="text-white text-sm">✓</span>
              <span v-else class="text-gray-300 text-sm">○</span>
            </div>
            
            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-medium text-white">{{ event.description }}</h4>
                <span class="text-sm text-gray-400">
                  {{ event.timestamp ? formatDate(event.timestamp) : 'Pending' }}
                </span>
              </div>
              <p class="text-sm text-gray-400 mt-1">{{ event.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Analytics Panel -->
      <div class="bg-[#1f1f1f] rounded-lg border border-gray-800 p-6">
        <h3 class="text-lg font-semibold text-white mb-4">📊 Shipment Analytics</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-[#1e88e5]">{{ trackingData.distance_traveled || '2,847' }} km</div>
            <div class="text-sm text-gray-400">Distance Traveled</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-[#f59e0b]">{{ trackingData.remaining_distance || '1,453' }} km</div>
            <div class="text-sm text-gray-400">Remaining Distance</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-400">{{ trackingData.speed || '65' }} km/h</div>
            <div class="text-sm text-gray-400">Current Speed</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-400">{{ trackingData.fuel_efficiency || '87' }}%</div>
            <div class="text-sm text-gray-400">Fuel Efficiency</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Trackings -->
    <div v-if="recentTrackings.length > 0" class="mt-8">
      <h3 class="text-lg font-semibold text-white mb-4">🔍 Recent Searches</h3>
      <div class="bg-[#1f1f1f] rounded-lg border border-gray-800">
        <div class="divide-y divide-gray-700">
          <div
            v-for="tracking in recentTrackings"
            :key="tracking.tracking_number"
            class="p-4 hover:bg-[#2a2a2a] cursor-pointer transition-colors duration-200"
            @click="trackingNumber = tracking.tracking_number; trackShipment()"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-white font-mono">{{ tracking.tracking_number }}</p>
                <p class="text-sm text-gray-400">{{ tracking.origin }} → {{ tracking.destination }}</p>
              </div>
              <span
                :class="getStatusColor(tracking.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ tracking.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ShipmentMap from '@/components/ShipmentMap.vue'

const trackingNumber = ref('')
const trackingData = ref(null)
const recentTrackings = ref([])
const loading = ref(false)
const error = ref(null)
const liveShipments = ref([])

// Mock live shipments data
const mockLiveShipments = [
  {
    id: 'SH001-2025-001',
    client: 'TechCorp SA',
    origin: { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
    destination: { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
    currentLocation: { lat: -10.4506, lng: 25.0119 },
    status: 'In Transit',
    eta: '2025-06-15T14:30:00Z',
    progress: 45,
    riskLevel: 'low'
  },
  {
    id: 'SH002-2025-002',
    client: 'EuroTrade Ltd',
    origin: { city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473 },
    destination: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
    currentLocation: { lat: 35.2444, lng: 33.4179 },
    status: 'In Transit',
    eta: '2025-06-16T10:15:00Z',
    progress: 72,
    riskLevel: 'medium'
  }
]

const trackShipment = async () => {
  if (!trackingNumber.value.trim()) return

  loading.value = true
  error.value = null
  trackingData.value = null

  try {
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock tracking data
    const mockData = {
      tracking_number: trackingNumber.value,
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      status: 'In Transit',
      estimated_delivery: '2025-06-15T14:30:00Z',
      current_location: 'Pacific Ocean (32.5°N, 157.8°W)',
      confidence: 94,
      distance_traveled: 2847,
      remaining_distance: 1453,
      speed: 65,
      fuel_efficiency: 87,
      events: [
        {
          description: 'Package collected from shipper',
          location: 'Shanghai Port, China',
          timestamp: '2025-06-08T09:00:00Z',
          completed: true
        },
        {
          description: 'Loaded onto vessel MV Pacific Star',
          location: 'Shanghai Port, China',
          timestamp: '2025-06-08T15:30:00Z',
          completed: true
        },
        {
          description: 'Vessel departed Shanghai',
          location: 'Shanghai Port, China',
          timestamp: '2025-06-09T02:00:00Z',
          completed: true
        },
        {
          description: 'In transit across Pacific Ocean',
          location: 'Pacific Ocean',
          timestamp: '2025-06-09T12:00:00Z',
          completed: true
        },
        {
          description: 'Expected arrival at Long Beach Port',
          location: 'Long Beach, CA, USA',
          timestamp: null,
          completed: false
        },
        {
          description: 'Out for delivery',
          location: 'Los Angeles, CA, USA',
          timestamp: null,
          completed: false
        }
      ]
    }
    
    trackingData.value = mockData
    
    // Add to recent trackings
    const existing = recentTrackings.value.findIndex(t => t.tracking_number === trackingNumber.value)
    if (existing !== -1) {
      recentTrackings.value.splice(existing, 1)
    }
    recentTrackings.value.unshift({
      tracking_number: trackingNumber.value,
      origin: mockData.origin,
      destination: mockData.destination,
      status: mockData.status,
      searched_at: new Date().toISOString()
    })
    
    // Keep only last 5 searches
    if (recentTrackings.value.length > 5) {
      recentTrackings.value = recentTrackings.value.slice(0, 5)
    }
    
    // Save to localStorage
    localStorage.setItem('recent_trackings', JSON.stringify(recentTrackings.value))
  } catch (err) {
    error.value = 'Failed to track shipment. Please check the tracking number and try again.'
    console.error('Tracking error:', err)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status) => {
  const colors = {
    'Delivered': 'bg-green-500 text-white',
    'In Transit': 'bg-[#1e88e5] text-white',
    'Delayed': 'bg-red-500 text-white',
    'Processing': 'bg-[#f59e0b] text-black',
    'Pending': 'bg-gray-500 text-white'
  }
  return colors[status] || 'bg-gray-500 text-white'
}

const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return 'bg-green-500'
  if (confidence >= 75) return 'bg-[#f59e0b]'
  return 'bg-red-500'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const selectShipment = (shipment) => {
  console.log('Selected shipment:', shipment)
  trackingNumber.value = shipment.id
  trackShipment()
}

onMounted(() => {
  // Load recent trackings from localStorage
  const saved = localStorage.getItem('recent_trackings')
  if (saved) {
    try {
      recentTrackings.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse recent trackings:', e)
    }
  }
  
  // Initialize live shipments
  liveShipments.value = mockLiveShipments
  
  console.log('TrackerPage loaded with enhanced map integration')
})
</script>

<style scoped>
/* Enhanced dark theme animations */
.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

#map-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}
</style>