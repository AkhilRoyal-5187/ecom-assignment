import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET 
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    try{
        const decoded = jwt.verify(token, secret );
        req.user = decoded;
        console.log('decoded token', decoded);

        if(req.user.role !== 'admin'){
            return res.status(403).json({message: 'Permission denied'});
        }else{
            next();
        }
    }catch(error){
        console.error('Token verification error:', error);
        return res.status(401).json({message: 'Invalid token'});
    }   
};

export default verifyAdmin;