<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gradient mb-2">Dashboard</h1>
        <p class="text-dark-text-3">Real-time insights and predictive analytics</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Date Filter -->
        <select 
          v-model="selectedTimeframe" 
          @change="updateCharts"
          class="input-primary text-sm"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 3 Months</option>
          <option value="1y">Last Year</option>
        </select>
        <!-- Refresh Button -->
        <button 
          @click="refreshData" 
          :disabled="loading"
          class="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw :class="{ 'animate-spin': loading }" class="h-4 w-4" />
          <span class="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div class="card group hover:scale-105 transition-all duration-300 cursor-pointer">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-dark-text-4 mb-1">Total Shipments</p>
              <p class="text-2xl font-bold text-dark-text mb-1">{{ formatNumber(stats.total) }}</p>
              <div class="flex items-center text-xs text-status-success">
                <TrendingUp class="h-3 w-3 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
            <div class="p-3 bg-status-info/20 rounded-lg border border-status-info/30 group-hover:bg-status-info/30 transition-colors">
              <Package class="h-6 w-6 text-status-info" />
            </div>
          </div>
        </div>
      </div>

      <div class="card group hover:scale-105 transition-all duration-300 cursor-pointer">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-dark-text-4 mb-1">In Transit</p>
              <p class="text-2xl font-bold text-dark-text mb-1">{{ formatNumber(stats.inTransit) }}</p>
              <p class="text-xs text-status-info">{{ ((stats.inTransit / stats.total) * 100).toFixed(1) }}% of total</p>
            </div>
            <div class="p-3 bg-status-info/20 rounded-lg border border-status-info/30 group-hover:bg-status-info/30 transition-colors">
              <Truck class="h-6 w-6 text-status-info" />
            </div>
          </div>
        </div>
      </div>

      <div class="card group hover:scale-105 transition-all duration-300 cursor-pointer">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-dark-text-4 mb-1">At Risk</p>
              <p class="text-2xl font-bold text-status-warning mb-1">{{ formatNumber(stats.atRisk) }}</p>
              <p class="text-xs text-status-warning">Delayed shipments</p>
            </div>
            <div class="p-3 bg-status-warning/20 rounded-lg border border-status-warning/30 group-hover:bg-status-warning/30 transition-colors">
              <AlertTriangle class="h-6 w-6 text-status-warning" />
            </div>
          </div>
        </div>
      </div>

      <div class="card group hover:scale-105 transition-all duration-300 cursor-pointer">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-dark-text-4 mb-1">Delivered</p>
              <p class="text-2xl font-bold text-status-success mb-1">{{ formatNumber(stats.delivered) }}</p>
              <p class="text-xs text-status-success">{{ ((stats.delivered / stats.total) * 100).toFixed(1) }}% success rate</p>
            </div>
            <div class="p-3 bg-status-success/20 rounded-lg border border-status-success/30 group-hover:bg-status-success/30 transition-colors">
              <CheckCircle class="h-6 w-6 text-status-success" />
            </div>
          </div>
        </div>
      </div>

      <div class="card group hover:scale-105 transition-all duration-300 cursor-pointer animate-pulse-glow">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-dark-text-4 mb-1">AI Accuracy</p>
              <p class="text-2xl font-bold text-gradient mb-1">{{ stats.aiAccuracy }}%</p>
              <p class="text-xs text-status-purple">ETA predictions</p>
            </div>
            <div class="p-3 bg-gradient-to-r from-gradient-orange/20 to-gradient-purple/20 rounded-lg border border-gradient-orange/30 group-hover:from-gradient-orange/30 group-hover:to-gradient-purple/30 transition-all">
              <Brain class="h-6 w-6 text-gradient-purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Revenue Trend Chart -->
      <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <TrendingUp class="h-5 w-5 mr-2 text-blue-400" />
            Revenue Trend
          </h2>
          <div class="text-sm text-gray-400">
            Last {{ selectedTimeframe === '7d' ? '7 days' : selectedTimeframe === '30d' ? '30 days' : selectedTimeframe === '90d' ? '3 months' : 'year' }}
          </div>
        </div>
        <div class="h-80">
          <canvas ref="lineChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- Transport Mode Distribution -->
      <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <PieChart class="h-5 w-5 mr-2 text-green-400" />
            Transport Mode Split
          </h2>
        </div>
        <div class="h-80">
          <canvas ref="pieChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <!-- Delivery Performance Chart -->
    <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-white flex items-center">
          <BarChart3 class="h-5 w-5 mr-2 text-purple-400" />
          Delivery Performance
        </h2>
      </div>
      <div class="h-80">
        <canvas ref="barChart" class="w-full h-full"></canvas>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
        <Activity class="h-5 w-5 mr-2 text-gray-400" />
        Recent Activity
      </h2>
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-4 p-3 bg-[#0f1419] rounded-lg">
          <div class="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-400" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-white">{{ activity.message }}</p>
            <p class="text-xs text-gray-400">{{ formatRelativeTime(activity.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Shipments Table -->
    <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-white flex items-center">
          <Package class="h-5 w-5 mr-2 text-blue-400" />
          Recent Shipments
        </h2>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Generate Report
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="pb-3 text-gray-400 font-medium">Tracking ID</th>
              <th class="pb-3 text-gray-400 font-medium">Origin</th>
              <th class="pb-3 text-gray-400 font-medium">Destination</th>
              <th class="pb-3 text-gray-400 font-medium">Status</th>
              <th class="pb-3 text-gray-400 font-medium">ETA</th>
              <th class="pb-3 text-gray-400 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody class="text-white">
            <tr v-for="shipment in recentShipments" :key="shipment.id" class="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors duration-200">
              <td class="py-4 font-mono text-blue-400">{{ shipment.trackingId }}</td>
              <td class="py-4">{{ shipment.origin }}</td>
              <td class="py-4">{{ shipment.destination }}</td>
              <td class="py-4">
                <span :class="getStatusColor(shipment.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ shipment.status }}
                </span>
              </td>
              <td class="py-4">{{ shipment.eta }}</td>
              <td class="py-4">
                <div class="flex items-center">
                  <div class="w-12 bg-gray-700 rounded-full h-2 mr-2">
                    <div :class="getConfidenceColor(shipment.confidence)" 
                         :style="{ width: shipment.confidence + '%' }" 
                         class="h-2 rounded-full transition-all duration-300"></div>
                  </div>
                  <span class="text-xs text-gray-400">{{ shipment.confidence }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  TrendingUp, 
  PieChart, 
  BarChart3,
  Activity,
  RefreshCw,
  Ship,
  Plane
} from 'lucide-vue-next'
import Chart from 'chart.js/auto'

const loading = ref(false)
const selectedTimeframe = ref('30d')

// Charts
const lineChart = ref(null)
const pieChart = ref(null)
const barChart = ref(null)
let lineChartInstance = null
let pieChartInstance = null
let barChartInstance = null

// Stats
const stats = reactive({
  total: 1247,
  inTransit: 89,
  atRisk: 12,
  delivered: 1146,
  aiAccuracy: 94.2
})

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'shipment',
    message: 'Shipment SH-2024-001 delivered to Cape Town',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 2,
    type: 'delay',
    message: 'Shipment SH-2024-002 delayed due to weather conditions',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 3,
    type: 'delivery',
    message: 'New shipment SH-2024-003 created for Hamburg route',
    timestamp: new Date(Date.now() - 60 * 60 * 1000)
  }
])

// Recent shipments
const recentShipments = ref([
  {
    id: 1,
    trackingId: 'SH-2024-001',
    origin: 'Cape Town, SA',
    destination: 'Hamburg, DE',
    status: 'In Transit',
    eta: '2024-02-15',
    confidence: 92
  },
  {
    id: 2,
    trackingId: 'SH-2024-002',
    origin: 'Durban, SA',
    destination: 'Rotterdam, NL',
    status: 'Delivered',
    eta: '2024-02-10',
    confidence: 98
  },
  {
    id: 3,
    trackingId: 'SH-2024-003',
    origin: 'Johannesburg, SA',
    destination: 'Frankfurt, DE',
    status: 'At Risk',
    eta: '2024-02-18',
    confidence: 76
  }
])

// Utility functions
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-ZA').format(num)
}

