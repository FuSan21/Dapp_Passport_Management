# Passport Management DApp

A decentralized application for managing passport data using blockchain technology. The system allows users to register their passport information and verify other users' passports with proper age verification.

## Prerequisites

1. Node.js (v18.18.0+ required)
2. npm
3. Ganache (for local blockchain)
4. MetaMask browser extension
5. Truffle (`npm install -g truffle`)

## Project Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/FuSan21/Dapp_Passport_Management.git
    cd Dapp_Passport_Management
    ```

2. Install dependencies:
    ```bash
    # Install root dependencies
    npm install

    # Install client dependencies
    cd client
    npm install
    cd ..
    ```

3. Configure Ganache:
    - Start Ganache
    - Create a new workspace
    - Server URL: `http://127.0.0.1:8545`
    - Network ID: `1337`

4. Configure MetaMask:
    - Open MetaMask
    - Add a new network with the following details:
        - Network Name: Ganache
        - RPC URL: http://127.0.0.1:8545
        - Chain ID: 1337
        - Currency Symbol: ETH
    - Import accounts from Ganache using private keys

5. Update Admin Address:
    ```bash
    # Update the admin address in all config files
    npm run update-admin <your-admin-address>
    ```

## Deployment

1. Compile the smart contracts:
```bash
truffle compile
```

2. Deploy the contracts:
```bash
truffle migrate --reset
```

3. Copy contract artifacts to client:
```bash
npm run postcompile
```

## Running the Application

1. Start the Next.js development server:
```bash
cd client
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Using the DApp

### As an Admin
1. Connect MetaMask using the admin account
2. You can verify any passport by providing just the address
3. No age verification required for admin

### As a Regular User
1. Connect MetaMask using any account
2. Register your passport with:
   - Name
   - Age
   - Birthdate
   - Country
3. Verify other passports by providing:
   - Address
   - Correct age of the passport holder

## Features

- Secure passport registration
- Age-verified passport data access
- Admin privileges for unrestricted verification
- MetaMask integration for secure transactions
- Real-time account switching support
- Responsive UI with error handling

## Security Features

- Only admin can verify without age
- All non-admin users (including passport owners) must provide correct age
- Automatic data clearing on account switch
- Error handling for invalid inputs
- Contract-level access control

## Project Structure

```
passport-dapp/
├── contracts/               # Smart contracts
├── migrations/             # Truffle migrations
├── client/                # Next.js frontend
│   ├── app/              # Pages
│   ├── config/           # Client configuration
│   └── contracts/        # Contract artifacts
├── scripts/              # Utility scripts
├── test/                 # Contract tests
└── truffle-config.js     # Truffle configuration
```

## Common Issues and Solutions

1. **MetaMask Connection Issues**
   - Ensure you're on the correct network (Ganache)
   - Reset MetaMask account if transactions are pending

2. **Contract Deployment Issues**
   - Ensure Ganache is running
   - Check if the network ID matches in truffle-config.js

3. **Verification Errors**
   - Admin: No age required
   - Regular users: Must provide correct age
   - Check if the address exists in the system

## Development Notes

- The admin address is configured in multiple locations for different environments
- Use the `update-admin` script to maintain consistency
- Contract redeployment requires running the postcompile script
- Account changes automatically clear verification data for security