<template>
  <div class="dashboard-container">
    <Navbar />
    <div class="flex">
      <main class="flex-1 p-6 pt-20">
        <!-- Dashboard Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            🚢 AI Shipment ETA Dashboard
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            AI-powered supply chain management and ETA predictions
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span class="text-xl">📦</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Shipments</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalShipments }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span class="text-xl">🚚</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">In Transit</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.inTransit }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <span class="text-xl">⚠️</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">At Risk</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.atRisk }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span class="text-xl">🤖</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">AI Accuracy</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.aiAccuracy }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Shipments -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Shipments</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="shipment in recentShipments" :key="shipment.id" 
                   class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span class="text-sm">📦</span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ shipment.id }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ shipment.origin }} → {{ shipment.destination }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium" :class="getStatusColor(shipment.status)">
                    {{ shipment.status }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    ETA: {{ formatETA(shipment.eta) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'

console.log("✅ Real Dashboard with Navbar loaded")

// Sample data
const stats = ref({
  totalShipments: 1247,
  inTransit: 89,
  atRisk: 12,
  aiAccuracy: 94.2
})

const recentShipments = ref([
  {
    id: 'SH-2025-001',
    origin: 'Cape Town, SA',
    destination: 'Berlin, DE',
    status: 'in_transit',
    eta: '2025-06-12T14:30:00Z'
  },
  {
    id: 'SH-2025-002', 
    origin: 'Amsterdam, NL',
    destination: 'Johannesburg, SA',
    status: 'at_risk',
    eta: '2025-06-15T09:15:00Z'
  },
  {
    id: 'SH-2025-003',
    origin: 'Hamburg, DE',
    destination: 'Durban, SA',
    status: 'delivered',
    eta: '2025-06-10T16:45:00Z'
  }
])

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'text-green-600 dark:text-green-400'
    case 'in_transit':
      return 'text-blue-600 dark:text-blue-400'
    case 'at_risk':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'delayed':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

const formatETA = (eta) => {
  return new Date(eta).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  console.log("✅ Dashboard mounted with sample data")
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.dark .dashboard-container {
  background-color: #111827;
}
</style>
