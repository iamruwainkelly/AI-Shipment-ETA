<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
        <p class="text-gray-400">Comprehensive analytics and automated report generation</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Date Range Selector -->
        <select 
          v-model="selectedDateRange" 
          @change="updateAnalytics"
          class="bg-[#1e1e1e] border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 3 Months</option>
          <option value="1y">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
        
        <button 
          @click="refreshAnalytics" 
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <RefreshCw :class="{ 'animate-spin': loading }" class="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Report Generation Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div class="flex items-center mb-4">
          <div class="p-3 bg-blue-500/20 rounded-lg mr-4">
            <TrendingUp class="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Performance Report</h3>
            <p class="text-sm text-gray-400">Delivery performance and KPI analysis</p>
          </div>
        </div>
        <div class="space-y-3">
          <button 
            @click="generateReport('performance', 'pdf')"
            :disabled="generatingReport"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <FileText class="h-4 w-4" />
            <span>Generate PDF</span>
          </button>
          <button 
            @click="generateReport('performance', 'excel')"
            :disabled="generatingReport"
            class="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <Download class="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div class="flex items-center mb-4">
          <div class="p-3 bg-green-500/20 rounded-lg mr-4">
            <DollarSign class="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Financial Report</h3>
            <p class="text-sm text-gray-400">Revenue, costs and profit analysis</p>
          </div>
        </div>
        <div class="space-y-3">
          <button 
            @click="generateReport('financial', 'pdf')"
            :disabled="generatingReport"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <FileText class="h-4 w-4" />
            <span>Generate PDF</span>
          </button>
          <button 
            @click="generateReport('financial', 'excel')"
            :disabled="generatingReport"
            class="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <Download class="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div class="flex items-center mb-4">
          <div class="p-3 bg-purple-500/20 rounded-lg mr-4">
            <Settings class="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Operational Report</h3>
            <p class="text-sm text-gray-400">Operations efficiency and logistics</p>
          </div>
        </div>
        <div class="space-y-3">
          <button 
            @click="generateReport('operational', 'pdf')"
            :disabled="generatingReport"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <FileText class="h-4 w-4" />
            <span>Generate PDF</span>
          </button>
          <button 
            @click="generateReport('operational', 'excel')"
            :disabled="generatingReport"
            class="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <Download class="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Analytics Dashboard -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Cost Analysis -->
      <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <DollarSign class="h-5 w-5 mr-2 text-green-400" />
            Cost Analysis
          </h2>
        </div>
        <div class="h-80">
          <canvas ref="costChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- Route Performance -->
      <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <MapPin class="h-5 w-5 mr-2 text-blue-400" />
            Route Performance
          </h2>
        </div>
        <div class="h-80">
          <canvas ref="routeChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-semibold text-white mb-6 flex items-center">
        <BarChart3 class="h-5 w-5 mr-2 text-purple-400" />
        Key Performance Indicators
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-400 mb-2">{{ metrics.avgDeliveryTime }}</div>
          <div class="text-sm text-gray-400">Avg Delivery Time (days)</div>
          <div class="text-xs text-green-400 mt-1">↓ 2.1 days from last month</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-400 mb-2">{{ metrics.costPerKg }}</div>
          <div class="text-sm text-gray-400">Cost per Kg (ZAR)</div>
          <div class="text-xs text-red-400 mt-1">↑ R0.85 from last month</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-400 mb-2">{{ metrics.customerSatisfaction }}%</div>
          <div class="text-sm text-gray-400">Customer Satisfaction</div>
          <div class="text-xs text-green-400 mt-1">↗ +3.2% from last month</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-400 mb-2">{{ metrics.fuelEfficiency }}</div>
          <div class="text-sm text-gray-400">Fuel Efficiency (km/l)</div>
          <div class="text-xs text-green-400 mt-1">↗ +0.8 from last month</div>
        </div>
      </div>
    </div>

    <!-- Route Analysis Table -->
    <div class="bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-white flex items-center">
          <MapPin class="h-5 w-5 mr-2 text-blue-400" />
          Top Routes Analysis
        </h2>
        <button 
          @click="exportRouteData"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Download class="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="pb-3 text-gray-400 font-medium">Route</th>
              <th class="pb-3 text-gray-400 font-medium">Volume</th>
              <th class="pb-3 text-gray-400 font-medium">Avg Cost</th>
              <th class="pb-3 text-gray-400 font-medium">On-Time %</th>
              <th class="pb-3 text-gray-400 font-medium">Revenue</th>
              <th class="pb-3 text-gray-400 font-medium">Profit Margin</th>
            </tr>
          </thead>
          <tbody class="text-white">
            <tr v-for="route in topRoutes" :key="route.id" class="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors">
              <td class="py-4">
                <div class="flex items-center">
                  <MapPin class="h-4 w-4 text-gray-400 mr-2" />
                  {{ route.origin }} → {{ route.destination }}
                </div>
              </td>
              <td class="py-4">{{ formatNumber(route.volume) }} shipments</td>
              <td class="py-4">R{{ formatNumber(route.avgCost) }}</td>
              <td class="py-4">
                <div class="flex items-center">
                  <div class="w-12 bg-gray-700 rounded-full h-2 mr-2">
                    <div 
                      :class="getPerformanceColor(route.onTimePercentage)"
                      :style="{ width: route.onTimePercentage + '%' }" 
                      class="h-2 rounded-full"
                    ></div>
                  </div>
                  <span class="text-sm">{{ route.onTimePercentage }}%</span>
                </div>
              </td>
              <td class="py-4">R{{ formatNumber(route.revenue) }}</td>
              <td class="py-4">
                <span 
                  :class="getProfitMarginColor(route.profitMargin)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ route.profitMargin }}%
                </span>
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
  TrendingUp, 
  DollarSign, 
  Settings,
  FileText,
  Download,
  RefreshCw,
  BarChart3,
  MapPin
} from 'lucide-vue-next'
import Chart from 'chart.js/auto'

