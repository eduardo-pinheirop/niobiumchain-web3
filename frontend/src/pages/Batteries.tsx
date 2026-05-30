import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '../components/Button'
import { useBatteryTracking, useBatteryInfo } from '../hooks/useBatteryTracking'
import { Battery } from 'lucide-react'

export function Batteries() {
  const { isConnected } = useAccount()
  const [searchBatteryId, setSearchBatteryId] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { battery, isLoading } = useBatteryInfo(Number(searchBatteryId))
  const { createNewBattery, isPending, isConfirming } = useBatteryTracking()

  const [formData, setFormData] = useState({
    serialNumber: '',
    model: '',
    capacity: '',
    voltage: '',
    chemistry: '',
    niobiumBatchId: '',
    manufacturer: '',
    warrantyMonths: '',
    qrCode: '',
    tokenURI: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createNewBattery({
        serialNumber: formData.serialNumber,
        model: formData.model,
        capacity: Number(formData.capacity),
        voltage: Number(formData.voltage),
        chemistry: formData.chemistry,
        niobiumBatchId: Number(formData.niobiumBatchId),
        manufacturer: formData.manufacturer,
        warrantyMonths: Number(formData.warrantyMonths),
        qrCode: formData.qrCode,
        tokenURI: formData.tokenURI,
      })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating battery:', error)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Baterias</h1>
          <p className="mt-2 text-gray-600">Rastreamento individual de baterias</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!isConnected}
        >
          Nova Bateria
        </Button>
      </div>

      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600">
              <Battery className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-800">Conecte sua carteira</h3>
              <p className="text-sm text-yellow-700">Conecte o MetaMask para acessar o sistema completo</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Criar Nova Bateria</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (kWh)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voltagem (V)</label>
              <input
                type="number"
                value={formData.voltage}
                onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Química</label>
              <input
                type="text"
                value={formData.chemistry}
                onChange={(e) => setFormData({ ...formData, chemistry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID do Lote de Nióbio</label>
              <input
                type="number"
                value={formData.niobiumBatchId}
                onChange={(e) => setFormData({ ...formData, niobiumBatchId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Garantia (meses)</label>
              <input
                type="number"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">QR Code</label>
              <input
                type="text"
                value={formData.qrCode}
                onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Token URI (IPFS)</label>
              <input
                type="text"
                value={formData.tokenURI}
                onChange={(e) => setFormData({ ...formData, tokenURI: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <Button type="submit" disabled={isPending || isConfirming}>
                {isPending ? 'Criando...' : isConfirming ? 'Confirmando...' : 'Criar Bateria'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Bateria</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ID da Bateria"
              value={searchBatteryId}
              onChange={(e) => setSearchBatteryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button disabled={!isConnected}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Battery Details */}
      {searchBatteryId && battery && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Detalhes da Bateria #{searchBatteryId}</h2>
            <Button variant="outline">
              QR Code
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Número de Série</p>
              <p className="font-medium text-gray-900">{battery.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Modelo</p>
              <p className="font-medium text-gray-900">{battery.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Capacidade</p>
              <p className="font-medium text-gray-900">{battery.capacity} kWh</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Voltagem</p>
              <p className="font-medium text-gray-900">{battery.voltage} V</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Química</p>
              <p className="font-medium text-gray-900">{battery.chemistry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fabricante</p>
              <p className="font-medium text-gray-900">{battery.manufacturer}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