const formatRelativeTime = (date) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diff = Math.floor((date - new Date()) / (1000 * 60))
  return rtf.format(diff, 'minute')
}

const getActivityIcon = (type) => {
  switch (type) {
    case 'shipment': return Package
    case 'delay': return AlertTriangle
    case 'delivery': return CheckCircle
    default: return Activity
  }
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered': return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case 'in transit': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    case 'at risk': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    case 'delayed': return 'bg-red-500/20 text-red-400 border border-red-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}

const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return 'bg-green-500'
  if (confidence >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

// Chart creation functions
const createLineChart = (chartData) => {
  if (lineChartInstance) {
    lineChartInstance.destroy()
  }

  const data = chartData || {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [420000, 480000, 510000, 475000, 498000, 549600]
  }

  const ctx = lineChart.value.getContext('2d')
  lineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Revenue (ZAR)',
        data: data.data,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#9ca3af'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' }
        },
        y: {
          ticks: { 
            color: '#9ca3af',
            callback: function(value) {
              return 'R' + new Intl.NumberFormat('en-ZA').format(value)
            }
          },
          grid: { color: '#374151' }
        }
      }
    }
  })
}

const createPieChart = (chartData) => {
  if (pieChartInstance) {
    pieChartInstance.destroy()
  }

  const data = chartData || {
    labels: ['Sea Freight', 'Air Freight', 'Road Transport', 'Rail Transport'],
    data: [532, 398, 251, 66]
  }

  const ctx = pieChart.value.getContext('2d')
  pieChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.data,
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#8b5cf6',
          '#f59e0b'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#9ca3af',
            padding: 20
          }
        }
      }
    }
  })
}

