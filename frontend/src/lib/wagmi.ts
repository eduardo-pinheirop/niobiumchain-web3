import { createConfig, http } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    // Só registra o WalletConnect se houver um projectId válido,
    // evitando erros "Unauthorized: invalid key" no relayer.
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId })]
      : []),
  ],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC_URL || 'https://ethereum-rpc.publicnode.com'),
  },
})
