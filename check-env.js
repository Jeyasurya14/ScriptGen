const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.error('Error loading .env:', result.error);
} else {
    console.log('Dotenv parsed:', result.parsed);
}

console.log('Final process.env.DATABASE_URL:', process.env.DATABASE_URL);
