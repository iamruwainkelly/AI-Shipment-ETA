import { defineStore } from 'pinia'
import api from '../services/api'

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [],
    currentClient: null,
    loading: false,
    error: null,
    metrics: {}
  }),

  getters: {
    getClientById: (state) => (id) => {
      return state.clients.find(client => client.id === id)
    },
    totalClients: (state) => state.clients.length,
    activeClients: (state) => state.clients.filter(client => client.status === 'active').length,
    totalContractValue: (state) => {
      return state.clients.reduce((acc, client) => acc + (client.contract_value || 0), 0)
    },
    totalMonthlyRevenue: (state) => {
      return state.clients.reduce((acc, client) => acc + (client.monthly_revenue || 0), 0)
    },
    averageSatisfactionScore: (state) => {
      if (state.clients.length === 0) return 0
      const sum = state.clients.reduce((acc, client) => acc + (client.satisfaction_score || 0), 0)
      return (sum / state.clients.length).toFixed(1)
    },
    topClientsByRevenue: (state) => {
      return [...state.clients]
        .filter(client => client.status === 'active')
        .sort((a, b) => (b.monthly_revenue || 0) - (a.monthly_revenue || 0))
        .slice(0, 5)
    },
    clientsByIndustry: (state) => {
      const industries = {}
      state.clients.forEach(client => {
        const industry = client.industry || 'Other'
        if (!industries[industry]) {
          industries[industry] = []
        }
        industries[industry].push(client)
      })
      return industries
    },
    clientsByRegion: (state) => {
      const regions = {}
      state.clients.forEach(client => {
        const region = client.region || 'Unknown'
        if (!regions[region]) {
          regions[region] = []
        }
        regions[region].push(client)
      })
      return regions
    },
    riskAnalysis: (state) => {
      const clients = state.clients.filter(client => client.status === 'active')
      const lowRisk = clients.filter(client => client.risk_score <= 0.1).length
      const mediumRisk = clients.filter(client => client.risk_score > 0.1 && client.risk_score <= 0.2).length
      const highRisk = clients.filter(client => client.risk_score > 0.2).length
      
      return {
        low: lowRisk,
        medium: mediumRisk,
        high: highRisk,
        total: clients.length
      }
    },
    clientTierDistribution: (state) => {
      const tiers = { enterprise: 0, premium: 0, standard: 0, basic: 0 }
      state.clients.forEach(client => {
        const tier = client.tier || 'basic'
        tiers[tier] = (tiers[tier] || 0) + 1
      })
      return tiers
    }
  },

  actions: {
    async fetchClients() {
      this.loading = true
      this.error = null
      try {
        this.clients = await api.clients.getAll()
      } catch (error) {
        this.error = error.message
        // Enhanced mock data fallback
        this.clients = [
          {
            id: 1,
            name: 'TechCorp Industries',
            email: 'procurement@techcorp.com',
            phone: '+1-555-0123',
            contact_person: 'Sarah Martinez',
            industry: 'Technology',
            region: 'North America',
            tier: 'enterprise',
            status: 'active',
            contract_value: 1250000,
            monthly_revenue: 85000,
            total_shipments: 420,
            satisfaction_score: 4.8,
            risk_score: 0.05,
            payment_terms: 'Net 30',
            preferred_transport: 'air,road',
            special_requirements: ['temperature_controlled', 'expedited_delivery'],
            account_manager: 'John Smith',
            created_at: '2024-01-15T10:30:00',
            last_shipment: '2025-01-10T14:20:00',
            address: {
              street: '1200 Technology Drive',
              city: 'San Francisco',
              state: 'CA',
              zip: '94105',
              country: 'USA'
            }
          },
          {
            id: 2,
            name: 'Global Retail Solutions',
            email: 'logistics@globalretail.com',
            phone: '+1-555-0234',
            contact_person: 'Michael Chen',
            industry: 'Retail',
            region: 'North America',
            tier: 'premium',
            status: 'active',
            contract_value: 890000,
            monthly_revenue: 62000,
            total_shipments: 850,
            satisfaction_score: 4.6,
            risk_score: 0.08,
            payment_terms: 'Net 45',
            preferred_transport: 'road,sea',
            special_requirements: ['bulk_cargo', 'fragile_handling'],
            account_manager: 'Emily Davis',
            created_at: '2024-02-20T09:15:00',
            last_shipment: '2025-01-08T11:45:00',
            address: {
              street: '500 Commerce Plaza',
              city: 'Chicago',
              state: 'IL',
              zip: '60601',
              country: 'USA'
            }
          },
          {
            id: 3,
            name: 'MedSupply International',
            email: 'shipping@medsupply.com',
            phone: '+1-555-0345',
            contact_person: 'Dr. Amanda Wilson',
            industry: 'Healthcare',
            region: 'North America',
            tier: 'enterprise',
            status: 'active',
            contract_value: 1850000,
            monthly_revenue: 125000,
            total_shipments: 680,
            satisfaction_score: 4.9,
            risk_score: 0.03,
            payment_terms: 'Net 15',
            preferred_transport: 'air',
            special_requirements: ['temperature_controlled', 'hazmat_certified', 'expedited_delivery'],
            account_manager: 'Robert Johnson',
            created_at: '2024-03-10T16:45:00',
            last_shipment: '2025-01-09T09:30:00',
            address: {
              street: '250 Medical Center Drive',
              city: 'Boston',
              state: 'MA',
              zip: '02118',
              country: 'USA'
            }
          },
          {
            id: 4,
            name: 'EuroManufacturing Ltd',
            email: 'export@euromanufacturing.eu',
            phone: '+44-20-5555-0456',
            contact_person: 'James Thompson',
            industry: 'Manufacturing',
            region: 'Europe',
            tier: 'premium',
            status: 'active',
            contract_value: 720000,
            monthly_revenue: 48000,
            total_shipments: 320,
            satisfaction_score: 4.4,
            risk_score: 0.12,
            payment_terms: 'Net 60',
            preferred_transport: 'sea,road',
            special_requirements: ['oversized_cargo', 'bulk_cargo'],
            account_manager: 'Lisa Anderson',
            created_at: '2024-04-05T13:20:00',
            last_shipment: '2025-01-07T15:10:00',
            address: {
              street: '75 Industrial Estate',
              city: 'Birmingham',
              state: 'West Midlands',
              zip: 'B1 2AA',
              country: 'United Kingdom'
            }
          },
          {
            id: 5,
            name: 'Pacific Electronics Co',
            email: 'logistics@pacificelectronics.com',
            phone: '+81-3-5555-0567',
            contact_person: 'Yuki Tanaka',
            industry: 'Electronics',
            region: 'Asia-Pacific',
            tier: 'standard',
            status: 'active',
            contract_value: 450000,
            monthly_revenue: 32000,
            total_shipments: 580,
            satisfaction_score: 4.3,
            risk_score: 0.15,
            payment_terms: 'Net 30',
            preferred_transport: 'air,sea',
            special_requirements: ['fragile_handling', 'anti_static'],
            account_manager: 'David Kim',
            created_at: '2024-05-12T11:00:00',
            last_shipment: '2025-01-06T12:25:00',
            address: {
              street: '3-15-7 Shibuya',
              city: 'Tokyo',
              state: 'Tokyo',
              zip: '150-0002',
              country: 'Japan'
            }
          },
          {
            id: 6,
            name: 'AgroExports Brazil',
            email: 'export@agroexports.br',
            phone: '+55-11-5555-0678',
            contact_person: 'Carlos Rodriguez',
            industry: 'Agriculture',
            region: 'South America',
            tier: 'standard',
            status: 'active',
            contract_value: 380000,
            monthly_revenue: 28000,
            total_shipments: 240,
            satisfaction_score: 4.1,
            risk_score: 0.18,
            payment_terms: 'Net 45',
            preferred_transport: 'sea',
            special_requirements: ['temperature_controlled', 'organic_certified'],
            account_manager: 'Maria Santos',
            created_at: '2024-06-18T14:35:00',
            last_shipment: '2025-01-05T16:40:00',
            address: {
              street: 'Rua das Exportações, 150',
              city: 'São Paulo',
              state: 'SP',
              zip: '01310-100',
              country: 'Brazil'
            }
          },
          {
            id: 7,
            name: 'StartupTech Innovations',
            email: 'ops@startuptech.com',
            phone: '+1-555-0789',
            contact_person: 'Alex Rivera',
            industry: 'Technology',
            region: 'North America',
            tier: 'basic',
            status: 'active',
            contract_value: 125000,
            monthly_revenue: 8500,
            total_shipments: 85,
            satisfaction_score: 4.2,
            risk_score: 0.22,
            payment_terms: 'Net 15',
            preferred_transport: 'road',
            special_requirements: ['expedited_delivery'],
            account_manager: 'Jennifer Lee',
            created_at: '2024-08-22T10:15:00',
            last_shipment: '2025-01-04T13:55:00',
            address: {
              street: '456 Innovation Way',
              city: 'Austin',
              state: 'TX',
              zip: '78701',
              country: 'USA'
            }
          },
          {
            id: 8,
            name: 'Fashion Forward LLC',
            email: 'shipping@fashionforward.com',
            phone: '+1-555-0890',
            contact_person: 'Isabella Martinez',
            industry: 'Fashion',
            region: 'North America',
            tier: 'premium',
            status: 'pending',
            contract_value: 650000,
            monthly_revenue: 45000,
            total_shipments: 280,
            satisfaction_score: 4.5,
            risk_score: 0.10,
            payment_terms: 'Net 30',
            preferred_transport: 'air,road',
            special_requirements: ['fragile_handling', 'expedited_delivery'],
            account_manager: 'Thomas Wilson',
            created_at: '2024-09-30T15:40:00',
            last_shipment: '2025-01-03T10:20:00',
            address: {
              street: '789 Fashion District',
              city: 'New York',
              state: 'NY',
              zip: '10001',
              country: 'USA'
            }
          }
        ]
      } finally {
        this.loading = false
      }
    },

    async createClient(clientData) {
      this.loading = true
      this.error = null
      try {
        const newClient = await api.clients.create(clientData)
        this.clients.push(newClient)
        return newClient
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateClient(id, clientData) {
      this.loading = true
      this.error = null
      try {
        const updatedClient = await api.clients.update(id, clientData)
        const index = this.clients.findIndex(client => client.id === id)
        if (index !== -1) {
          this.clients[index] = updatedClient
        }
        return updatedClient
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteClient(id) {
      this.loading = true
      this.error = null
      try {
        await api.clients.delete(id)
        this.clients = this.clients.filter(client => client.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})