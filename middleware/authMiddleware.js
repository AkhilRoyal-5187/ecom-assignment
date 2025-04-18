import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';    
dotenv.config();

const authMiddleware = (allowedRoles = [])=>{
    return (req, res, next) => {

        const token = req.headers["x-access-token"]; 
        

        if (!token) {
          return res.status(403).json({ message: "please provide a valid token" });
        }
        
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          req.user = decoded;
        
          if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ message: "you are not authorized to access this resource" });
          }
        
          next();
        } catch (error) {
          return res.status(403).json({ message: "invalid token" });
        }
        
    };
};

export default authMiddleware;
