'use client';

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import PassportManagement from '../contracts/PassportManagement.json';
import config from '../config/config';

interface Web3Error {
  message: string;
}

interface NetworkConfig {
  events: {};
  links: {};
  address: string;
  transactionHash: string;
}

interface ContractNetworks {
  [key: number]: NetworkConfig;
}

interface PassportManagementContract extends Omit<typeof PassportManagement, 'networks'> {
  networks: ContractNetworks;
}

export default function Home() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState<string>('');

  // Verification states
  const [verifyAddress, setVerifyAddress] = useState<string>('');
  const [verifyAge, setVerifyAge] = useState<string>('');
  const [passportData, setPassportData] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string>('');

  // Function to handle account changes
  const handleAccountChange = async (accounts: string[]) => {
    if (accounts.length > 0) {
      const newAccount = accounts[0];
      setAccount(newAccount);
      setIsAdmin(newAccount.toLowerCase() === config.adminAddress.toLowerCase());
      // Clear verification data for security
      setPassportData(null);
      setVerifyError('');
      setVerifyAddress('');
      setVerifyAge('');
    }
  };

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.getAccounts();
          const networkId = await web3Instance.eth.net.getId();
          
          const typedPassportManagement = PassportManagement as PassportManagementContract;
          const deployedNetwork = typedPassportManagement.networks[Number(networkId)];
          
          if (!deployedNetwork) {
            setRegisterError('Contract not deployed to detected network');
            return;
          }

          const contractInstance = new web3Instance.eth.Contract(
            PassportManagement.abi,
            deployedNetwork.address
          );
          
          setWeb3(web3Instance);
          setContract(contractInstance);
          await handleAccountChange(accounts);

          // Add account change listener
          window.ethereum.on('accountsChanged', handleAccountChange);
        } catch (error) {
          console.error("Error initializing Web3:", error);
          setRegisterError('Error connecting to blockchain network');
        }
      }
    };
    init();

    // Cleanup listener on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !web3) return;

    // Reset messages
    setRegisterError('');
    setRegisterSuccess('');

    try {
      const birthdateTimestamp = new Date(birthdate).getTime() / 1000;
      await contract.methods
        .register(name, parseInt(age), birthdateTimestamp, country)
        .send({ from: account });
      
      setRegisterSuccess("Passport registered successfully!");
      // Clear form
      setName('');
      setAge('');
      setBirthdate('');
      setCountry('');
    } catch (error: unknown) {
      const web3Error = error as Web3Error;
      console.error("Error registering passport:", web3Error);
      setRegisterError("Error registering passport. Please try again.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !web3) return;

    // Reset error and passport data
    setVerifyError('');
    setPassportData(null);

    try {
        let result;
        if (isAdmin) {
            try {
                result = await contract.methods.verify(verifyAddress, 0).call({ 
                    from: account,
                    gas: 3000000
                });
            } catch (error: unknown) {
                const web3Error = error as Web3Error;
                console.error('Admin verification error:', web3Error);
                if (web3Error.message.includes('No passport found')) {
                    setVerifyError("No passport found for this address");
                } else {
                    setVerifyError("Error verifying passport as admin");
                }
                return;
            }
        } else {
            if (!verifyAge) {
                setVerifyError("Age is required for verification");
                return;
            }
            try {
                result = await contract.methods.verify(verifyAddress, parseInt(verifyAge)).call({ 
                    from: account,
                    gas: 3000000
                });
            } catch (error: unknown) {
                const web3Error = error as Web3Error;
                console.error('Public verification error:', web3Error);
                if (web3Error.message.includes('No passport found')) {
                    setVerifyError("No passport found for this address");
                } else if (web3Error.message.includes('Invalid age')) {
                    setVerifyError("Invalid age provided. Please check your input.");
                } else {
                    setVerifyError("Error verifying passport. Please try again.");
                }
                return;
            }
        }

        setPassportData({
            name: result.name,
            age: result.age,
            birthdate: new Date(Number(result.birthdate) * 1000).toLocaleDateString(),
            country: result.country,
            passportId: result.passportId
        });
    } catch (error: unknown) {
        const web3Error = error as Web3Error;
        console.error("Error verifying passport:", web3Error);
        setVerifyError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Passport Management System</h1>
      
      {/* Registration Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Register Passport</h2>
        {registerError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {registerError}
          </div>
        )}
        {registerSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {registerSuccess}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </button>
        </form>
      </div>

      {/* Verification Form */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Verify Passport</h2>
        {verifyError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {verifyError}
          </div>
        )}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Address to verify"
              value={verifyAddress}
              onChange={(e) => setVerifyAddress(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          {!isAdmin && (
            <div>
              <input
                type="number"
                placeholder="Age"
                value={verifyAge}
                onChange={(e) => setVerifyAge(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          )}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Verify
          </button>
        </form>

        {/* Display Passport Data */}
        {passportData && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-xl font-bold mb-2">Passport Information</h3>
            <p>Name: {passportData.name}</p>
            <p>Age: {passportData.age}</p>
            <p>Birthdate: {passportData.birthdate}</p>
            <p>Country: {passportData.country}</p>
            <p>Passport ID: {passportData.passportId}</p>
          </div>
        )}
      </div>
    </main>
  );
}