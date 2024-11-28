import { useState, useCallback, useEffect } from 'react';
import type { WalletState, WalletAddress, RpcErrorCode, WalletProvider, AddressPurpose } from '../types/wallet';
import { connectWithTimeout } from '../utils/wallet-connection';
import { WalletConnectionError } from '../utils/errors';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    addresses: [],
    error: null,
    isLoading: false,
    network: null,
  });

  const [provider, setProvider] = useState<WalletProvider | null>(null);

  const connectWallet = useCallback(async (selectedProvider?: WalletProvider) => {
    const providerToUse = selectedProvider || provider;
    
    if (!providerToUse) {
      setWalletState(prev => ({
        ...prev,
        error: 'No wallet provider selected.',
      }));
      return;
    }

    setWalletState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const addresses = await connectWithTimeout(providerToUse);
      setProvider(providerToUse);
      
      setWalletState({
        isConnected: true,
        addresses,
        error: null,
        isLoading: false,
        network: null,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      const walletError = error instanceof WalletConnectionError
        ? error
        : new WalletConnectionError({
            code: RpcErrorCode.DISCONNECTED,
            message: 'Failed to connect wallet',
          });

      setWalletState(prev => ({
        ...prev,
        error: walletError.message,
        isLoading: false,
        isConnected: false,
        addresses: [],
      }));
    }
  }, [provider]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      addresses: [],
      error: null,
      isLoading: false,
      network: null,
    });
    setProvider(null);
  }, []);

  const getAddressByPurpose = useCallback((purpose: AddressPurpose) => {
    return walletState.addresses.find(addr => addr.purpose === purpose);
  }, [walletState.addresses]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    hasProvider: false,
    getAddressByPurpose,
    selectedProvider: provider,
  };
};