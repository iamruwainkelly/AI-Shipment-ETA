import { defineStore } from 'pinia'
import api from '../services/api'

export const useShipmentsStore = defineStore('shipments', {
  state: () => ({
    shipments: [],
    currentShipment: null,
    loading: false,
    error: null,
    metrics: {},
    filters: {
      status: '',
      transport_mode: '',
      region: '',
      risk_level: ''
    }
  }),

  getters: {
    getShipmentById: (state) => (id) => {
      return state.shipments.find(shipment => shipment.id === id)
    },
    totalShipments: (state) => state.shipments.length,
    inTransitShipments: (state) => state.shipments.filter(shipment => shipment.status === 'in_transit').length,
    deliveredShipments: (state) => state.shipments.filter(shipment => shipment.status === 'delivered').length,
    delayedShipments: (state) => state.shipments.filter(shipment => shipment.status === 'delayed').length,
    totalValue: (state) => {
      return state.shipments.reduce((acc, shipment) => acc + (shipment.total_cost || 0), 0)
    },
    averageWeight: (state) => {
      if (state.shipments.length === 0) return 0
      const sum = state.shipments.reduce((acc, shipment) => acc + (shipment.weight || 0), 0)
      return (sum / state.shipments.length).toFixed(2)
    },
    onTimeDeliveryRate: (state) => {
      const completed = state.shipments.filter(s => s.status === 'delivered' || s.status === 'delayed')
      if (completed.length === 0) return 0
      const onTime = completed.filter(s => s.status === 'delivered').length
      return ((onTime / completed.length) * 100).toFixed(1)
    },
    shipmentsByStatus: (state) => {
      const statuses = {}
      state.shipments.forEach(shipment => {
        const status = shipment.status || 'unknown'
        statuses[status] = (statuses[status] || 0) + 1
      })
      return statuses
    },
    shipmentsByTransportMode: (state) => {
      const modes = {}
      state.shipments.forEach(shipment => {
        const mode = shipment.transport_mode || 'unknown'
        modes[mode] = (modes[mode] || 0) + 1
      })
      return modes
    },
    recentShipments: (state) => {
      return [...state.shipments]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)
    },
    riskAnalysis: (state) => {
      const shipments = state.shipments.filter(shipment => shipment.status === 'in_transit')
      const lowRisk = shipments.filter(shipment => shipment.risk_level === 'low').length
      const mediumRisk = shipments.filter(shipment => shipment.risk_level === 'medium').length
      const highRisk = shipments.filter(shipment => shipment.risk_level === 'high').length
      
      return {
        low: lowRisk,
        medium: mediumRisk,
        high: highRisk,
        total: shipments.length
      }
    },
    filteredShipments: (state) => {
      let filtered = [...state.shipments]
      
      if (state.filters.status) {
        filtered = filtered.filter(s => s.status === state.filters.status)
      }
      if (state.filters.transport_mode) {
        filtered = filtered.filter(s => s.transport_mode === state.filters.transport_mode)
      }
      if (state.filters.region) {
        filtered = filtered.filter(s => s.origin_region === state.filters.region || s.destination_region === state.filters.region)
      }
      if (state.filters.risk_level) {
        filtered = filtered.filter(s => s.risk_level === state.filters.risk_level)
      }
      
      return filtered
    }
  },

  actions: {
    async fetchShipments() {
      this.loading = true
      this.error = null
      try {
        this.shipments = await api.shipments.getAll()
      } catch (error) {
        this.error = error.message
        // Enhanced mock data fallback
        this.shipments = [
          {
            id: 1,
            tracking_number: 'TRK001234567',
            client_id: 1,
            client_name: 'TechCorp Industries',
            vendor_id: 1,
            vendor_name: 'Pacific Logistics Corp',
            origin: 'San Francisco, CA',
            destination: 'New York, NY',
            origin_region: 'West Coast',
            destination_region: 'East Coast',
            status: 'in_transit',
            transport_mode: 'air',
            estimated_delivery: '2025-01-15T14:00:00',
            actual_delivery: null,
            weight: 45.2,
            dimensions: { length: 120, width: 80, height: 60 },
            total_cost: 1250.00,
            cost_breakdown: {
              base_cost: 850.00,
              weight_factor: 200.00,
              special_services: 200.00
            },
            special_services: ['temperature_controlled', 'expedited_delivery'],
            risk_level: 'low',
            progress: 65,
            temperature_controlled: true,
            fragile: false,
            created_at: '2025-01-10T08:30:00',
            updated_at: '2025-01-12T15:45:00'
          },
          {
            id: 2,
            tracking_number: 'TRK001234568',
            client_id: 2,
            client_name: 'Global Retail Solutions',
            vendor_id: 2,
            vendor_name: 'Global Freight Solutions',
            origin: 'Chicago, IL',
            destination: 'Los Angeles, CA',
            origin_region: 'Midwest',
            destination_region: 'West Coast',
            status: 'delivered',
            transport_mode: 'road',
            estimated_delivery: '2025-01-08T16:00:00',
            actual_delivery: '2025-01-08T14:30:00',
            weight: 230.5,
            dimensions: { length: 200, width: 150, height: 100 },
            total_cost: 850.00,
            cost_breakdown: {
              base_cost: 600.00,
              weight_factor: 150.00,
              special_services: 100.00
            },
            special_services: ['bulk_cargo'],
            risk_level: 'low',
            progress: 100,
            temperature_controlled: false,
            fragile: true,
            created_at: '2025-01-05T10:15:00',
            updated_at: '2025-01-08T14:30:00'
          },
          {
            id: 3,
            tracking_number: 'TRK001234569',
            client_id: 3,
            client_name: 'MedSupply International',
            vendor_id: 3,
            vendor_name: 'Express Maritime Ltd',
            origin: 'Boston, MA',
            destination: 'Miami, FL',
            origin_region: 'Northeast',
            destination_region: 'Southeast',
            status: 'in_transit',
            transport_mode: 'air',
            estimated_delivery: '2025-01-16T10:00:00',
            actual_delivery: null,
            weight: 15.8,
            dimensions: { length: 60, width: 40, height: 30 },
            total_cost: 2100.00,
            cost_breakdown: {
              base_cost: 1200.00,
              weight_factor: 300.00,
              special_services: 600.00
            },
            special_services: ['temperature_controlled', 'hazmat_certified', 'expedited_delivery'],
            risk_level: 'medium',
            progress: 25,
            temperature_controlled: true,
            fragile: true,
            created_at: '2025-01-12T09:00:00',
            updated_at: '2025-01-12T16:20:00'
          },
          {
            id: 4,
            tracking_number: 'TRK001234570',
            client_id: 4,
            client_name: 'EuroManufacturing Ltd',
            vendor_id: 3,
            vendor_name: 'Express Maritime Ltd',
            origin: 'Birmingham, UK',
            destination: 'Hamburg, Germany',
            origin_region: 'Europe',
            destination_region: 'Europe',
            status: 'delayed',
            transport_mode: 'sea',
            estimated_delivery: '2025-01-12T18:00:00',
            actual_delivery: null,
            weight: 1250.0,
            dimensions: { length: 600, width: 300, height: 250 },
            total_cost: 3200.00,
            cost_breakdown: {
              base_cost: 2000.00,
              weight_factor: 800.00,
              special_services: 400.00
            },
            special_services: ['oversized_cargo', 'bulk_cargo'],
            risk_level: 'high',
            progress: 80,
            temperature_controlled: false,
            fragile: false,
            created_at: '2025-01-01T12:00:00',
            updated_at: '2025-01-12T09:15:00'
          },
          {
            id: 5,
            tracking_number: 'TRK001234571',
            client_id: 5,
            client_name: 'Pacific Electronics Co',
            vendor_id: 5,
            vendor_name: 'AirCargo Express',
            origin: 'Tokyo, Japan',
            destination: 'Seattle, WA',
            origin_region: 'Asia-Pacific',
            destination_region: 'West Coast',
            status: 'in_transit',
            transport_mode: 'air',
            estimated_delivery: '2025-01-14T12:00:00',
            actual_delivery: null,
            weight: 85.3,
            dimensions: { length: 150, width: 100, height: 80 },
            total_cost: 1850.00,
            cost_breakdown: {
              base_cost: 1200.00,
              weight_factor: 350.00,
              special_services: 300.00
            },
            special_services: ['fragile_handling', 'anti_static'],
            risk_level: 'medium',
            progress: 45,
            temperature_controlled: false,
            fragile: true,
            created_at: '2025-01-11T14:30:00',
            updated_at: '2025-01-12T11:45:00'
          },
          {
            id: 6,
            tracking_number: 'TRK001234572',
            client_id: 6,
            client_name: 'AgroExports Brazil',
            vendor_id: 3,
            vendor_name: 'Express Maritime Ltd',
            origin: 'São Paulo, Brazil',
            destination: 'Rotterdam, Netherlands',
            origin_region: 'South America',
            destination_region: 'Europe',
            status: 'pending',
            transport_mode: 'sea',
            estimated_delivery: '2025-02-05T08:00:00',
            actual_delivery: null,
            weight: 2500.0,
            dimensions: { length: 1200, width: 240, height: 260 },
            total_cost: 4500.00,
            cost_breakdown: {
              base_cost: 3000.00,
              weight_factor: 1000.00,
              special_services: 500.00
            },
            special_services: ['temperature_controlled', 'organic_certified'],
            risk_level: 'low',
            progress: 5,
            temperature_controlled: true,
            fragile: false,
            created_at: '2025-01-12T16:00:00',
            updated_at: '2025-01-12T16:00:00'
          },
          {
            id: 7,
            tracking_number: 'TRK001234573',
            client_id: 7,
            client_name: 'StartupTech Innovations',
            vendor_id: 4,
            vendor_name: 'Regional Road Networks',
            origin: 'Austin, TX',
            destination: 'Dallas, TX',
            origin_region: 'Southwest',
            destination_region: 'Southwest',
            status: 'delivered',
            transport_mode: 'road',
            estimated_delivery: '2025-01-10T17:00:00',
            actual_delivery: '2025-01-10T15:30:00',
            weight: 12.5,
            dimensions: { length: 50, width: 40, height: 25 },
            total_cost: 180.00,
            cost_breakdown: {
              base_cost: 120.00,
              weight_factor: 30.00,
              special_services: 30.00
            },
            special_services: ['expedited_delivery'],
            risk_level: 'low',
            progress: 100,
            temperature_controlled: false,
            fragile: false,
            created_at: '2025-01-09T13:20:00',
            updated_at: '2025-01-10T15:30:00'
          },
          {
            id: 8,
            tracking_number: 'TRK001234574',
            client_id: 8,
            client_name: 'Fashion Forward LLC',
            vendor_id: 5,
            vendor_name: 'AirCargo Express',
            origin: 'New York, NY',
            destination: 'Milan, Italy',
            origin_region: 'Northeast',
            destination_region: 'Europe',
            status: 'in_transit',
            transport_mode: 'air',
            estimated_delivery: '2025-01-17T20:00:00',
            actual_delivery: null,
            weight: 95.7,
            dimensions: { length: 180, width: 120, height: 90 },
            total_cost: 2250.00,
            cost_breakdown: {
              base_cost: 1500.00,
              weight_factor: 400.00,
              special_services: 350.00
            },
            special_services: ['fragile_handling', 'expedited_delivery'],
            risk_level: 'medium',
            progress: 35,
            temperature_controlled: false,
            fragile: true,
            created_at: '2025-01-13T10:45:00',
            updated_at: '2025-01-13T18:30:00'
          }
        ]
      } finally {
        this.loading = false
      }
    },

    setFilter(key, value) {
      this.filters[key] = value
    },

    clearFilters() {
      this.filters = {
        status: '',
        transport_mode: '',
        region: '',
        risk_level: ''
      }
    },

    async createShipment(shipmentData) {
      this.loading = true
      this.error = null
      try {
        const newShipment = await api.shipments.create(shipmentData)
        this.shipments.push(newShipment)
        return newShipment
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateShipment(id, shipmentData) {
      this.loading = true
      this.error = null
      try {
        const updatedShipment = await api.shipments.update(id, shipmentData)
        const index = this.shipments.findIndex(shipment => shipment.id === id)
        if (index !== -1) {
          this.shipments[index] = updatedShipment
        }
        return updatedShipment
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteShipment(id) {
      this.loading = true
      this.error = null
      try {
        await api.shipments.delete(id)
        this.shipments = this.shipments.filter(shipment => shipment.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    calculateShipmentCost(weight, dimensions, services = []) {
      let baseCost = 100
      
      // Weight factor
      const weightFactor = weight * 2.5
      
      // Volume factor
      const volume = (dimensions.length * dimensions.width * dimensions.height) / 1000000 // Convert to cubic meters
      const volumeFactor = volume * 50
      
      // Service costs
      const servicesCost = services.reduce((acc, service) => {
        const serviceCosts = {
          'temperature_controlled': 150,
          'expedited_delivery': 200,
          'fragile_handling': 100,
          'hazmat_certified': 300,
          'oversized_cargo': 250,
          'bulk_cargo': 50,
          'anti_static': 75,
          'organic_certified': 80
        }
        return acc + (serviceCosts[service] || 0)
      }, 0)
      
      const totalCost = baseCost + weightFactor + volumeFactor + servicesCost
      
      return {
        base_cost: baseCost,
        weight_factor: weightFactor,
        volume_factor: volumeFactor,
        special_services: servicesCost,
        total_cost: totalCost
      }
    },

    updateShipmentPrediction(shipmentId, prediction) {
      const shipment = this.shipments.find(s => s.id === shipmentId)
      if (shipment) {
        shipment.ai_prediction = {
          predicted_eta: prediction.predictedETA,
          confidence: prediction.confidence,
          factors: prediction.factors,
          risk_level: prediction.riskLevel,
          recommendations: prediction.recommendations,
          updated_at: new Date().toISOString()
        }
        
        // Update estimated delivery if we have a better prediction
        if (prediction.predictedETA) {
          shipment.estimated_delivery = prediction.predictedETA
        }
      }
    }
  }
})