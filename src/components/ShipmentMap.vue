<template>
  <div class="relative">
    <!-- Map Controls -->
    <div class="absolute top-4 left-4 z-[1000] space-y-2">
      <div class="bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 shadow-lg">
        <h3 class="text-sm font-semibold text-white mb-2">Map Controls</h3>
        <div class="space-y-2">
          <button 
            @click="toggleHeatmap"
            class="w-full text-xs px-3 py-1 rounded transition-colors"
            :class="showHeatmap ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
          >
            {{ showHeatmap ? 'Hide' : 'Show' }} Heatmap
          </button>
          <button 
            @click="toggleClusters"
            class="w-full text-xs px-3 py-1 rounded transition-colors"
            :class="showClusters ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
          >
            {{ showClusters ? 'Hide' : 'Show' }} Clusters
          </button>
          <button 
            @click="centerOnRecentShipments"
            class="w-full text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Center Recent
          </button>
        </div>
      </div>
      
      <!-- Live Updates Indicator -->
      <div class="bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 shadow-lg">
        <div class="flex items-center space-x-2">
          <div class="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-xs text-green-400 font-medium">Live Updates</span>
        </div>
        <div class="text-xs text-gray-400 mt-1">{{ activeShipments }} active shipments</div>
      </div>
    </div>

    <!-- Map Container -->
    <div id="shipment-map" class="h-full w-full min-h-[500px] bg-gray-900 rounded-lg overflow-hidden"></div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-black/50 flex items-center justify-center z-[1001]">
      <div class="bg-[#1e1e1e] border border-gray-700 rounded-lg p-6 text-center">
        <div class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-white text-sm">Loading map...</p>
      </div>
    </div>

    <!-- Shipment Legend -->
    <div class="absolute bottom-4 left-4 z-[1000]">
      <div class="bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 shadow-lg">
        <h4 class="text-xs font-semibold text-white mb-2">Status Legend</h4>
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <div class="h-2 w-2 bg-green-500 rounded-full"></div>
            <span class="text-xs text-gray-300">On Track</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <span class="text-xs text-gray-300">At Risk</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="h-2 w-2 bg-red-500 rounded-full"></div>
            <span class="text-xs text-gray-300">Delayed</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span class="text-xs text-gray-300">Delivered</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import mapboxgl from 'mapbox-gl'
import { useShipmentsStore } from '../stores/shipments'

// Mapbox access token from environment
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const shipmentsStore = useShipmentsStore()

// Reactive state
const loading = ref(true)
const showHeatmap = ref(false)
const showClusters = ref(true)
const map = ref(null)
const markers = ref([])

// Computed properties
const activeShipments = computed(() => 
  shipmentsStore.shipments.filter(s => s.status !== 'delivered').length
)

// South African and European city coordinates
const cityCoordinates = {
  // South Africa
  'Cape Town': [-18.4241, 33.9249],
  'Johannesburg': [28.0473, -26.2041],
  'Durban': [31.0218, -29.8587],
  'Pretoria': [28.1881, -25.7479],
  'Port Elizabeth': [25.5701, -33.9608],
  'Bloemfontein': [26.2041, -29.0852],
  
  // Europe
  'London': [-0.1276, 51.5074],
  'Berlin': [13.4050, 52.5200],
  'Paris': [2.3522, 48.8566],
  'Madrid': [-3.7038, 40.4168],
  'Rome': [12.4964, 41.9028],
  'Amsterdam': [4.9041, 52.3676],
  'Brussels': [4.3517, 50.8503],
  'Vienna': [16.3738, 48.2082],
  'Prague': [14.4378, 50.0755],
  'Warsaw': [21.0122, 52.2297],
  'Stockholm': [18.0686, 59.3293],
  'Oslo': [10.7522, 59.9139],
  'Helsinki': [24.9384, 60.1699],
  'Copenhagen': [12.5683, 55.6761],
  'Zurich': [8.5417, 47.3769],
  'Barcelona': [2.1734, 41.3851],
  'Milan': [9.1900, 45.4642],
  'Munich': [11.5820, 48.1351],
  'Frankfurt': [8.6821, 50.1109],
  'Hamburg': [9.9937, 53.5511],
  'Cologne': [6.9603, 50.9375],
  'Stuttgart': [9.1829, 48.7758],
  'Düsseldorf': [6.7735, 51.2277],
  'Leipzig': [12.3731, 51.3397],
  'Dresden': [13.7373, 51.0504],
  'Hannover': [9.7320, 52.3759],
  'Nuremberg': [11.0767, 49.4521],
  'Dortmund': [7.4653, 51.5136],
  'Essen': [7.0116, 51.4556],
  'Bremen': [8.8017, 53.0793],
  'Duisburg': [6.7623, 51.4344],
  'Toulouse': [1.4442, 43.6047],
  'Lyon': [4.8357, 45.7640],
  'Marseille': [5.3698, 43.2965],
  'Nice': [7.2619, 43.7102],
  'Bordeaux': [-0.5792, 44.8378],
  'Lille': [3.0573, 50.6292],
  'Nantes': [-1.5534, 47.2184],
  'Strasbourg': [7.7521, 48.5734],
  'Montpellier': [3.8767, 43.6108],
  'Rennes': [-1.6778, 48.1173]
}

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case 'on_track': return '#22c55e'
    case 'at_risk': return '#eab308'
    case 'delayed': return '#ef4444'
    case 'delivered': return '#3b82f6'
    default: return '#6b7280'
  }
}

