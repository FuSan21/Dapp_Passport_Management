'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import type { PassportFormData, PassportData } from '@/types/passport';

export default function Home() {
  const { account, contract } = useWeb3();
  const [formData, setFormData] = useState<PassportFormData>({
    name: '',
    age: '',
    birthdate: '',
    country: ''
  });
  const [verificationAddress, setVerificationAddress] = useState<string>('');
  const [passportData, setPassportData] = useState<PassportData | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!contract || !account) return;

      await contract.methods.register(
        formData.name,
        parseInt(formData.age),
        new Date(formData.birthdate).getTime() / 1000,
        formData.country
      ).send({ from: account });
      
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed!');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!contract || !account) return;

      const result = await contract.methods.verify(verificationAddress)
        .call({ from: account });

      setPassportData({
        exists: result.hasPassport,
        name: result.name,
        age: Number(result.age),
        birthdate: new Date(Number(result.birthdate) * 1000).toLocaleDateString(),
        country: result.country,
        passportId: result.passportId
      });
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Passport Management DApp</h1>
      
      {!account && (
        <div className="bg-yellow-100 p-4 rounded">
          Please connect your MetaMask wallet.
        </div>
      )}

      {account && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Register Passport</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={formData.birthdate}
                onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Register
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Verify Passport</h2>
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                placeholder="Ethereum Address"
                value={verificationAddress}
                onChange={(e) => setVerificationAddress(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button 
                type="submit" 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Verify
              </button>
            </form>
          </div>

          {passportData && (
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Passport Data:</h3>
              {passportData.exists ? (
                <div className="space-y-2">
                  <p>Name: {passportData.name}</p>
                  <p>Age: {passportData.age}</p>
                  <p>Birthdate: {passportData.birthdate}</p>
                  <p>Country: {passportData.country}</p>
                  <p>Passport ID: {passportData.passportId}</p>
                </div>
              ) : (
                <p>No passport found for this address.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}