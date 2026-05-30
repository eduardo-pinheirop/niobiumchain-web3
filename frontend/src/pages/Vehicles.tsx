import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '../components/Button'
import { useVehicleTracking, useVehicleInfo } from '../hooks/useVehicleTracking'
import { Car } from 'lucide-react'

export function Vehicles() {
  const { isConnected } = useAccount()
  const [searchVehicleId, setSearchVehicleId] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { vehicle, isLoading } = useVehicleInfo(Number(searchVehicleId))
  const { createNewVehicle, isPending, isConfirming } = useVehicleTracking()

  const [formData, setFormData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    vehicleType: '',
    tokenURI: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createNewVehicle({
        vin: formData.vin,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        vehicleType: formData.vehicleType,
        tokenURI: formData.tokenURI,
      })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating vehicle:', error)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Veículos</h1>
          <p className="mt-2 text-gray-600">Registro e rastreamento de veículos elétricos</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!isConnected}
        >
          Novo Veículo
        </Button>
      </div>

      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600">
              <Car className="w-6 h-6" />
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Criar Novo Veículo</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Veículo</label>
              <input
                type="text"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
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
                {isPending ? 'Criando...' : isConfirming ? 'Confirmando...' : 'Criar Veículo'}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Veículo</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ID do Veículo"
              value={searchVehicleId}
              onChange={(e) => setSearchVehicleId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button disabled={!isConnected}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Vehicle Details */}
      {searchVehicleId && vehicle && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Detalhes do Veículo #{searchVehicleId}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">VIN</p>
              <p className="font-medium text-gray-900">{vehicle.vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fabricante</p>
              <p className="font-medium text-gray-900">{vehicle.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Modelo</p>
              <p className="font-medium text-gray-900">{vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ano</p>
              <p className="font-medium text-gray-900">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo</p>
              <p className="font-medium text-gray-900">{vehicle.vehicleType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Localização</p>
              <p className="font-medium text-gray-900">{vehicle.currentLocation}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
