'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Web3 } from 'web3';
import type { Contract, ContractAbi } from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

// Import the ABI from the contract JSON
import contractAbi from '../contracts/PassportManagement.json';

type PassportAbi = typeof contractAbi.abi;

interface Web3ContextType {
  web3: Web3 | null;
  account: string | null;
  contract: Contract<PassportAbi> | null;
}

interface Web3ProviderProps {
  children: ReactNode;
}

type PassportContract = Contract<PassportAbi> & {
  methods: {
    register: (
      name: string,
      age: number,
      birthdate: number,
      country: string
    ) => {
      send: (options: { from: string }) => Promise<any>;
    };
    verify: (address: string) => {
      call: (options: { from: string }) => Promise<{
        hasPassport: boolean;
        name: string;
        age: string;
        birthdate: string;
        country: string;
        passportId: string;
      }>;
    };
  };
}

const Web3Context = createContext<Web3ContextType>({
  web3: null,
  account: null,
  contract: null,
});

export function Web3Provider({ children }: Web3ProviderProps) {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<PassportContract | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = await detectEthereumProvider();
        
        if (provider) {
          const web3Instance = new Web3(provider as any);
          setWeb3(web3Instance);

          const accounts = await (window as any).ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          setAccount(accounts[0]);
          
          const contractInstance = new web3Instance.eth.Contract(
            contractAbi.abi,
            contractAbi.networks['1337'].address
          ) as unknown as PassportContract;
          
          setContract(contractInstance);

          (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
            setAccount(accounts[0]);
          });
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };

    init();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, account, contract }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}