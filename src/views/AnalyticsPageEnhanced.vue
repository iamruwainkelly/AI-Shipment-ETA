<template>
  <div class="analytics-page-enhanced">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Comprehensive insights into business performance and trends</p>
    </div>

    <!-- Key Performance Indicators -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Package class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Shipments</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ shipmentsStore.totalShipments }}</p>
            <p class="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <DollarSign class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ formatNumber(totalRevenue) }}</p>
            <p class="text-xs text-green-600 dark:text-green-400">+8% from last month</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <Clock class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">On-Time Delivery</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ shipmentsStore.onTimeDeliveryRate }}%</p>
            <p class="text-xs text-green-600 dark:text-green-400">+3% from last month</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Users class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Clients</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ clientsStore.activeClients }}</p>
            <p class="text-xs text-green-600 dark:text-green-400">+5% from last month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Revenue Trend Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp class="h-5 w-5 mr-2" />
          Revenue Trend
        </h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
          <canvas ref="revenueChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- Shipment Status Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <PieChart class="h-5 w-5 mr-2" />
          Shipment Status Distribution
        </h3>
        <div class="h-64">
          <canvas ref="statusChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <!-- Performance Metrics Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Transport Mode Analysis -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Truck class="h-5 w-5 mr-2" />
          Transport Mode Usage
        </h3>
        <div class="space-y-4">
          <div v-for="(count, mode) in shipmentsStore.shipmentsByTransportMode" :key="mode" class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3"
                   :class="{
                     'bg-blue-500': mode === 'air',
                     'bg-green-500': mode === 'road',
                     'bg-purple-500': mode === 'sea',
                     'bg-yellow-500': mode === 'rail'
                   }"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400 capitalize">{{ mode }}</span>
            </div>
            <div class="flex items-center">
              <div class="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-3">
                <div class="h-2 rounded-full"
                     :class="{
                       'bg-blue-500': mode === 'air',
                       'bg-green-500': mode === 'road',
                       'bg-purple-500': mode === 'sea',
                       'bg-yellow-500': mode === 'rail'
                     }"
                     :style="{ width: (count / shipmentsStore.totalShipments * 100) + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performing Vendors -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Award class="h-5 w-5 mr-2" />
          Top Vendors
        </h3>
        <div class="space-y-3">
          <div v-for="(vendor, index) in vendorsStore.topPerformingVendors" :key="vendor.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ vendor.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ vendor.reliability_score * 100 }}% reliable</p>
              </div>
            </div>
            <div class="flex items-center">
              <Star class="h-4 w-4 text-yellow-400 mr-1" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ vendor.performance_rating }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk Assessment -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <AlertTriangle class="h-5 w-5 mr-2" />
          Risk Assessment
        </h3>
        <div class="space-y-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ riskScore }}/100</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Overall Risk Score</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Low Risk</span>
              <span class="text-green-600 dark:text-green-400">{{ combinedRiskAnalysis.low }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Medium Risk</span>
              <span class="text-yellow-600 dark:text-yellow-400">{{ combinedRiskAnalysis.medium }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">High Risk</span>
              <span class="text-red-600 dark:text-red-400">{{ combinedRiskAnalysis.high }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Regional Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Client Distribution by Industry -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Building class="h-5 w-5 mr-2" />
          Client Distribution by Industry
        </h3>
        <div class="space-y-3">
          <div v-for="(clients, industry) in clientsStore.clientsByIndustry" :key="industry" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ industry }}</span>
            <div class="flex items-center">
              <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                <div class="h-2 bg-blue-500 rounded-full" :style="{ width: (clients.length / clientsStore.totalClients * 100) + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ clients.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trends -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar class="h-5 w-5 mr-2" />
          Monthly Performance Trends
        </h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded">
              <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ formatNumber(monthlyShipments) }}</div>
              <div class="text-xs text-blue-600 dark:text-blue-400">This Month</div>
            </div>
            <div class="text-center p-3 bg-green-50 dark:bg-green-900 rounded">
              <div class="text-lg font-semibold text-green-600 dark:text-green-400">{{ formatNumber(monthlyRevenue) }}</div>
              <div class="text-xs text-green-600 dark:text-green-400">Revenue</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-purple-50 dark:bg-purple-900 rounded">
              <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">{{ averageDeliveryTime }}d</div>
              <div class="text-xs text-purple-600 dark:text-purple-400">Avg Delivery</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 dark:bg-yellow-900 rounded">
              <div class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{{ customerSatisfaction }}%</div>
              <div class="text-xs text-yellow-600 dark:text-yellow-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Analytics Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <div class="flex space-x-2">
            <select v-model="activityFilter" class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">All Activities</option>
              <option value="shipment">Shipments</option>
              <option value="client">Clients</option>
              <option value="vendor">Vendors</option>
            </select>
            <button @click="exportAnalytics" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center">
              <Download class="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Activity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Entity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="activity in filteredActivities" :key="activity.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="p-2 rounded-full mr-3"
                       :class="{
                         'bg-blue-100 dark:bg-blue-900': activity.type === 'shipment',
                         'bg-green-100 dark:bg-green-900': activity.type === 'client',
                         'bg-purple-100 dark:bg-purple-900': activity.type === 'vendor'
                       }">
                    <Package v-if="activity.type === 'shipment'" class="h-4 w-4" :class="{
                      'text-blue-600 dark:text-blue-400': activity.type === 'shipment'
                    }" />
                    <Users v-else-if="activity.type === 'client'" class="h-4 w-4" :class="{
                      'text-green-600 dark:text-green-400': activity.type === 'client'
                    }" />
                    <Truck v-else class="h-4 w-4" :class="{
                      'text-purple-600 dark:text-purple-400': activity.type === 'vendor'
                    }" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.action }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ activity.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ activity.entity }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': activity.status === 'completed',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': activity.status === 'pending',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': activity.status === 'in_progress',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': activity.status === 'failed'
                      }">
                  {{ activity.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ activity.value ? '$' + formatNumber(activity.value) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(activity.date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Export Reports Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FileText class="h-5 w-5 mr-2" />
        Generate Reports
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button @click="generateReport('performance')" class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          <BarChart class="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <div class="text-sm font-medium text-gray-900 dark:text-white">Performance Report</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Detailed performance metrics</div>
        </button>
        <button @click="generateReport('financial')" class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors">
          <DollarSign class="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <div class="text-sm font-medium text-gray-900 dark:text-white">Financial Report</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Revenue and cost analysis</div>
        </button>
        <button @click="generateReport('operational')" class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
          <Activity class="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <div class="text-sm font-medium text-gray-900 dark:text-white">Operational Report</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Operational efficiency metrics</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useClientsStore } from '../stores/clients'
import { useVendorsStore } from '../stores/vendors'
import { useShipmentsStore } from '../stores/shipments'
import { 
  Package, DollarSign, Clock, Users, TrendingUp, PieChart, Truck, Award, 
  AlertTriangle, Building, Calendar, Download, FileText, BarChart, Activity,
  Star
} from 'lucide-vue-next'

export default {
  name: 'AnalyticsPageEnhanced',
  components: {
    Package, DollarSign, Clock, Users, TrendingUp, PieChart, Truck, Award, 
    AlertTriangle, Building, Calendar, Download, FileText, BarChart, Activity,
    Star
  },
  setup() {
    const clientsStore = useClientsStore()
    const vendorsStore = useVendorsStore()
    const shipmentsStore = useShipmentsStore()
    
    const activityFilter = ref('')
    const revenueChart = ref(null)
    const statusChart = ref(null)

    // Mock activity data
    const activities = ref([
      {
        id: 1,
        type: 'shipment',
        action: 'Shipment Created',
        description: 'New shipment TRK001234567',
        entity: 'TechCorp Industries',
        status: 'in_progress',
        value: 1250,
        date: '2025-01-12T14:30:00'
      },
      {
        id: 2,
        type: 'client',
        action: 'Client Onboarded',
        description: 'New enterprise client',
        entity: 'Fashion Forward LLC',
        status: 'completed',
        value: 650000,
        date: '2025-01-12T10:15:00'
      },
      {
        id: 3,
        type: 'shipment',
        action: 'Shipment Delivered',
        description: 'Successful delivery',
        entity: 'Global Retail Solutions',
        status: 'completed',
        value: 850,
        date: '2025-01-11T16:45:00'
      },
      {
        id: 4,
        type: 'vendor',
        action: 'Vendor Performance Review',
        description: 'Monthly assessment',
        entity: 'Pacific Logistics Corp',
        status: 'completed',
        value: null,
        date: '2025-01-10T09:00:00'
      },
      {
        id: 5,
        type: 'shipment',
        action: 'Shipment Delayed',
        description: 'Weather-related delay',
        entity: 'EuroManufacturing Ltd',
        status: 'pending',
        value: 3200,
        date: '2025-01-09T11:20:00'
      }
    ])

    // Computed properties
    const totalRevenue = computed(() => {
      return clientsStore.totalMonthlyRevenue + shipmentsStore.totalValue
    })

    const combinedRiskAnalysis = computed(() => {
      const clientRisk = clientsStore.riskAnalysis
      const shipmentRisk = shipmentsStore.riskAnalysis
      return {
        low: clientRisk.low + shipmentRisk.low,
        medium: clientRisk.medium + shipmentRisk.medium,
        high: clientRisk.high + shipmentRisk.high,
        total: clientRisk.total + shipmentRisk.total
      }
    })

    const riskScore = computed(() => {
      const risk = combinedRiskAnalysis.value
      if (risk.total === 0) return 100
      const highRiskWeight = 3
      const mediumRiskWeight = 2
      const lowRiskWeight = 1
      
      const weightedRisk = (risk.high * highRiskWeight + risk.medium * mediumRiskWeight + risk.low * lowRiskWeight)
      const maxPossibleRisk = risk.total * highRiskWeight
      
      return Math.round(100 - (weightedRisk / maxPossibleRisk) * 100)
    })

    const monthlyShipments = computed(() => {
      // Mock calculation - in real app would filter by current month
      return Math.round(shipmentsStore.totalShipments * 0.15)
    })

    const monthlyRevenue = computed(() => {
      // Mock calculation - in real app would filter by current month  
      return Math.round(totalRevenue.value * 0.12)
    })

    const averageDeliveryTime = computed(() => {
      // Mock calculation
      return 3.2
    })

    const customerSatisfaction = computed(() => {
      return Math.round(parseFloat(clientsStore.averageSatisfactionScore) * 20)
    })

    const filteredActivities = computed(() => {
      if (!activityFilter.value) return activities.value
      return activities.value.filter(activity => activity.type === activityFilter.value)
    })

    // Methods
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const initializeCharts = async () => {
      await nextTick()
      
      if (revenueChart.value) {
        const ctx = revenueChart.value.getContext('2d')
        // In a real app, you would use Chart.js here
        ctx.fillStyle = '#3B82F6'
        ctx.fillRect(10, 10, 100, 50)
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'
        ctx.fillText('Revenue Chart', 20, 35)
      }

      if (statusChart.value) {
        const ctx = statusChart.value.getContext('2d')
        // In a real app, you would use Chart.js here  
        ctx.fillStyle = '#10B981'
        ctx.fillRect(10, 10, 80, 40)
        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Arial'
        ctx.fillText('Status Chart', 15, 30)
      }
    }

    const exportAnalytics = () => {
      const data = {
        summary: {
          totalShipments: shipmentsStore.totalShipments,
          totalRevenue: totalRevenue.value,
          onTimeDelivery: shipmentsStore.onTimeDeliveryRate,
          activeClients: clientsStore.activeClients
        },
        activities: filteredActivities.value
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'analytics-export.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    const generateReport = (type) => {
      // Mock report generation
      const reportData = {
        type,
        generated: new Date().toISOString(),
        data: {
          performance: type === 'performance' ? {
            onTimeDelivery: shipmentsStore.onTimeDeliveryRate,
            customerSatisfaction: customerSatisfaction.value,
            vendorPerformance: vendorsStore.averagePerformanceRating
          } : null,
          financial: type === 'financial' ? {
            totalRevenue: totalRevenue.value,
            monthlyRevenue: monthlyRevenue.value,
            contractValue: clientsStore.totalContractValue
          } : null,
          operational: type === 'operational' ? {
            totalShipments: shipmentsStore.totalShipments,
            averageWeight: shipmentsStore.averageWeight,
            transportModes: shipmentsStore.shipmentsByTransportMode
          } : null
        }
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    // Lifecycle
    onMounted(async () => {
      await Promise.all([
        clientsStore.fetchClients(),
        vendorsStore.fetchVendors(),
        shipmentsStore.fetchShipments()
      ])
      
      initializeCharts()
    })

    return {
      // Stores
      clientsStore,
      vendorsStore,
      shipmentsStore,
      
      // Reactive data
      activityFilter,
      revenueChart,
      statusChart,
      
      // Computed
      totalRevenue,
      combinedRiskAnalysis,
      riskScore,
      monthlyShipments,
      monthlyRevenue,
      averageDeliveryTime,
      customerSatisfaction,
      filteredActivities,
      
      // Methods
      formatNumber,
      formatDate,
      exportAnalytics,
      generateReport
    }
  }
}
</script>