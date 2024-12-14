const fs = require('fs');
const path = require('path');

// Read the admin address from command line argument
const adminAddress = process.argv[2];

if (!adminAddress) {
    console.error('Please provide an admin address as an argument');
    console.error('Example: node scripts/updateConfig.js 0x123...');
    process.exit(1);
}

// Config file paths
const configFiles = [
    path.join(__dirname, '../config.js'),
    path.join(__dirname, '../migrations/config.js'),
    path.join(__dirname, '../client/config/config.ts')
];

// Update each config file
configFiles.forEach(filePath => {
    let content;
    if (filePath.endsWith('.ts')) {
        // TypeScript config format
        content = `const config = {
    adminAddress: "${adminAddress}",
    // Add any other global configurations here
} as const;

export default config;`;
    } else {
        // JavaScript config format
        content = `module.exports = {
    adminAddress: "${adminAddress}"
};`;
    }

    try {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error);
    }
});

console.log('All config files have been updated!'); 