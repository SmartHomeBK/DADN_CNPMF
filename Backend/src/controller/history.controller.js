import History from '../models/history.model.js';
import User from '../models/user.model.js';
import Device from '../models/device.model.js';
import jwt from 'jsonwebtoken';

// Middleware to authenticate using Bearer token
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

    if (!token) {
        return res
            .status(401)
            .json({ error: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT token
        req.user = decoded; // Attach decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get all history entries
 *     description: Fetches all history entries from the system.
 *     tags:
 *       - History
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all history entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device:
 *                     type: string
 *                   user:
 *                     type: string
 *                   message:
 *                     type: string
 *                   time:
 *                     type: string
 *                     format: date-time
 *                   _id:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
const getAllHistory = async (req, res) => {
    try {
        const history = await History.find()
            .populate('device', 'name type status location')
            .populate('user', 'name email');
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/history/search/user/{userName}:
 *   get:
 *     summary: Search history by user name
 *     description: Retrieves history entries for a specific user based on their name.
 *     tags:
 *       - History
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         description: The name of the user to retrieve history for.
 *         schema:
 *           type: string
 *           example: "John Doe"
 *     responses:
 *       200:
 *         description: List of history entries for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device:
 *                     type: string
 *                   user:
 *                     type: string
 *                   message:
 *                     type: string
 *                   time:
 *                     type: string
 *                     format: date-time
 *                   _id:
 *                     type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const getHistoryByUserName = async (req, res) => {
    const { userName } = req.params;

    try {
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const history = await History.find({ user: user._id })
            .populate('device', 'name type status location')
            .populate('user', 'name email');
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history by user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/history/search/device/{deviceName}:
 *   get:
 *     summary: Search history by device name
 *     description: Retrieves history entries for a specific device based on its name.
 *     tags:
 *       - History
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceName
 *         required: true
 *         description: The name of the device to retrieve history for.
 *         schema:
 *           type: string
 *           example: "Temperature Sensor"
 *     responses:
 *       200:
 *         description: List of history entries for the device
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device:
 *                     type: string
 *                   user:
 *                     type: string
 *                   message:
 *                     type: string
 *                   time:
 *                     type: string
 *                     format: date-time
 *                   _id:
 *                     type: string
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal server error
 */
const getHistoryByDeviceName = async (req, res) => {
    const { deviceName } = req.params;

    try {
        const device = await Device.findOne({ name: deviceName });
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const history = await History.find({ device: device._id })
            .populate('device', 'name type status location')
            .populate('user', 'name email');
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history by device:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Apply authenticate middleware to protect routes that require authentication
export {
    authenticate,
    getAllHistory,
    getHistoryByUserName,
    getHistoryByDeviceName,
};
