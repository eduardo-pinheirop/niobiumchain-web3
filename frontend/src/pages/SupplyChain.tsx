import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '../components/Button'
import { useBatchHistory } from '../hooks/useSupplyChain'
import { Package, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export function SupplyChain() {
  const { isConnected } = useAccount()
  const [searchBatchId, setSearchBatchId] = useState('')
  const { isLoading } = useBatchHistory(Number(searchBatchId))

  const steps = [
    { id: 1, name: 'Mineração', status: 'completed', time: '2025-05-30 10:00' },
    { id: 2, name: 'Transporte', status: 'completed', time: '2025-05-30 14:00' },
    { id: 3, name: 'Processamento', status: 'in_progress', time: '2025-05-30 16:00' },
    { id: 4, name: 'Embalagem', status: 'pending', time: '' },
    { id: 5, name: 'Porto (Carregamento)', status: 'pending', time: '' },
    { id: 6, name: 'Embarque', status: 'pending', time: '' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Supply Chain</h1>
        <p className="mt-2 text-gray-600">Rastreamento completo da cadeia de suprimentos de nióbio</p>
      </div>

      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-800">Conecte sua carteira</h3>
              <p className="text-sm text-yellow-700">Conecte o MetaMask para acessar o sistema completo</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Lote</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ID do Lote"
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button disabled={!isConnected}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Timeline */}
      {searchBatchId && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Timeline do Lote #{searchBatchId}</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getStatusIcon(step.status)}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{step.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                        {step.status === 'completed' ? 'Concluído' : step.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                      </span>
                    </div>
                    {step.time && (
                      <p className="text-sm text-gray-600">{step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Workflow Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Padrão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Mineração',
            'Transporte Terrestre',
            'Processamento Químico',
            'Embalagem',
            'Porto (Carregamento)',
            'Embarque Marítimo',
            'Porto (Descarregamento)',
            'Transporte Final',
            'Fabricação de Bateria',
            'Montagem em Veículo',
            'Entrega Final',
          ].map((step) => (
            <div key={step} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
