import jwt from "jsonwebtoken"
export const userAuth = async(req,res,next) => {
    try {
        const token = req.cookies.accessToken;

        if(!token){
            return res.status(401).json({ message: "Access Denied. authentication fail." });
        }

        const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decode
        next();
    } catch (error) {
       return res.status(400).json({ message: "Invalid Token",error:error });
    }
}