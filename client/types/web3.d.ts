import { Contract } from 'web3';
import { PassportData } from './passport';

declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

export interface PassportContractMethods {
  register(
    name: string,
    age: number,
    birthdate: number,
    country: string
  ): {
    send(options: { from: string }): Promise<any>;
  };
  verify(address: string, age: number): {
    call(options: { from: string; gas?: number }): Promise<{
      hasPassport: boolean;
      name: string;
      age: number;
      birthdate: number;
      country: string;
      passportId: number;
    }>;
  };
}

export interface PassportContract {
  methods: PassportContractMethods;
}

export interface Web3Error {
  message: string;
}

export interface NetworkConfig {
  events: {};
  links: {};
  address: string;
  transactionHash: string;
}

export interface ContractNetworks {
  [key: number]: NetworkConfig;
}

export interface PassportManagementContract extends Omit<typeof PassportManagement, 'networks'> {
  networks: ContractNetworks;
}