import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './Button'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{address.slice(0, 6)}...{address.slice(-4)}</span>
          <span className="ml-2 text-xs text-gray-400">({chain?.name})</span>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          icon={<LogOut className="w-4 h-4" />}
        >
          Desconectar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={!connector.ready || isPending}
          icon={<Wallet className="w-4 h-4" />}
        >
          {isPending ? 'Conectando...' : `Conectar ${connector.name}`}
        </Button>
      ))}
    </div>
  )
}
