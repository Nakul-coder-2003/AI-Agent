export const extractUser = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No user ID provided by Gateway" });
    }
    
    req.user = { id: userId };
    next();
};