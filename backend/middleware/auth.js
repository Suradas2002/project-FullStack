import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'
dotenv.config()

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) return res.status(401).json({ message: 'Access Token Required' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token', error: err.message });
        }
        req.user = user;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
        }
        next();
    };
};

export {
    authenticateToken,
    checkRole,
};
