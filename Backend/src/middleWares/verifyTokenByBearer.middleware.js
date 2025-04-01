import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isUserAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Lấy token sau "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) res.status(404).json({ message: 'Not found' });
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};
