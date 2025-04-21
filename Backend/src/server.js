import express from 'express';
import dotenv from 'dotenv';
import root from './routes/root.route.js';
import cors from 'cors';
import { dbConnect } from './dbConnect/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
// cronjob for schedule
// import './utils/cronjobForSchedule.js';
// cronjob for sensorData
// import './utils/cronjobForSensorData.js';
import { errorMiddleWare } from './middleWares/errorMiddleware.middleware.js';

dotenv.config({ path: './../Backend/config/.env' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(
//     cors({
//         origin: [
//             'http://localhost:5173',
//             'https://app.ohstem.vn/',
//             'http://localhost:5174',
//         ],
//         method: ['POST', 'PUT', 'DELETE', 'GET'],
//         credentials: true, //allow cookie be sent with request.
//     })
// );

const whitelist = [
    'https://dadn-cnpmf-2hpi.vercel.app',
    'http://localhost:5173',
];

app.use(
    cors({
        origin: true,
        methods: ['POST', 'PUT', 'DELETE', 'GET'],
        allowedHeaders: ['Content-Type', 'Authorization'], // Add any custom headers you might use
        credentials: true,
    })
);

// 👇 Xử lý preflight requests (quan trọng khi dùng credentials!)
app.options('*', cors());

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
                url:
                    process.env.NODE_ENV === 'DEVELOPMENT'
                        ? `http://localhost:${process.env.PORT}`
                        : 'https://smart-home-iot-backend.onrender.com',
            },
        ],
    },
    apis: [path.resolve(__dirname, './controller/*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        swaggerOptions: {
            withCredentials: true,
            persistAuthorization: true,
        },
    })
);
console.log(
    `The api can see on ${
        process.env.NODE_ENV === 'DEVELOPMENT'
            ? 'localhost:' + process.env.PORT
            : 'https://dadn-cnpmf.onrender.com'
    }/api-docs`
);

app.use(root);
await dbConnect();

app.use(errorMiddleWare);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is listening on the PORT ${process.env.PORT || 8080}`);
});
