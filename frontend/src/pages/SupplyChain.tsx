import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '../components/Button'
import { useBatchHistory, useSupplyChain } from '../hooks/useSupplyChain'
import { STEP_TYPES, STEP_STATUS } from '../lib/contracts'
import { Package, ChevronRight, CheckCircle, Clock, AlertCircle, XCircle, MinusCircle } from 'lucide-react'

const OBSERVATION_MAX = 140

export function SupplyChain() {
  const { isConnected } = useAccount()
  const [batchInput, setBatchInput] = useState('')
  const [searchBatchId, setSearchBatchId] = useState<number | null>(null)
  const { history, isLoading, refetch } = useBatchHistory(searchBatchId ?? 0, searchBatchId !== null)

  const { addStep, isPending, isConfirming, isConfirmed, error } = useSupplyChain()
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [stepForm, setStepForm] = useState({ stepType: 0, location: '', observation: '' })

  useEffect(() => {
    if (isConfirmed) {
      setShowUpdateForm(false)
      setStepForm({ stepType: 0, location: '', observation: '' })
      refetch()
    }
  }, [isConfirmed, refetch])

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchBatchId === null) return
    addStep({
      stepType: Number(stepForm.stepType),
      batchId: searchBatchId,
      location: stepForm.location,
      observation: stepForm.observation,
    })
  }

  const formatTime = (ts: bigint) =>
    ts > 0n ? new Date(Number(ts) * 1000).toLocaleString('pt-BR') : ''

  // status: 0 Pendente, 1 Em Progresso, 2 Concluído, 3 Falhou, 4 Pulada
  const getStatusIcon = (status: number) => {
    switch (status) {
      case 2:
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 1:
        return <Clock className="w-5 h-5 text-blue-600" />
      case 3:
        return <XCircle className="w-5 h-5 text-red-600" />
      case 4:
        return <MinusCircle className="w-5 h-5 text-gray-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 2:
        return 'bg-green-100 text-green-800'
      case 1:
        return 'bg-blue-100 text-blue-800'
      case 3:
        return 'bg-red-100 text-red-800'
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
              type="number"
              placeholder="ID do Lote"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button onClick={() => setSearchBatchId(batchInput === '' ? null : Number(batchInput))}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Timeline */}
      {searchBatchId !== null && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Timeline do Lote #{searchBatchId}</h2>
            <Button
              onClick={() => setShowUpdateForm((v) => !v)}
              disabled={!isConnected}
            >
              {showUpdateForm ? 'Fechar' : 'Atualizar Etapa'}
            </Button>
          </div>

          {showUpdateForm && (
            <form
              onSubmit={handleAddStep}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100 rounded-lg p-4 mb-6 bg-gray-50"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Etapa</label>
                <select
                  value={stepForm.stepType}
                  onChange={(e) => setStepForm({ ...stepForm, stepType: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {STEP_TYPES.map((label, idx) => (
                    <option key={label} value={idx}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <input
                  type="text"
                  placeholder="Ex: Porto de Santos"
                  value={stepForm.location}
                  onChange={(e) => setStepForm({ ...stepForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                <input
                  type="text"
                  maxLength={OBSERVATION_MAX}
                  placeholder="Observação (opcional)"
                  value={stepForm.observation}
                  onChange={(e) => setStepForm({ ...stepForm, observation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {stepForm.observation.length}/{OBSERVATION_MAX}
                </p>
              </div>
              <div className="md:col-span-3 flex items-center gap-4">
                <Button type="submit" disabled={isPending || isConfirming}>
                  {isPending ? 'Confirme na carteira...' : isConfirming ? 'Confirmando...' : 'Registrar Etapa'}
                </Button>
                {error && (
                  <span className="text-sm text-red-600 truncate" title={error.message}>
                    {error.message.split('\n')[0]}
                  </span>
                )}
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Carregando da blockchain...</p>
            </div>
          ) : !history || history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma etapa encontrada para este lote.</p>
          ) : (
            <div className="space-y-4">
              {history.map((step, index) => (
                <div key={step.stepId.toString()} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getStatusIcon(step.status)}
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {STEP_TYPES[step.stepType] ?? `Etapa ${step.stepType}`}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                        {STEP_STATUS[step.status] ?? 'Desconhecido'}
                      </span>
                    </div>
                    {step.location && (
                      <p className="text-sm text-gray-600">Local: {step.location}</p>
                    )}
                    {formatTime(step.startTime) && (
                      <p className="text-sm text-gray-500">Início: {formatTime(step.startTime)}</p>
                    )}
                    {formatTime(step.endTime) && (
                      <p className="text-sm text-gray-500">Fim: {formatTime(step.endTime)}</p>
                    )}
                    {step.metadata && (
                      <p className="mt-2 text-sm text-gray-700 italic border-l-2 border-gray-300 pl-2">
                        Obs.: {step.metadata}
                      </p>
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