const loading = ref(false)
const generatingReport = ref(false)
const selectedDateRange = ref('30d')

// Charts
const costChart = ref(null)
const routeChart = ref(null)
let costChartInstance = null
let routeChartInstance = null

// Metrics
const metrics = reactive({
  avgDeliveryTime: 12.4,
  costPerKg: 125.60,
  customerSatisfaction: 94.2,
  fuelEfficiency: 8.7
})

// Sample route data
const topRoutes = ref([
  {
    id: 1,
    origin: 'Cape Town',
    destination: 'Hamburg',
    volume: 1247,
    avgCost: 15680,
    onTimePercentage: 92,
    revenue: 2450000,
    profitMargin: 23.5
  },
  {
    id: 2,
    origin: 'Durban',
    destination: 'Rotterdam',
    volume: 987,
    avgCost: 14200,
    onTimePercentage: 89,
    revenue: 1980000,
    profitMargin: 21.8
  },
  {
    id: 3,
    origin: 'Johannesburg',
    destination: 'Frankfurt',
    volume: 756,
    avgCost: 22450,
    onTimePercentage: 94,
    revenue: 2890000,
    profitMargin: 28.2
  },
  {
    id: 4,
    origin: 'Berlin',
    destination: 'Cape Town',
    volume: 654,
    avgCost: 16780,
    onTimePercentage: 86,
    revenue: 2150000,
    profitMargin: 19.5
  },
  {
    id: 5,
    origin: 'Amsterdam',
    destination: 'Johannesburg',
    volume: 543,
    avgCost: 25600,
    onTimePercentage: 91,
    revenue: 3250000,
    profitMargin: 31.2
  }
])

// Utility functions
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-ZA').format(num)
}

const getPerformanceColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-500'
  if (percentage >= 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getProfitMarginColor = (margin) => {
  if (margin >= 25) return 'bg-green-500/20 text-green-400'
  if (margin >= 15) return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-red-500/20 text-red-400'
}

// Chart creation functions
const createCostChart = () => {
  if (costChartInstance) {
    costChartInstance.destroy()
  }

  const ctx = costChart.value.getContext('2d')
  costChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Transport Costs (ZAR)',
          data: [145000, 152000, 148000, 156000, 151000, 149000],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Fuel Costs (ZAR)',
          data: [65000, 68000, 62000, 71000, 67000, 64000],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#9ca3af' }
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

const createRouteChart = () => {
  if (routeChartInstance) {
    routeChartInstance.destroy()
  }

  const ctx = routeChart.value.getContext('2d')
  routeChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['CPT-HAM', 'DBN-ROT', 'JHB-FRA', 'BER-CPT', 'AMS-JHB'],
      datasets: [{
        label: 'On-Time Performance (%)',
        data: [92, 89, 94, 86, 91],
        backgroundColor: [
          '#10b981',
          '#f59e0b', 
          '#10b981',
          '#ef4444',
          '#10b981'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { display: false }
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' },
          min: 0,
          max: 100
        }
      }
    }
  })
}

