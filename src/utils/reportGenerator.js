import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Enhanced Report Generation Utilities
export class ReportGenerator {
  constructor() {
    this.company = 'AI Shipment ETA Predictor'
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  }

  // Generate Performance Report (PDF)
  async generatePerformanceReport(data, timeframe = '30d') {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20

    // Header
    doc.setFontSize(20)
    doc.setTextColor(0, 102, 204)
    doc.text(this.company, margin, 30)
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Performance Report', margin, 50)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const reportDate = new Date().toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.text(`Generated: ${reportDate}`, margin, 60)
    doc.text(`Timeframe: ${this.getTimeframeLabel(timeframe)}`, margin, 70)

    // Summary Statistics
    let yPos = 90
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Summary Statistics', margin, yPos)
    
    yPos += 15
    doc.setFontSize(10)
    const stats = data.stats || this.getDefaultStats()
    
    doc.text(`Total Shipments: ${stats.total.toLocaleString()}`, margin, yPos)
    doc.text(`In Transit: ${stats.inTransit.toLocaleString()}`, margin + 100, yPos)
    
    yPos += 10
    doc.text(`Delivered: ${stats.delivered.toLocaleString()}`, margin, yPos)
    doc.text(`At Risk: ${stats.atRisk.toLocaleString()}`, margin + 100, yPos)
    
    yPos += 10
    doc.text(`AI Accuracy: ${stats.aiAccuracy}%`, margin, yPos)
    doc.text(`Success Rate: ${((stats.delivered / stats.total) * 100).toFixed(1)}%`, margin + 100, yPos)

    // Performance Metrics
    yPos += 30
    doc.setFontSize(14)
    doc.text('Key Performance Indicators', margin, yPos)
    
    yPos += 15
    doc.setFontSize(10)
    
    const kpis = [
      { label: 'On-Time Delivery Rate', value: '94.2%', trend: '+2.1%' },
      { label: 'Average Transit Time', value: '4.2 days', trend: '-0.3 days' },
      { label: 'Cost per Shipment', value: 'R 2,450', trend: '-R 120' },
      { label: 'Customer Satisfaction', value: '4.7/5', trend: '+0.2' }
    ]

    kpis.forEach((kpi, index) => {
      doc.text(`${kpi.label}: ${kpi.value} (${kpi.trend})`, margin, yPos + (index * 10))
    })

    // Regional Performance
    yPos += 60
    doc.setFontSize(14)
    doc.text('Regional Performance', margin, yPos)
    
    yPos += 15
    doc.setFontSize(10)
    
    const regions = [
      { name: 'South Africa', shipments: 723, onTime: 96.1 },
      { name: 'Europe', shipments: 524, onTime: 92.8 }
    ]

    regions.forEach((region, index) => {
      doc.text(`${region.name}: ${region.shipments} shipments, ${region.onTime}% on-time`, margin, yPos + (index * 10))
    })

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Confidential - AI Shipment ETA Predictor', margin, doc.internal.pageSize.height - 20)

    // Save the PDF
    const fileName = `performance-report-${timeframe}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return { success: true, fileName }
  }

  // Generate Financial Report (Excel)
  async generateFinancialReport(data, timeframe = '30d') {
    try {
      const workbook = XLSX.utils.book_new()
      
      // Summary Sheet
      const summaryData = [
        ['AI Shipment ETA Predictor - Financial Report'],
        [`Generated: ${new Date().toLocaleDateString('en-ZA')}`],
        [`Timeframe: ${this.getTimeframeLabel(timeframe)}`],
        [],
        ['Metric', 'Value', 'Currency'],
        ['Total Revenue', 2450000, 'ZAR'],
        ['Operating Costs', 1680000, 'ZAR'],
        ['Gross Profit', 770000, 'ZAR'],
        ['Profit Margin', '31.4%', '%'],
        [],
        ['Revenue by Transport Mode'],
        ['Sea Freight', 1225000, 'ZAR'],
        ['Air Freight', 735000, 'ZAR'],
        ['Road Transport', 367500, 'ZAR'],
        ['Rail Transport', 122500, 'ZAR'],
        [],
        ['Cost Analysis'],
        ['Fuel Costs', 490000, 'ZAR'],
        ['Labor Costs', 588000, 'ZAR'],
        ['Maintenance', 245000, 'ZAR'],
        ['Insurance', 147000, 'ZAR'],
        ['Other Expenses', 210000, 'ZAR']
      ]

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

      // Monthly Data Sheet
      const monthlyData = [
        ['Month', 'Revenue (ZAR)', 'Costs (ZAR)', 'Profit (ZAR)', 'Shipments'],
        ['January', 420000, 294000, 126000, 234],
        ['February', 480000, 336000, 144000, 267],
        ['March', 510000, 357000, 153000, 284],
        ['April', 475000, 332500, 142500, 264],
        ['May', 498000, 348600, 149400, 277],
        ['June', 549600, 384720, 164880, 305]
      ]

      const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData)
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Breakdown')

      // Client Revenue Sheet
      const clientData = [
        ['Client', 'Revenue (ZAR)', 'Shipments', 'Avg Value'],
        ['BMW Group', 245000, 45, 5444],
        ['Volkswagen AG', 198000, 38, 5211],
        ['Mercedes-Benz', 167000, 32, 5219],
        ['SABMiller', 134000, 28, 4786],
        ['Sasol Limited', 123000, 31, 3968],
        ['Anglo American', 156000, 29, 5379]
      ]

      const clientSheet = XLSX.utils.aoa_to_sheet(clientData)
      XLSX.utils.book_append_sheet(workbook, clientSheet, 'Client Revenue')

      // Save the workbook
      const fileName = `financial-report-${timeframe}-${new Date().toISOString().split('T')[0]}.xlsx`
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })
      saveAs(blob, fileName)

      return { success: true, fileName }
    } catch (error) {
      console.error('Error generating financial report:', error)
      return { success: false, error: error.message }
    }
  }

  // Generate Operational Report (PDF)
  async generateOperationalReport(data, timeframe = '30d') {
    const doc = new jsPDF()
    const margin = 20

    // Header
    doc.setFontSize(20)
    doc.setTextColor(0, 102, 204)
    doc.text(this.company, margin, 30)
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Operational Report', margin, 50)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const reportDate = new Date().toLocaleDateString('en-ZA')
    doc.text(`Generated: ${reportDate}`, margin, 60)
    doc.text(`Timeframe: ${this.getTimeframeLabel(timeframe)}`, margin, 70)

    // Operational Metrics
    let yPos = 90
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Operational Performance', margin, yPos)
    
    yPos += 15
    doc.setFontSize(10)
    
    const metrics = [
      'Fleet Utilization: 87.3% (+3.2%)',
      'Route Efficiency: 92.1% (+1.8%)',
      'Warehouse Throughput: 1,250 packages/hour (+125)',
      'Delivery Success Rate: 98.7% (+0.3%)',
      'Customer Complaints: 0.3% (-0.1%)',
      'Return Rate: 2.1% (-0.4%)'
    ]

    metrics.forEach((metric, index) => {
      doc.text(metric, margin, yPos + (index * 12))
    })

    // Carrier Performance
    yPos += 90
    doc.setFontSize(14)
    doc.text('Top Performing Carriers', margin, yPos)
    
    yPos += 15
    doc.setFontSize(10)
    
    const carriers = [
      { name: 'DHL Express SA', rating: 96.2, shipments: 156 },
      { name: 'Maersk Line', rating: 94.8, shipments: 89 },
      { name: 'FedEx Europe', rating: 93.5, shipments: 67 }
    ]

    carriers.forEach((carrier, index) => {
      doc.text(`${carrier.name}: ${carrier.rating}% (${carrier.shipments} shipments)`, margin, yPos + (index * 10))
    })

    // Risk Analysis
    yPos += 50
    doc.setFontSize(14)
    doc.text('Risk Analysis', margin, yPos)
    
    yPos += 15
    doc.setFontSize(10)
    
    const risks = [
      'Weather-related delays: 15% of at-risk shipments',
      'Traffic congestion: 28% of urban route delays',
      'Customs processing: 8% of international shipments',
      'Capacity constraints: 5% of peak season shipments'
    ]

    risks.forEach((risk, index) => {
      doc.text(risk, margin, yPos + (index * 10))
    })

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Confidential - AI Shipment ETA Predictor', margin, doc.internal.pageSize.height - 20)

    const fileName = `operational-report-${timeframe}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return { success: true, fileName }
  }

