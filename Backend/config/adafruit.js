import dotenv from 'dotenv';

dotenv.config({ path: 'config/.env' });

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

// Base URL for Adafruit IO
const BASE_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds`;

// Headers for Adafruit IO requests
const headers = {
    'X-AIO-Key': AIO_KEY,
    'Content-Type': 'application/json',
};

export { BASE_URL, headers };
