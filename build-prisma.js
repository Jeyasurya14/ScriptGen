/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
const { execSync } = require('child_process');
const path = require('path');

// Load env vars
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
    console.error('Error loading .env:', result.error);
    process.exit(1);
}

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL ? 'YES' : 'NO');

try {
    console.log('Running prisma generate...');
    // Pass the environment variables to the child process
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: { ...process.env }
    });
    console.log('Prisma generate successful!');
} catch (error) {
    console.error('Prisma generate failed:', error);
    process.exit(1);
}
