import { Web3Provider } from '@/context/Web3Context';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Passport DApp',
  description: 'Blockchain-based Passport Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}