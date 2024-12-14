const fs = require('fs');
const path = require('path');

// Create contracts directory if it doesn't exist
const contractsDir = path.join(__dirname, '../client/contracts');
if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
}

// Copy PassportManagement.json from build/contracts to client/contracts
const sourcePath = path.join(__dirname, '../build/contracts/PassportManagement.json');
const destPath = path.join(contractsDir, 'PassportManagement.json');

fs.copyFileSync(sourcePath, destPath);
console.log('Contract artifacts copied to client/contracts'); 