import { defineStore } from 'pinia'
import api from '../services/api'

export const useVendorsStore = defineStore('vendors', {
  state: () => ({
    vendors: [],
    currentVendor: null,
    topPerformers: [],
    loading: false,
    error: null,
    performanceMetrics: {}
  }),

  getters: {
    getVendorById: (state) => (id) => {
      return state.vendors.find(vendor => vendor.id === id)
    },
    totalVendors: (state) => state.vendors.length,
    activeVendors: (state) => state.vendors.filter(vendor => vendor.status === 'active').length,
    averageReliability: (state) => {
      if (state.vendors.length === 0) return 0
      const sum = state.vendors.reduce((acc, vendor) => acc + vendor.reliability_score, 0)
      return (sum / state.vendors.length).toFixed(2)
    },
    averagePerformanceRating: (state) => {
      if (state.vendors.length === 0) return 0
      const sum = state.vendors.reduce((acc, vendor) => acc + (vendor.performance_rating || 0), 0)
      return (sum / state.vendors.length).toFixed(1)
    },
    totalContractValue: (state) => {
      return state.vendors.reduce((acc, vendor) => acc + (vendor.contract_value || 0), 0)
    },
    totalMonthlyVolume: (state) => {
      return state.vendors.reduce((acc, vendor) => acc + (vendor.monthly_volume || 0), 0)
    },
    topPerformingVendors: (state) => {
      return [...state.vendors]
        .filter(vendor => vendor.status === 'active')
        .sort((a, b) => (b.performance_rating || 0) - (a.performance_rating || 0))
        .slice(0, 5)
    },
    vendorsByRegion: (state) => {
      const regions = {}
      state.vendors.forEach(vendor => {
        const vendorRegions = vendor.regions_covered.split(',').map(r => r.trim())
        vendorRegions.forEach(region => {
          if (!regions[region]) {
            regions[region] = []
          }
          regions[region].push(vendor)
        })
      })
      return regions
    },
    riskAnalysis: (state) => {
      const vendors = state.vendors.filter(vendor => vendor.status === 'active')
      const lowRisk = vendors.filter(vendor => vendor.risk_score <= 0.1).length
      const mediumRisk = vendors.filter(vendor => vendor.risk_score > 0.1 && vendor.risk_score <= 0.2).length
      const highRisk = vendors.filter(vendor => vendor.risk_score > 0.2).length
      
      return {
        low: lowRisk,
        medium: mediumRisk,
        high: highRisk,
        total: vendors.length
      }
    }
  },

  actions: {
    async fetchVendors() {
      this.loading = true
      this.error = null
      try {
        this.vendors = await api.vendors.getAll()
      } catch (error) {
        this.error = error.message
        // Enhanced mock data fallback
        this.vendors = [
          {
            id: 1,
            name: 'Pacific Logistics Corp',
            email: 'operations@pacificlogistics.com',
            phone: '+1-555-0456',
            reliability_score: 0.95,
            regions_covered: 'West Coast USA, Canada',
            transport_modes: 'road,air,sea',
            created_at: '2025-06-08T07:00:36',
            updated_at: null,
            performance_rating: 4.8,
            total_shipments: 1250,
            on_time_deliveries: 1188,
            average_cost: 485.50,
            specialized_services: ['temperature_controlled', 'fragile_handling'],
            certification_level: 'Premium',
            risk_score: 0.05,
            monthly_volume: 120,
            contract_value: 580000,
            status: 'active'
          },
          {
            id: 2,
            name: 'Global Freight Solutions',
            email: 'contact@globalfreight.com',
            phone: '+1-555-0789',
            reliability_score: 0.87,
            regions_covered: 'East Coast USA, Europe',
            transport_modes: 'road,air',
            created_at: '2025-05-15T09:30:15',
            updated_at: null,
            performance_rating: 4.5,
            total_shipments: 890,
            on_time_deliveries: 775,
            average_cost: 325.75,
            specialized_services: ['express_delivery', 'bulk_cargo'],
            certification_level: 'Standard',
            risk_score: 0.13,
            monthly_volume: 85,
            contract_value: 420000,
            status: 'active'
          },
          {
            id: 3,
            name: 'Express Maritime Ltd',
            email: 'shipping@expressmaritime.com',
            phone: '+1-555-0234',
            reliability_score: 0.92,
            regions_covered: 'Asia-Pacific, Australia',
            transport_modes: 'sea,air',
            created_at: '2025-04-20T14:45:22',
            updated_at: null,
            performance_rating: 4.7,
            total_shipments: 2100,
            on_time_deliveries: 1932,
            average_cost: 750.25,
            specialized_services: ['oversized_cargo', 'hazmat_certified'],
            certification_level: 'Premium',
            risk_score: 0.08,
            monthly_volume: 180,
            contract_value: 890000,
            status: 'active'
          },
          {
            id: 4,
            name: 'Regional Road Networks',
            email: 'dispatch@regionalroad.net',
            phone: '+1-555-0567',
            reliability_score: 0.81,
            regions_covered: 'Midwest USA',
            transport_modes: 'road',
            created_at: '2025-03-10T11:20:33',
            updated_at: null,
            performance_rating: 4.2,
            total_shipments: 650,
            on_time_deliveries: 527,
            average_cost: 195.80,
            specialized_services: ['same_day_delivery'],
            certification_level: 'Standard',
            risk_score: 0.19,
            monthly_volume: 55,
            contract_value: 185000,
            status: 'active'
          },
          {
            id: 5,
            name: 'AirCargo Express',
            email: 'operations@aircargo.express',
            phone: '+1-555-0891',
            reliability_score: 0.89,
            regions_covered: 'Global',
            transport_modes: 'air',
            created_at: '2025-02-05T16:15:44',
            updated_at: null,
            performance_rating: 4.6,
            total_shipments: 1450,
            on_time_deliveries: 1291,
            average_cost: 890.50,
            specialized_services: ['next_day_delivery', 'temperature_controlled'],
            certification_level: 'Premium',
            risk_score: 0.11,
            monthly_volume: 140,
            contract_value: 720000,
            status: 'active'
          },
          {
            id: 6,
            name: 'Metro Distribution Co',
            email: 'info@metrodist.com',
            phone: '+1-555-0345',
            reliability_score: 0.75,
            regions_covered: 'Metropolitan Areas',
            transport_modes: 'road',
            created_at: '2025-01-18T08:30:15',
            updated_at: null,
            performance_rating: 3.9,
            total_shipments: 420,
            on_time_deliveries: 315,
            average_cost: 145.30,
            specialized_services: ['local_delivery'],
            certification_level: 'Basic',
            risk_score: 0.25,
            monthly_volume: 35,
            contract_value: 95000,
            status: 'under_review'
          }
        ]
      } finally {
        this.loading = false
      }
    },

    async fetchTopPerformers() {
      this.loading = true
      this.error = null
      try {
        const response = await api.vendors.getTopPerformers()
        this.topPerformers = response.top_vendors
      } catch (error) {
        this.error = error.message
        this.topPerformers = this.vendors.slice(0, 5)
      } finally {
        this.loading = false
      }
    },

    async createVendor(vendorData) {
      this.loading = true
      this.error = null
      try {
        const newVendor = await api.vendors.create(vendorData)
        this.vendors.push(newVendor)
        return newVendor
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateVendor(id, vendorData) {
      this.loading = true
      this.error = null
      try {
        const updatedVendor = await api.vendors.update(id, vendorData)
        const index = this.vendors.findIndex(vendor => vendor.id === id)
        if (index !== -1) {
          this.vendors[index] = updatedVendor
        }
        return updatedVendor
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteVendor(id) {
      this.loading = true
      this.error = null
      try {
        await api.vendors.delete(id)
        this.vendors = this.vendors.filter(vendor => vendor.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