const createBarChart = (chartData) => {
  if (barChartInstance) {
    barChartInstance.destroy()
  }

  const data = chartData || {
    labels: ['On Time', 'Early', 'Delayed', 'In Transit'],
    data: [891, 255, 89, 12]
  }

  const ctx = barChart.value.getContext('2d')
  barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Shipments',
        data: data.data,
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#ef4444',
          '#f59e0b'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { display: false }
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' }
        }
      }
    }
  })
}

const updateCharts = async () => {
  loading.value = true
  try {
    // Fetch data based on selected timeframe
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/summary?range=${selectedTimeframe.value}`)
    let data
    
    if (response.ok) {
      data = await response.json()
      console.log('✅ Loaded dashboard data from API:', data)
    } else {
      // Fallback data based on timeframe
      data = generateTimeframeData(selectedTimeframe.value)
      console.log('📊 Using fallback data for timeframe:', selectedTimeframe.value)
    }
    
    // Update stats
    Object.assign(stats, data.stats)
    
    // Update charts with new data
    nextTick(() => {
      createLineChart(data.charts.revenue)
      createPieChart(data.charts.transportMode)
      createBarChart(data.charts.performance)
    })
  } catch (error) {
    console.error('Failed to update charts:', error)
    // Use fallback data
    const fallbackData = generateTimeframeData(selectedTimeframe.value)
    Object.assign(stats, fallbackData.stats)
    
    nextTick(() => {
      createLineChart(fallbackData.charts.revenue)
      createPieChart(fallbackData.charts.transportMode)
      createBarChart(fallbackData.charts.performance)
    })
  } finally {
    loading.value = false
  }
}

const generateTimeframeData = (timeframe) => {
  const timeframeMultipliers = {
    '7d': { base: 0.1, labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    '30d': { base: 1, labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    '90d': { base: 3, labels: ['Month 1', 'Month 2', 'Month 3'] },
    '1y': { base: 12, labels: ['Q1', 'Q2', 'Q3', 'Q4'] }
  }
  
  const multiplier = timeframeMultipliers[timeframe]
  const baseTotalShipments = 1247
  
  return {
    stats: {
      total: Math.floor(baseTotalShipments * multiplier.base),
      inTransit: Math.floor(89 * multiplier.base),
      atRisk: Math.floor(12 * multiplier.base),
      delivered: Math.floor(1146 * multiplier.base),
      aiAccuracy: 94.2 + (Math.random() * 2 - 1) // Slight variation
    },
    charts: {
      revenue: {
        labels: multiplier.labels,
        data: multiplier.labels.map(() => Math.floor(Math.random() * 100000 * multiplier.base + 400000))
      },
      transportMode: {
        labels: ['Sea Freight', 'Air Freight', 'Road Transport', 'Rail Transport'],
        data: [
          Math.floor(532 * multiplier.base),
          Math.floor(398 * multiplier.base),
          Math.floor(251 * multiplier.base),
          Math.floor(66 * multiplier.base)
        ]
      },
      performance: {
        labels: ['On Time', 'Early', 'Delayed', 'In Transit'],
        data: [
          Math.floor(891 * multiplier.base),
          Math.floor(255 * multiplier.base),
          Math.floor(89 * multiplier.base),
          Math.floor(12 * multiplier.base)
        ]
      }
    }
  }
}

const refreshData = async () => {
  await updateCharts()
}

onMounted(() => {
  nextTick(() => {
    createLineChart()
    createPieChart()
    createBarChart()
  })
})
</script>

<style scoped>
/* Custom chart styling */
canvas {
  background: transparent;
}
</style>