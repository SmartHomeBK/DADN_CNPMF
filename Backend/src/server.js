import express from 'express';
import dotenv from 'dotenv';
import root from './routes/root.route.js';
import cors from 'cors';
import { dbConnect } from './dbConnect/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// cronjob for schedule
import './service/cronjob.js';

dotenv.config({ path: './../Backend/config/.env' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://app.ohstem.vn/',
            'http://localhost:5174',
        ],
        method: ['POST', 'PUT', 'DELETE', 'GET'],
        credentials: true, //allow cookie be sent with request.
    })
);

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IoT System API',
            version: '1.0.0',
            description: 'API documentation for the IoT system backend',
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description:
                        'Enter JWT token in format: Bearer <your_token>',
                },
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: [path.resolve(__dirname, './controller/*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log(`The api can see on localhost:${process.env.PORT}/api-docs`);

app.use(root);
await dbConnect();

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on the PORT ${process.env.PORT}`);
});