// Get coordinates for a city
const getCoordinates = (city) => {
  const coords = cityCoordinates[city]
  if (coords) {
    return [coords[0], coords[1]] // Mapbox uses [lng, lat]
  }
  // Default to Johannesburg if city not found
  return [28.0473, -26.2041]
}

// Initialize map
const initMap = async () => {
  try {
    loading.value = true
    
    // Create map instance
    map.value = new mapboxgl.Map({
      container: 'shipment-map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [
        Number(import.meta.env.VITE_MAP_DEFAULT_CENTER_LNG) || 28.2293,
        Number(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT) || -25.7479
      ],
      zoom: Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 6,
      projection: 'mercator'
    })

    // Wait for map to load
    await new Promise((resolve) => {
      map.value.on('load', resolve)
    })

    // Add navigation controls
    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.value.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Load shipments and create markers
    await loadShipmentMarkers()
    
    loading.value = false
  } catch (error) {
    console.error('Error initializing map:', error)
    loading.value = false
  }
}

// Load shipment markers
const loadShipmentMarkers = async () => {
  try {
    // Try to fetch live data first
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/map/positions`)
      if (response.ok) {
        const liveData = await response.json()
        console.log('✅ Loaded live shipment data:', liveData.length, 'shipments')
        createMarkersFromData(liveData)
        return
      }
    } catch (error) {
      console.log('ℹ️ Live API not available, using store data')
    }

    // Fallback to store data
    const shipments = shipmentsStore.shipments
    console.log('📦 Using store data:', shipments.length, 'shipments')
    createMarkersFromData(shipments)
  } catch (error) {
    console.error('Error loading shipment markers:', error)
  }
}

// Create markers from data
const createMarkersFromData = (shipments) => {
  // Clear existing markers
  clearMarkers()

  shipments.forEach(shipment => {
    try {
      const currentCoords = getCoordinates(shipment.currentLocation || shipment.origin)
      const destinationCoords = getCoordinates(shipment.destination)
      
      // Create current location marker
      createShipmentMarker(shipment, currentCoords, 'current')
      
      // Create destination marker
      createShipmentMarker(shipment, destinationCoords, 'destination')
      
      // Create route line if both coordinates are valid
      if (currentCoords && destinationCoords) {
        createRouteLine(shipment, currentCoords, destinationCoords)
      }
    } catch (error) {
      console.warn('Failed to create marker for shipment:', shipment.id, error)
    }
  })

  // Center map on markers if any exist
  if (markers.value.length > 0) {
    centerMapOnMarkers()
  }
}

// Create individual shipment marker
const createShipmentMarker = (shipment, coordinates, type) => {
  const color = getStatusColor(shipment.status)
  const isDestination = type === 'destination'
  
  // Create marker element
  const markerEl = document.createElement('div')
  markerEl.className = 'shipment-marker'
  markerEl.style.cssText = `
    width: ${isDestination ? '16px' : '20px'};
    height: ${isDestination ? '16px' : '20px'};
    background-color: ${color};
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ${isDestination ? 'opacity: 0.7;' : ''}
    ${shipment.status !== 'delivered' && !isDestination ? 'animation: pulse 2s infinite;' : ''}
  `

  // Create popup content
  const popupContent = `
    <div class="bg-[#1e1e1e] text-white p-3 rounded-lg min-w-[200px]">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-blue-400">${shipment.id}</h3>
        <span class="text-xs px-2 py-1 rounded" style="background-color: ${color}20; color: ${color};">
          ${shipment.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      <div class="space-y-1 text-sm">
        <div><span class="text-gray-400">Type:</span> ${isDestination ? 'Destination' : 'Current Location'}</div>
        <div><span class="text-gray-400">Location:</span> ${isDestination ? shipment.destination : shipment.currentLocation || shipment.origin}</div>
        <div><span class="text-gray-400">Carrier:</span> ${shipment.carrier}</div>
        <div><span class="text-gray-400">Progress:</span> ${shipment.progress}%</div>
        <div><span class="text-gray-400">ETA:</span> ${new Date(shipment.eta).toLocaleDateString('en-ZA')}</div>
        ${shipment.riskScore ? `<div><span class="text-gray-400">Risk Score:</span> ${shipment.riskScore}/10</div>` : ''}
      </div>
    </div>
  `

  // Create popup
  const popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
    className: 'shipment-popup'
  }).setHTML(popupContent)

  // Create and add marker
  const marker = new mapboxgl.Marker(markerEl)
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map.value)

  markers.value.push(marker)
}

// Create route line between current location and destination
const createRouteLine = (shipment, currentCoords, destinationCoords) => {
  const routeId = `route-${shipment.id}`
  
  // Add route source
  if (!map.value.getSource(routeId)) {
    map.value.addSource(routeId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          shipmentId: shipment.id,
          status: shipment.status
        },
        geometry: {
          type: 'LineString',
          coordinates: [currentCoords, destinationCoords]
        }
      }
    })

    // Add route layer
    map.value.addLayer({
      id: routeId,
      type: 'line',
      source: routeId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': getStatusColor(shipment.status),
        'line-width': 2,
        'line-opacity': 0.6,
        'line-dasharray': shipment.status === 'delayed' ? [2, 2] : [1, 0]
      }
    })
  }
}

// Clear all markers
const clearMarkers = () => {
  markers.value.forEach(marker => marker.remove())
  markers.value = []
  
  // Remove route layers
  if (map.value) {
    const layers = map.value.getStyle().layers
    layers.forEach(layer => {
      if (layer.id.startsWith('route-')) {
        map.value.removeLayer(layer.id)
        map.value.removeSource(layer.id)
      }
    })
  }
}

// Center map on all markers
const centerMapOnMarkers = () => {
  if (markers.value.length === 0) return

  const bounds = new mapboxgl.LngLatBounds()
  markers.value.forEach(marker => {
    bounds.extend(marker.getLngLat())
  })

  map.value.fitBounds(bounds, {
    padding: 50,
    maxZoom: 10
  })
}

// Center on recent shipments
const centerOnRecentShipments = () => {
  const recentShipments = shipmentsStore.shipments
    .filter(s => s.status !== 'delivered')
    .slice(0, 5)

  if (recentShipments.length === 0) return

  const bounds = new mapboxgl.LngLatBounds()
  recentShipments.forEach(shipment => {
    const coords = getCoordinates(shipment.currentLocation || shipment.origin)
    bounds.extend(coords)
  })

  map.value.fitBounds(bounds, {
    padding: 100,
    maxZoom: 8
  })
}

// Toggle heatmap (placeholder for future implementation)
const toggleHeatmap = () => {
  showHeatmap.value = !showHeatmap.value
  // TODO: Implement heatmap layer
  console.log('Heatmap toggled:', showHeatmap.value)
}

// Toggle clusters (placeholder for future implementation)
const toggleClusters = () => {
  showClusters.value = !showClusters.value
  // TODO: Implement marker clustering
  console.log('Clusters toggled:', showClusters.value)
}

// Auto-refresh data every 30 seconds
const refreshInterval = ref(null)

const startAutoRefresh = () => {
  refreshInterval.value = setInterval(() => {
    console.log('🔄 Auto-refreshing map data...')
    loadShipmentMarkers()
  }, 30000) // 30 seconds
}

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

// Lifecycle hooks
onMounted(async () => {
  await initMap()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
  clearMarkers()
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
@import 'mapbox-gl/dist/mapbox-gl.css';

.shipment-marker {
  transition: transform 0.2s ease;
}

.shipment-marker:hover {
  transform: scale(1.2);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* Custom popup styles */
:deep(.shipment-popup .mapboxgl-popup-content) {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
}

:deep(.shipment-popup .mapboxgl-popup-tip) {
  border-top-color: #1e1e1e !important;
}
</style>