  // Generate CSV Export
  async generateCSVExport(type, data) {
    let csvContent = ''
    let fileName = ''

    switch (type) {
      case 'shipments':
        csvContent = this.generateShipmentsCSV(data)
        fileName = `shipments-export-${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'clients':
        csvContent = this.generateClientsCSV(data)
        fileName = `clients-export-${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'vendors':
        csvContent = this.generateVendorsCSV(data)
        fileName = `vendors-export-${new Date().toISOString().split('T')[0]}.csv`
        break
      default:
        throw new Error('Unknown export type')
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, fileName)
    
    return { success: true, fileName }
  }

  // Helper Methods
  getTimeframeLabel(timeframe) {
    const labels = {
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 3 Months',
      '1y': 'Last Year'
    }
    return labels[timeframe] || 'Custom Range'
  }

  getDefaultStats() {
    return {
      total: 1247,
      inTransit: 89,
      atRisk: 12,
      delivered: 1146,
      aiAccuracy: 94.2
    }
  }

  generateShipmentsCSV(shipments) {
    const headers = ['ID', 'Origin', 'Destination', 'Status', 'Progress', 'ETA', 'Carrier', 'Risk Score']
    const rows = shipments.map(s => [
      s.id,
      s.origin,
      s.destination,
      s.status,
      s.progress + '%',
      new Date(s.eta).toLocaleDateString('en-ZA'),
      s.carrier,
      s.riskScore || 'N/A'
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  generateClientsCSV(clients) {
    const headers = ['ID', 'Name', 'Region', 'Total Shipments', 'Status', 'Tier', 'Contact Email']
    const rows = clients.map(c => [
      c.id,
      c.name,
      c.region,
      c.totalShipments || 0,
      c.status,
      c.tier,
      c.contactEmail || 'N/A'
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  generateVendorsCSV(vendors) {
    const headers = ['ID', 'Name', 'Code', 'Type', 'Region', 'Performance', 'Routes', 'Status']
    const rows = vendors.map(v => [
      v.id,
      v.name,
      v.code || v.name.substring(0, 3).toUpperCase(),
      v.transportType || v.type,
      v.region,
      (v.performanceScore || v.performance) + '%',
      v.activeRoutes || v.routes || 0,
      v.status
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
}

// Export singleton instance
export const reportGenerator = new ReportGenerator()

// Export individual functions for backwards compatibility
export const generatePerformanceReport = (data, timeframe) => reportGenerator.generatePerformanceReport(data, timeframe)
export const generateFinancialReport = (data, timeframe) => reportGenerator.generateFinancialReport(data, timeframe)
export const generateOperationalReport = (data, timeframe) => reportGenerator.generateOperationalReport(data, timeframe)
export const generateCSVExport = (type, data) => reportGenerator.generateCSVExport(type, data)
