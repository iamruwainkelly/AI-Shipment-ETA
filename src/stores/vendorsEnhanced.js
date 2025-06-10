import { defineStore } from 'pinia'
import api from '../services/api'

export const useVendorsEnhancedStore = defineStore('vendorsEnhanced', {
  state: () => ({
    vendors: [],
    currentVendor: null,
    loading: false,
    error: null,
    filters: {
      region: '',
      service_type: '',
      performance_tier: '',
      status: '',
      searchTerm: ''
    },
    sortBy: 'name',
    sortOrder: 'asc'
  }),

  getters: {
    getVendorById: (state) => (id) => {
      return state.vendors.find(vendor => vendor.id === id)
    },

    filteredVendors: (state) => {
      let filtered = [...state.vendors]

      // Apply filters
      if (state.filters.region) {
        filtered = filtered.filter(vendor => vendor.region === state.filters.region)
      }
      if (state.filters.service_type) {
        filtered = filtered.filter(vendor => vendor.service_type === state.filters.service_type)
      }
      if (state.filters.performance_tier) {
        filtered = filtered.filter(vendor => vendor.performance_tier === state.filters.performance_tier)
      }
      if (state.filters.status) {
        filtered = filtered.filter(vendor => vendor.status === state.filters.status)
      }
      if (state.filters.searchTerm) {
        const term = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(vendor => 
          vendor.name.toLowerCase().includes(term) ||
          vendor.email.toLowerCase().includes(term) ||
          vendor.company.toLowerCase().includes(term)
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue = a[state.sortBy]
        let bValue = b[state.sortBy]

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (state.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })

      return filtered
    },

    totalVendors: (state) => state.vendors.length,

    vendorsByRegion: (state) => {
      const regions = {}
      state.vendors.forEach(vendor => {
        const region = vendor.region || 'Unknown'
        regions[region] = (regions[region] || 0) + 1
      })
      return regions
    },

    vendorsByServiceType: (state) => {
      const types = {}
      state.vendors.forEach(vendor => {
        const type = vendor.service_type || 'General'
        types[type] = (types[type] || 0) + 1
      })
      return types
    },

    vendorsByPerformanceTier: (state) => {
      const tiers = {}
      state.vendors.forEach(vendor => {
        const tier = vendor.performance_tier || 'Standard'
        tiers[tier] = (tiers[tier] || 0) + 1
      })
      return tiers
    },

    averagePerformanceScore: (state) => {
      if (state.vendors.length === 0) return 0
      const total = state.vendors.reduce((sum, vendor) => sum + (vendor.performance_score || 0), 0)
      return (total / state.vendors.length).toFixed(1)
    },

    averageDeliveryTime: (state) => {
      if (state.vendors.length === 0) return 0
      const total = state.vendors.reduce((sum, vendor) => sum + (vendor.avg_delivery_time || 0), 0)
      return (total / state.vendors.length).toFixed(1)
    },

    activeVendorsCount: (state) => {
      return state.vendors.filter(vendor => vendor.status === 'active').length
    },

    topPerformingVendors: (state) => {
      return state.vendors
        .filter(vendor => vendor.performance_score >= 90)
        .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))
        .slice(0, 5)
    },

    totalShipmentsHandled: (state) => {
      return state.vendors.reduce((sum, vendor) => sum + (vendor.total_shipments || 0), 0)
    },

    averageCostPerKg: (state) => {
      if (state.vendors.length === 0) return 0
      const total = state.vendors.reduce((sum, vendor) => sum + (vendor.cost_per_kg || 0), 0)
      return (total / state.vendors.length).toFixed(2)
    }
  },

  actions: {
    async fetchVendors() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/vendors')
        this.vendors = response.data.map(vendor => ({
          ...vendor,
          performance_tier: this.getPerformanceTier(vendor.performance_score || 0),
          status: vendor.status || 'active',
          region: vendor.region || 'Unknown'
        }))
      } catch (error) {
        this.error = 'Failed to fetch vendors'
        console.error('Error fetching vendors:', error)
        // Use mock data if API fails
        this.loadMockData()
      } finally {
        this.loading = false
      }
    },

    getPerformanceTier(score) {
      if (score >= 95) return 'Excellent'
      if (score >= 85) return 'Good'
      if (score >= 70) return 'Average'
      return 'Below Average'
    },

    loadMockData() {
      this.vendors = [
        {
          id: 1,
          name: 'Swift Logistics',
          company: 'Swift Logistics Inc.',
          email: 'contact@swiftlogistics.com',
          phone: '+1-555-7001',
          region: 'North America',
          service_type: 'Express Delivery',
          performance_score: 94,
          performance_tier: 'Excellent',
          status: 'active',
          total_shipments: 2847,
          avg_delivery_time: 2.3,
          cost_per_kg: 8.50,
          on_time_rate: 96.2,
          damage_rate: 0.8,
          created_at: '2023-01-15',
          last_shipment: '2024-12-01'
        },
        {
          id: 2,
          name: 'Ocean Freight Co.',
          company: 'Ocean Freight Solutions',
          email: 'info@oceanfreight.com',
          phone: '+1-555-7002',
          region: 'Global',
          service_type: 'Sea Freight',
          performance_score: 87,
          performance_tier: 'Good',
          status: 'active',
          total_shipments: 1654,
          avg_delivery_time: 14.5,
          cost_per_kg: 2.30,
          on_time_rate: 89.4,
          damage_rate: 1.2,
          created_at: '2023-03-20',
          last_shipment: '2024-11-28'
        },
        {
          id: 3,
          name: 'Euro Express',
          company: 'European Express Network',
          email: 'service@euroexpress.eu',
          phone: '+49-30-77889900',
          region: 'Europe',
          service_type: 'Ground Transport',
          performance_score: 91,
          performance_tier: 'Excellent',
          status: 'active',
          total_shipments: 3421,
          avg_delivery_time: 1.8,
          cost_per_kg: 6.75,
          on_time_rate: 93.7,
          damage_rate: 0.5,
          created_at: '2022-11-10',
          last_shipment: '2024-12-02'
        },
        {
          id: 4,
          name: 'Asia Air Cargo',
          company: 'Asia Air Cargo Ltd.',
          email: 'operations@asiaair.com',
          phone: '+65-6-12345678',
          region: 'Asia',
          service_type: 'Air Freight',
          performance_score: 89,
          performance_tier: 'Good',
          status: 'active',
          total_shipments: 1967,
          avg_delivery_time: 3.2,
          cost_per_kg: 12.40,
          on_time_rate: 91.8,
          damage_rate: 0.9,
          created_at: '2023-06-01',
          last_shipment: '2024-11-25'
        },
        {
          id: 5,
          name: 'Global Rail Solutions',
          company: 'Global Rail Network',
          email: 'contact@globalrail.com',
          phone: '+1-555-7005',
          region: 'North America',
          service_type: 'Rail Transport',
          performance_score: 83,
          performance_tier: 'Good',
          status: 'active',
          total_shipments: 892,
          avg_delivery_time: 5.7,
          cost_per_kg: 3.20,
          on_time_rate: 87.3,
          damage_rate: 1.5,
          created_at: '2023-08-12',
          last_shipment: '2024-11-30'
        },
        {
          id: 6,
          name: 'Regional Courier',
          company: 'Regional Courier Services',
          email: 'info@regionalcourier.com',
          phone: '+61-2-98765432',
          region: 'Oceania',
          service_type: 'Local Delivery',
          performance_score: 78,
          performance_tier: 'Average',
          status: 'active',
          total_shipments: 1234,
          avg_delivery_time: 1.2,
          cost_per_kg: 9.80,
          on_time_rate: 82.1,
          damage_rate: 2.1,
          created_at: '2024-02-18',
          last_shipment: '2024-11-27'
        }
      ]
    },

    async createVendor(vendorData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/vendors', vendorData)
        this.vendors.push({
          ...response.data,
          performance_tier: this.getPerformanceTier(response.data.performance_score || 0)
        })
        return response.data
      } catch (error) {
        this.error = 'Failed to create vendor'
        console.error('Error creating vendor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateVendor(id, vendorData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/vendors/${id}`, vendorData)
        const index = this.vendors.findIndex(vendor => vendor.id === id)
        if (index !== -1) {
          this.vendors[index] = {
            ...response.data,
            performance_tier: this.getPerformanceTier(response.data.performance_score || 0)
          }
        }
        return response.data
      } catch (error) {
        this.error = 'Failed to update vendor'
        console.error('Error updating vendor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteVendor(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/vendors/${id}`)
        this.vendors = this.vendors.filter(vendor => vendor.id !== id)
      } catch (error) {
        this.error = 'Failed to delete vendor'
        console.error('Error deleting vendor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setFilter(key, value) {
      this.filters[key] = value
    },

    clearFilters() {
      this.filters = {
        region: '',
        service_type: '',
        performance_tier: '',
        status: '',
        searchTerm: ''
      }
    },

    setSorting(field, order = 'asc') {
      this.sortBy = field
      this.sortOrder = order
    },

    exportToCSV() {
      const headers = [
        'ID', 'Name', 'Company', 'Email', 'Phone', 'Region', 'Service Type',
        'Performance Score', 'Performance Tier', 'Status', 'Total Shipments',
        'Avg Delivery Time', 'Cost per Kg', 'On Time Rate', 'Damage Rate',
        'Created At', 'Last Shipment'
      ]

      const csvContent = [
        headers.join(','),
        ...this.filteredVendors.map(vendor => [
          vendor.id,
          `"${vendor.name}"`,
          `"${vendor.company}"`,
          vendor.email,
          vendor.phone,
          vendor.region,
          vendor.service_type,
          vendor.performance_score,
          vendor.performance_tier,
          vendor.status,
          vendor.total_shipments,
          vendor.avg_delivery_time,
          vendor.cost_per_kg,
          vendor.on_time_rate,
          vendor.damage_rate,
          vendor.created_at,
          vendor.last_shipment
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `vendors-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
})