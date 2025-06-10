import { defineStore } from 'pinia'
import api from '../services/api'

export const useClientsEnhancedStore = defineStore('clientsEnhanced', {
  state: () => ({
    clients: [],
    currentClient: null,
    loading: false,
    error: null,
    filters: {
      region: '',
      tier: '',
      status: '',
      searchTerm: ''
    },
    sortBy: 'name',
    sortOrder: 'asc'
  }),

  getters: {
    getClientById: (state) => (id) => {
      return state.clients.find(client => client.id === id)
    },

    filteredClients: (state) => {
      let filtered = [...state.clients]

      // Apply filters
      if (state.filters.region) {
        filtered = filtered.filter(client => client.region === state.filters.region)
      }
      if (state.filters.tier) {
        filtered = filtered.filter(client => client.tier === state.filters.tier)
      }
      if (state.filters.status) {
        filtered = filtered.filter(client => client.status === state.filters.status)
      }
      if (state.filters.searchTerm) {
        const term = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(client => 
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.company.toLowerCase().includes(term)
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

    totalClients: (state) => state.clients.length,

    clientsByRegion: (state) => {
      const regions = {}
      state.clients.forEach(client => {
        const region = client.region || 'Unknown'
        regions[region] = (regions[region] || 0) + 1
      })
      return regions
    },

    clientsByTier: (state) => {
      const tiers = {}
      state.clients.forEach(client => {
        const tier = client.tier || 'Standard'
        tiers[tier] = (tiers[tier] || 0) + 1
      })
      return tiers
    },

    averageMonthlyValue: (state) => {
      if (state.clients.length === 0) return 0
      const total = state.clients.reduce((sum, client) => sum + (client.monthly_value || 0), 0)
      return (total / state.clients.length).toFixed(2)
    },

    totalMonthlyRevenue: (state) => {
      return state.clients.reduce((sum, client) => sum + (client.monthly_value || 0), 0)
    },

    activeClientsCount: (state) => {
      return state.clients.filter(client => client.status === 'active').length
    },

    premiumClientsCount: (state) => {
      return state.clients.filter(client => client.tier === 'Premium').length
    },

    // Pricing calculations
    calculateShippingCost: () => (weight, mode, priority, dimensions) => {
      const baseCosts = {
        'air': 15.0,
        'sea': 3.0,
        'land': 2.5,
        'rail': 2.0
      }

      const priorityMultipliers = {
        'high': 1.8,
        'medium': 1.3,
        'low': 1.0
      }

      const baseRate = baseCosts[mode] || baseCosts['land']
      const priorityMultiplier = priorityMultipliers[priority] || 1.0
      
      // Volume calculation (L x W x H in cm, converted to cubic meters)
      const volume = dimensions ? 
        (dimensions.length * dimensions.width * dimensions.height) / 1000000 : 
        weight * 0.0001 // Estimate volume from weight

      // Use dimensional weight if it's higher than actual weight
      const dimensionalWeight = volume * 250 // 250kg per cubic meter
      const chargeableWeight = Math.max(weight, dimensionalWeight)

      const cost = chargeableWeight * baseRate * priorityMultiplier
      
      // Add fuel surcharge and handling fees
      const fuelSurcharge = cost * 0.15
      const handlingFee = Math.min(50, cost * 0.05)
      
      return cost + fuelSurcharge + handlingFee
    },

    getClientPricingTier: () => (monthlyValue) => {
      if (monthlyValue >= 10000) return 'Premium'
      if (monthlyValue >= 5000) return 'Business'
      if (monthlyValue >= 1000) return 'Standard'
      return 'Basic'
    }
  },

  actions: {
    async fetchClients() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/clients')
        this.clients = response.data.map(client => ({
          ...client,
          tier: this.getClientPricingTier(client.monthly_value || 0),
          status: client.status || 'active',
          region: client.region || 'Unknown',
          total_shipments: client.total_shipments || 0,
          monthly_value: client.monthly_value || 0,
          avg_package_weight: client.avg_package_weight || 0,
          preferred_transport: client.preferred_transport || 'land',
          satisfaction_score: client.satisfaction_score || 85
        }))
      } catch (error) {
        this.error = 'Failed to fetch clients'
        console.error('Error fetching clients:', error)
        // Use mock data if API fails
        this.loadMockData()
      } finally {
        this.loading = false
      }
    },

    loadMockData() {
      this.clients = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@techcorp.com',
          company: 'TechCorp Solutions',
          phone: '+1-555-0101',
          region: 'North America',
          tier: 'Premium',
          status: 'active',
          total_shipments: 156,
          monthly_value: 15420,
          avg_package_weight: 2.5,
          preferred_transport: 'air',
          satisfaction_score: 92,
          created_at: '2024-01-15',
          last_shipment: '2024-12-01'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.j@globalmart.com',
          company: 'GlobalMart Inc.',
          phone: '+1-555-0202',
          region: 'North America',
          tier: 'Business',
          status: 'active',
          total_shipments: 89,
          monthly_value: 8750,
          avg_package_weight: 4.2,
          preferred_transport: 'land',
          satisfaction_score: 88,
          created_at: '2024-02-20',
          last_shipment: '2024-11-28'
        },
        {
          id: 3,
          name: 'Hans Mueller',
          email: 'h.mueller@euroship.de',
          company: 'EuroShip GmbH',
          phone: '+49-30-12345678',
          region: 'Europe',
          tier: 'Premium',
          status: 'active',
          total_shipments: 203,
          monthly_value: 22100,
          avg_package_weight: 3.8,
          preferred_transport: 'sea',
          satisfaction_score: 95,
          created_at: '2023-11-10',
          last_shipment: '2024-12-02'
        },
        {
          id: 4,
          name: 'Maria Garcia',
          email: 'maria.garcia@southlogistics.mx',
          company: 'South Logistics',
          phone: '+52-55-87654321',
          region: 'South America',
          tier: 'Standard',
          status: 'active',
          total_shipments: 45,
          monthly_value: 3200,
          avg_package_weight: 1.9,
          preferred_transport: 'air',
          satisfaction_score: 83,
          created_at: '2024-06-01',
          last_shipment: '2024-11-25'
        },
        {
          id: 5,
          name: 'David Chen',
          email: 'david.chen@asiafreight.cn',
          company: 'Asia Freight Co.',
          phone: '+86-21-98765432',
          region: 'Asia',
          tier: 'Business',
          status: 'active',
          total_shipments: 134,
          monthly_value: 9800,
          avg_package_weight: 5.1,
          preferred_transport: 'sea',
          satisfaction_score: 90,
          created_at: '2024-03-12',
          last_shipment: '2024-11-30'
        },
        {
          id: 6,
          name: 'Emma Wilson',
          email: 'e.wilson@oceanicshipping.au',
          company: 'Oceanic Shipping',
          phone: '+61-2-12345678',
          region: 'Oceania',
          tier: 'Standard',
          status: 'active',
          total_shipments: 67,
          monthly_value: 4500,
          avg_package_weight: 2.8,
          preferred_transport: 'sea',
          satisfaction_score: 86,
          created_at: '2024-04-18',
          last_shipment: '2024-11-27'
        }
      ]
    },

    async createClient(clientData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/clients', clientData)
        this.clients.push({
          ...response.data,
          tier: this.getClientPricingTier(response.data.monthly_value || 0)
        })
        return response.data
      } catch (error) {
        this.error = 'Failed to create client'
        console.error('Error creating client:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateClient(id, clientData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/clients/${id}`, clientData)
        const index = this.clients.findIndex(client => client.id === id)
        if (index !== -1) {
          this.clients[index] = {
            ...response.data,
            tier: this.getClientPricingTier(response.data.monthly_value || 0)
          }
        }
        return response.data
      } catch (error) {
        this.error = 'Failed to update client'
        console.error('Error updating client:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteClient(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/clients/${id}`)
        this.clients = this.clients.filter(client => client.id !== id)
      } catch (error) {
        this.error = 'Failed to delete client'
        console.error('Error deleting client:', error)
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
        tier: '',
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
        'ID', 'Name', 'Email', 'Company', 'Phone', 'Region', 'Tier', 'Status',
        'Total Shipments', 'Monthly Value', 'Avg Package Weight', 'Preferred Transport',
        'Satisfaction Score', 'Created At', 'Last Shipment'
      ]

      const csvContent = [
        headers.join(','),
        ...this.filteredClients.map(client => [
          client.id,
          `"${client.name}"`,
          client.email,
          `"${client.company}"`,
          client.phone,
          client.region,
          client.tier,
          client.status,
          client.total_shipments,
          client.monthly_value,
          client.avg_package_weight,
          client.preferred_transport,
          client.satisfaction_score,
          client.created_at,
          client.last_shipment
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `clients-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
})