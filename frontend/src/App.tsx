import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import { Dashboard } from './pages/Dashboard'
import { SupplyChain } from './pages/SupplyChain'
import { Batteries } from './pages/Batteries'
import { Vehicles } from './pages/Vehicles'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

type Page = 'dashboard' | 'supplychain' | 'batteries' | 'vehicles'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'supplychain':
        return <SupplyChain />
      case 'batteries':
        return <Batteries />
      case 'vehicles':
        return <Vehicles />
      default:
        return <Dashboard />
    }
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    currentPage === 'dashboard'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('supplychain')}
                  className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    currentPage === 'supplychain'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Supply Chain
                </button>
                <button
                  onClick={() => setCurrentPage('batteries')}
                  className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    currentPage === 'batteries'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Baterias
                </button>
                <button
                  onClick={() => setCurrentPage('vehicles')}
                  className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    currentPage === 'vehicles'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Veículos
                </button>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          {renderPage()}
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
