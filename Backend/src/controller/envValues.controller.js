import axios from 'axios';
import dotenv from 'dotenv';
import { BASE_URL, headers } from '../../config/adafruit.js';

dotenv.config({ path: './../Backend/config/.env' });

/**
 * @swagger
 * /api/env/humid:
 *   get:
 *     summary: Get environment values (humidity, temperature, light)
 *     description: Fetches the latest humidity, temperature, and light values from Adafruit IO.
 *     tags:
 *       - Environment
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved environment values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 humid:
 *                   type: number
 *                   example: 55.5
 *                 temp:
 *                   type: number
 *                   example: 27.3
 *                 light:
 *                   type: number
 *                   example: 500
 *       500:
 *         description: Failed to fetch environment data
 */
export const getEnvironmentValues = async (req, res) => {
    try {
        const [humidRes, tempRes, lightRes] = await Promise.all([
            axios.get(`${BASE_URL}/humid`, { headers }),
            axios.get(`${BASE_URL}/temperature`, { headers }),
            axios.get(`${BASE_URL}/light`, { headers }),
        ]);

        // Destructure lấy dữ liệu cần
        const { last_value: humid } = humidRes.data;
        const { last_value: temp } = tempRes.data;
        const { last_value: light } = lightRes.data;
        console.log('data from getHumid: ', humid, temp, light);
        // Gửi response về client
        res.json({ humid, temp, light });
    } catch (error) {
        console.error(
            'Error fetching humid data:',
            error.response ? error.response.data : error.message
        );
        res.status(500).json({ error: 'Failed to fetch humid data' });
    }
};
