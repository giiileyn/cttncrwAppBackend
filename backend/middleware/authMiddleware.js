const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuthenticatedUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // You can now access `req.user` in your routes
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// exports.isAuthenticatedUser = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     console.log('JWT_SECRET used for verify:', process.env.JWT_SECRET); // 🧪 Debug print

//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };


exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user?.role}) is not authorized to access this resource`
            });
        }
        next();
    };
};




