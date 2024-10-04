const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: "Session expired" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
