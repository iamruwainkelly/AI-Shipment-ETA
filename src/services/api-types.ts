import api from './api'

export interface Client {
  id?: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  created_at?: string
}

export interface Product {
  id?: number
  name: string
  category: string
  weight: number
  dimensions: string
  value: number
  created_at?: string
}

export interface Driver {
  id?: number
  name: string
  license_number: string
  phone: string
  email: string
  vehicle_type: string
  capacity: number
  availability: boolean
  current_location: string
  rating: number
  created_at?: string
}

export interface Transporter {
  id?: number
  name: string
  contact_person: string
  email: string
  phone: string
  vehicle_types: string[]
  base_rate: number
  availability: boolean
  rating: number
  created_at?: string
}

export interface Shipment {
  id?: number
  client_id: number
  product_id: number
  driver_id: number
  transporter_id: number
  origin: string
  destination: string
  estimated_eta: string
  actual_eta?: string
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed'
  confidence_score: number
  weather_delay_factor: number
  route_distance: number
  route_duration: number
  created_at?: string
  client?: Client
  product?: Product
  driver?: Driver
  transporter?: Transporter
}

export interface UploadResponse {
  success: boolean
  message: string
  count: number
}

export interface ETACalculation {
  estimated_eta: string
  confidence_score: number
  route_distance: number
  route_duration: number
  weather_delay_factor: number
  route_geometry?: any
}

// API Services
export const clientsAPI = {
  getAll: () => api.get<Client[]>('/clients'),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  create: (client: Omit<Client, 'id' | 'created_at'>) => api.post<Client>('/clients', client),
  update: (id: number, client: Partial<Client>) => api.put<Client>(`/clients/${id}`, client),
  delete: (id: number) => api.delete(`/clients/${id}`),
  uploadCSV: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<UploadResponse>('/upload/clients', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const productsAPI = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (product: Omit<Product, 'id' | 'created_at'>) => api.post<Product>('/products', product),
  update: (id: number, product: Partial<Product>) => api.put<Product>(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
  uploadCSV: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<UploadResponse>('/upload/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const driversAPI = {
  getAll: () => api.get<Driver[]>('/drivers'),
  getById: (id: number) => api.get<Driver>(`/drivers/${id}`),
  create: (driver: Omit<Driver, 'id' | 'created_at'>) => api.post<Driver>('/drivers', driver),
  update: (id: number, driver: Partial<Driver>) => api.put<Driver>(`/drivers/${id}`, driver),
  delete: (id: number) => api.delete(`/drivers/${id}`),
  uploadCSV: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<UploadResponse>('/upload/drivers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const transportersAPI = {
  getAll: () => api.get<Transporter[]>('/transporters'),
  getById: (id: number) => api.get<Transporter>(`/transporters/${id}`),
  create: (transporter: Omit<Transporter, 'id' | 'created_at'>) => api.post<Transporter>('/transporters', transporter),
  update: (id: number, transporter: Partial<Transporter>) => api.put<Transporter>(`/transporters/${id}`, transporter),
  delete: (id: number) => api.delete(`/transporters/${id}`),
  uploadCSV: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<UploadResponse>('/upload/transporters', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const shipmentsAPI = {
  getAll: () => api.get<Shipment[]>('/shipments'),
  getById: (id: number) => api.get<Shipment>(`/shipments/${id}`),
  create: (shipment: Omit<Shipment, 'id' | 'created_at'>) => api.post<Shipment>('/shipments', shipment),
  update: (id: number, shipment: Partial<Shipment>) => api.put<Shipment>(`/shipments/${id}`, shipment),
  delete: (id: number) => api.delete(`/shipments/${id}`),
  calculateETA: (origin: string, destination: string) => 
    api.post<ETACalculation>('/shipments/calculate-eta', { origin, destination }),
  generateInvoice: (id: number) => api.get(`/shipments/${id}/invoice`, { responseType: 'blob' }),
  getOptimalDriver: (shipmentData: any) => 
    api.post<Driver>('/shipments/optimal-driver', shipmentData)
}
