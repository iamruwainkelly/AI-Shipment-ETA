<template>
  <div class="space-y-8">
    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-5 gap-6">
      <div class="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Total Shipments</p>
            <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
          </div>
          <div class="text-3xl">📦</div>
        </div>
      </div>
      
      <div class="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">In Transit</p>
            <p class="text-3xl font-bold text-[#1e88e5]">{{ stats.inTransit }}</p>
          </div>
          <div class="text-3xl">🚚</div>
        </div>
      </div>
      
      <div class="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">At Risk</p>
            <p class="text-3xl font-bold text-[#f59e0b]">{{ stats.atRisk }}</p>
          </div>
          <div class="text-3xl">⚠️</div>
        </div>
      </div>
      
      <div class="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Delivered</p>
            <p class="text-3xl font-bold text-green-400">{{ stats.delivered }}</p>
          </div>
          <div class="text-3xl">🎯</div>
        </div>
      </div>
      
      <div class="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">AI Accuracy</p>
            <p class="text-3xl font-bold text-purple-400">{{ stats.aiAccuracy }}%</p>
          </div>
          <div class="text-3xl">🤖</div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Revenue Trend Chart -->
      <div class="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">📊 Revenue Trend</h2>
          <div class="text-sm text-gray-400">Last 6 months</div>
        </div>
        <div class="h-64">
          <canvas id="lineChart" class="w-full h-full"></canvas>
        </div>
      </div>
      
      <!-- Transport Mode Split Chart -->
      <div class="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">🧭 Transport Mode Split</h2>
          <div class="text-sm text-gray-400">Current period</div>
        </div>
        <div class="h-64">
          <canvas id="pieChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">📈 Delivery Performance</h2>
        <button @click="generateReport" class="bg-[#1e88e5] hover:bg-[#1565c0] text-white px-4 py-2 rounded-lg transition-colors">
          Generate Report
        </button>
      </div>
      <div class="h-64">
        <canvas id="barChart" class="w-full h-full"></canvas>
      </div>
    </div>

    <!-- Recent Shipments Table -->
    <div class="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-xl font-semibold text-white mb-6">📋 Recent Shipments</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-4 text-gray-400">ID</th>
              <th class="text-left py-3 px-4 text-gray-400">Origin</th>
              <th class="text-left py-3 px-4 text-gray-400">Destination</th>
              <th class="text-left py-3 px-4 text-gray-400">Status</th>
              <th class="text-left py-3 px-4 text-gray-400">ETA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shipment in recentShipments" :key="shipment.id" class="border-b border-gray-800 hover:bg-[#242424] transition-colors">
              <td class="py-3 px-4 text-white font-mono">{{ shipment.id }}</td>
              <td class="py-3 px-4 text-gray-300">{{ shipment.origin }}</td>
              <td class="py-3 px-4 text-gray-300">{{ shipment.destination }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusColor(shipment.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ shipment.status.replace('_', ' ').toUpperCase() }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-300">{{ formatETA(shipment.eta) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Reactive data
const stats = ref({
  total: 1247,
  inTransit: 89,
  atRisk: 12,
  delivered: 1146,
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
  },
  {
    id: 'SH-2025-004',
    origin: 'Rotterdam, NL',
    destination: 'Cape Town, SA',
    status: 'in_transit',
    eta: '2025-06-18T11:20:00Z'
  }
])

// Chart configurations
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#d1d5db'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#9ca3af' },
      grid: { color: '#374151' }
    },
    y: {
      ticks: { color: '#9ca3af' },
      grid: { color: '#374151' }
    }
  }
}

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-900 text-green-300'
    case 'in_transit':
      return 'bg-blue-900 text-blue-300'
    case 'at_risk':
      return 'bg-yellow-900 text-yellow-300'
    case 'delayed':
      return 'bg-red-900 text-red-300'
    default:
      return 'bg-gray-900 text-gray-300'
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

const generateReport = () => {
  // Simulate report generation
  alert('🚀 Generating comprehensive shipment report... This will integrate with your backend API.')
}

// Initialize charts
onMounted(() => {
  // Revenue Trend Line Chart
  const lineCtx = document.getElementById('lineChart')
  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue ($)',
        data: [42000, 48000, 51000, 47500, 49800, 54960],
        fill: false,
        borderColor: '#1e88e5',
        backgroundColor: '#1e88e5',
        tension: 0.4,
        pointBackgroundColor: '#1e88e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          display: false
        }
      }
    }
  })

  // Transport Mode Pie Chart
  const pieCtx = document.getElementById('pieChart')
  new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Air ✈️', 'Road 🚛', 'Sea 🚢'],
      datasets: [{
        data: [532, 398, 317],
        backgroundColor: ['#1e88e5', '#10b981', '#8b5cf6'],
        borderColor: ['#1565c0', '#059669', '#7c3aed'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#d1d5db',
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  })

  // Delivery Performance Bar Chart
  const barCtx = document.getElementById('barChart')
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['On Time', 'Delayed', 'Early', 'At Risk'],
      datasets: [{
        label: 'Deliveries',
        data: [850, 120, 200, 77],
        backgroundColor: ['#10b981', '#ef4444', '#06b6d4', '#f59e0b'],
        borderColor: ['#059669', '#dc2626', '#0891b2', '#d97706'],
        borderWidth: 1
      }]
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          display: false
        }
      }
    }
  })

  console.log("✅ Dashboard with Chart.js visualizations loaded")
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.grid > div {
  animation: fadeIn 0.6s ease-out;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }
.grid > div:nth-child(5) { animation-delay: 0.5s; }
</style>
