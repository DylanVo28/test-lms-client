import {usePrivy, useWallets} from "@privy-io/react-auth";
import {useMemo} from "react";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import {switchChain} from "@wagmi/core";
import {config} from "./config";
import {base} from "viem/chains";

export const useWalletConnect = () => {
    const { login,  authenticated, user, logout, ready } = usePrivy();
    const { connectors, connect } = useConnect()
    const {connectWallet, } = usePrivy();
    const {wallets} = useWallets();
    const { disconnect: disconnectWagmiFunction } = useDisconnect()
    const {address, isConnected, chainId} = useAccount()
    // const { switchChain } = useSwitchChain()
    
    const disconnect=async ()=>{
        try{
            disconnectWagmiFunction()
        }catch (e) {
        }
    }

    // Check if user is on correct chain (Arbitrum mainnet - 42161)
    const isCorrectChain = chainId === base.id
    
    // Function to switch to Arbitrum mainnet
    const switchToArbitrum = async () => {
        try {
            const wallet= wallets.find(wallet=>wallet.address.toString() === address?.toString())
            wallet?.switchChain(base.id)
            switchChain(config,{ chainId: base.id })
        } catch (error) {
            console.error('Failed to switch chain:', error)
        }
    }

    // Set active wallet function - using Privy's wallet management
    const setActiveWallet = async (walletAddress?: string) => {
        try {
            if (walletAddress) {
                const wallet = wallets.find(w => w.address.toLowerCase() === walletAddress.toLowerCase());
                if (wallet) {
                    // Privy automatically manages active wallet through useWallets
                    // If you need to switch, you can use wallet.switchChain or connectWallet
                    await wallet.switchChain(base.id);
                }
            }
        } catch (error) {
            console.error('Failed to set active wallet:', error);
        }
    }

    const connectorsMemo = useMemo(() => {
        return connectors.filter((connector) => connector.id !== 'injected' )
    }, [connectors]);

    return {
        // connectWallet,
        address,
        connectors:connectorsMemo,
        connect,
        login,  authenticated, user, logout, ready,
        disconnect,
        isCorrectChain,
        switchToArbitrum,
        chainId,
        connectWallet,
        setActiveWallet
    }
}