import { useAccount } from 'wagmi'
import { Button } from '../components/Button'
import { useSupplyChain } from '../hooks/useSupplyChain'
import { Package, Battery, Car, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const { isConnected } = useAccount()
  const { createNewBatch, isPending, isConfirming, isConfirmed } = useSupplyChain()

  const stats = [
    { label: 'Lotes Ativos', value: '0', icon: Package, color: 'text-blue-600' },
    { label: 'Baterias Rastreadas', value: '0', icon: Battery, color: 'text-green-600' },
    { label: 'Veículos Registrados', value: '0', icon: Car, color: 'text-purple-600' },
    { label: 'Etapas Completadas', value: '0', icon: TrendingUp, color: 'text-orange-600' },
  ]

  const recentActivity = [
    { id: 1, type: 'Lote Criado', description: 'Lote #123 criado', time: '2 horas atrás' },
    { id: 2, type: 'Bateria Instalada', description: 'Bateria #456 instalada', time: '5 horas atrás' },
    { id: 3, type: 'Veículo Registrado', description: 'Veículo VIN #789', time: '1 dia atrás' },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Visão geral do sistema de rastreabilidade de nióbio</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={createNewBatch}
            disabled={!isConnected || isPending || isConfirming}
            className="w-full"
          >
            {isPending ? 'Criando...' : isConfirming ? 'Confirmando...' : isConfirmed ? 'Criado!' : 'Criar Novo Lote'}
          </Button>
          <Button
            variant="outline"
            disabled={!isConnected}
            className="w-full"
          >
            Registrar Bateria
          </Button>
          <Button
            variant="outline"
            disabled={!isConnected}
            className="w-full"
          >
            Registrar Veículo
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{activity.type}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <p className="text-gray-500 text-center py-8">Nenhuma atividade recente</p>
          )}
        </div>
      </div>
    </main>
  )
}
