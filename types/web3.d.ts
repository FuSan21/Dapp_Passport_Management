import { Contract } from 'web3';

declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
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
  verify(address: string): {
    call(options: { from: string }): Promise<{
      hasPassport: boolean;
      name: string;
      age: string;
      birthdate: string;
      country: string;
      passportId: string;
    }>;
  };
}

export interface PassportContract extends Contract {
  methods: PassportContractMethods;
}