const generateReport = async (type, format) => {
  generatingReport.value = true
  try {
    console.log(`Generating ${type} report in ${format} format...`)
    
    if (format === 'pdf') {
      await generatePDFReport(type)
    } else if (format === 'excel') {
      await generateExcelReport(type)
    }
    
  } catch (error) {
    console.error('Failed to generate report:', error)
  } finally {
    generatingReport.value = false
  }
}

const generatePDFReport = async (type) => {
  // Import jsPDF dynamically
  const { jsPDF } = await import('jspdf')
  await import('jspdf-autotable')
  
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, 20, 20)
  
  // Date
  doc.setFontSize(10)
  doc.text(`Generated on ${new Date().toLocaleDateString('en-ZA')}`, 20, 30)
  
  if (type === 'performance') {
    // Performance Report Content
    doc.setFontSize(14)
    doc.text('Key Performance Indicators', 20, 50)
    
    const performanceData = [
      ['Metric', 'Value', 'Change'],
      ['Average Delivery Time', `${metrics.avgDeliveryTime} days`, '-2.1 days'],
      ['Customer Satisfaction', `${metrics.customerSatisfaction}%`, '+3.2%'],
      ['On-Time Delivery Rate', '94.2%', '+1.5%'],
      ['Cost Efficiency', '87.3%', '+4.1%']
    ]
    
    doc.autoTable({
      head: [performanceData[0]],
      body: performanceData.slice(1),
      startY: 60,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    })
    
    // Route Performance
    doc.setFontSize(14)
    doc.text('Top Routes Performance', 20, doc.lastAutoTable.finalY + 20)
    
    const routeData = topRoutes.value.map(route => [
      `${route.origin} → ${route.destination}`,
      formatNumber(route.volume),
      `R${formatNumber(route.avgCost)}`,
      `${route.onTimePercentage}%`,
      `R${formatNumber(route.revenue)}`
    ])
    
    doc.autoTable({
      head: [['Route', 'Volume', 'Avg Cost', 'On-Time %', 'Revenue']],
      body: routeData,
      startY: doc.lastAutoTable.finalY + 30,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }
    })
  } else if (type === 'financial') {
    // Financial Report Content
    doc.setFontSize(14)
    doc.text('Financial Summary', 20, 50)
    
    const financialData = [
      ['Metric', 'Current Month', 'Previous Month', 'Change'],
      ['Total Revenue', 'R12,450,000', 'R11,890,000', '+4.7%'],
      ['Operating Costs', 'R8,340,000', 'R8,210,000', '+1.6%'],
      ['Gross Profit', 'R4,110,000', 'R3,680,000', '+11.7%'],
      ['Profit Margin', '33.0%', '31.0%', '+2.0%']
    ]
    
    doc.autoTable({
      head: [financialData[0]],
      body: financialData.slice(1),
      startY: 60,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] }
    })
  } else if (type === 'operational') {
    // Operational Report Content
    doc.setFontSize(14)
    doc.text('Operational Metrics', 20, 50)
    
    const operationalData = [
      ['Metric', 'Current', 'Target', 'Status'],
      ['Fleet Utilization', '87.2%', '85.0%', 'Above Target'],
      ['Fuel Efficiency', `${metrics.fuelEfficiency} km/l`, '8.5 km/l', 'On Target'],
      ['Driver Satisfaction', '4.6/5', '4.5/5', 'Above Target'],
      ['Vehicle Maintenance', '98.1%', '95.0%', 'Excellent']
    ]
    
    doc.autoTable({
      head: [operationalData[0]],
      body: operationalData.slice(1),
      startY: 60,
      theme: 'striped',
      headStyles: { fillColor: [168, 85, 247] }
    })
  }
  
  doc.save(`${type}_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

const generateExcelReport = async (type) => {
  const XLSX = await import('xlsx')
  const { saveAs } = await import('file-saver')
  
  const workbook = XLSX.utils.book_new()
  
  if (type === 'performance') {
    // Performance metrics sheet
    const performanceData = [
      ['Metric', 'Value', 'Change', 'Trend'],
      ['Average Delivery Time', `${metrics.avgDeliveryTime} days`, '-2.1 days', 'Improving'],
      ['Customer Satisfaction', `${metrics.customerSatisfaction}%`, '+3.2%', 'Improving'],
      ['On-Time Delivery Rate', '94.2%', '+1.5%', 'Improving'],
      ['Cost Efficiency', '87.3%', '+4.1%', 'Improving']
    ]
    
    const performanceSheet = XLSX.utils.aoa_to_sheet(performanceData)
    XLSX.utils.book_append_sheet(workbook, performanceSheet, 'Performance KPIs')
    
    // Routes data sheet
    const routesData = [
      ['Route', 'Origin', 'Destination', 'Volume', 'Avg Cost', 'On-Time %', 'Revenue', 'Profit Margin'],
      ...topRoutes.value.map(route => [
        `${route.origin} → ${route.destination}`,
        route.origin,
        route.destination,
        route.volume,
        route.avgCost,
        route.onTimePercentage,
        route.revenue,
        route.profitMargin
      ])
    ]
    
    const routesSheet = XLSX.utils.aoa_to_sheet(routesData)
    XLSX.utils.book_append_sheet(workbook, routesSheet, 'Routes Performance')
  } else if (type === 'financial') {
    // Financial data
    const financialData = [
      ['Metric', 'Current Month', 'Previous Month', 'Change %', 'YTD'],
      ['Total Revenue', 12450000, 11890000, 4.7, 125600000],
      ['Operating Costs', 8340000, 8210000, 1.6, 89500000],
      ['Gross Profit', 4110000, 3680000, 11.7, 36100000],
      ['Profit Margin', 33.0, 31.0, 6.5, 28.7]
    ]
    
    const financialSheet = XLSX.utils.aoa_to_sheet(financialData)
    XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Summary')
  } else if (type === 'operational') {
    // Operational data
    const operationalData = [
      ['Metric', 'Current', 'Target', 'Achievement %', 'Status'],
      ['Fleet Utilization', 87.2, 85.0, 102.6, 'Above Target'],
      ['Fuel Efficiency', metrics.fuelEfficiency, 8.5, 102.4, 'On Target'],
      ['Driver Satisfaction', 4.6, 4.5, 102.2, 'Above Target'],
      ['Vehicle Maintenance', 98.1, 95.0, 103.3, 'Excellent']
    ]
    
    const operationalSheet = XLSX.utils.aoa_to_sheet(operationalData)
    XLSX.utils.book_append_sheet(workbook, operationalSheet, 'Operational Metrics')
  }
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${type}_report_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const exportRouteData = async () => {
  try {
    const { saveAs } = await import('file-saver')
    
    const csvData = [
      ['Route', 'Origin', 'Destination', 'Volume', 'Avg Cost', 'On-Time %', 'Revenue', 'Profit Margin'],
      ...topRoutes.value.map(route => [
        `${route.origin} → ${route.destination}`,
        route.origin,
        route.destination,
        route.volume,
        route.avgCost,
        route.onTimePercentage,
        route.revenue,
        route.profitMargin
      ])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `route_analysis_${new Date().toISOString().split('T')[0]}.csv`)
  } catch (error) {
    console.error('Failed to export route data:', error)
  }
}

const updateAnalytics = () => {
  nextTick(() => {
    createCostChart()
    createRouteChart()
  })
}

const refreshAnalytics = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    updateAnalytics()
  } catch (error) {
    console.error('Failed to refresh analytics:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    createCostChart()
    createRouteChart()
  })
})
</script>

<style scoped>
/* Custom styling for analytics */
canvas {
  background: transparent;
}

.report-card {
  transition: all 0.3s ease;
}

.report-card:hover {
  transform: translateY(-2px);
}
</style>
