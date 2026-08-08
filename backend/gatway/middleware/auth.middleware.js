import jwt from "jsonwebtoken"
import redis from "../config/redis.js";

const authenticate = async(req,res,next) => {
    const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. authentication fail." });
    }

    try {
        // 1. Check if token is blacklisted in Redis
        const isBlacklisted = await redis.get(`bl_${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        // 2. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        // 3. Attach user info to request so microservices can use it
        req.user = decoded; 
        next();
    } catch (error) {
        // Agar access token expire ho gaya hai, toh yaha error aayega
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token Expired", code: "TOKEN_EXPIRED" });
            // Frontend is code ko dekh kar automatic refresh token API call karega
        }
        return res.status(400).json({ message: "Invalid Token" });
    }
}

export default authenticate;