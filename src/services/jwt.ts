declare global {
    namespace Express {
        interface Request {
            userId?: string; // Add this line to extend the Request type
        }
    }
}
import { NextFunction ,Response,Request} from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { StatusCode } from '../interfaces/enum'
import { DecodedToken } from '../interfaces/interface';

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'Rashid';

export default class JwtControllers {

    createToken= async (userId: ObjectId | string, expire: string,secret:string): Promise<string> => {
        try {
            const token = jwt.sign({ userId }, secret, { expiresIn: expire });
            return token;
        } catch (error) {
            console.error('Error creating token:', error);
            throw new Error('Failed to create token');
        }
    }
    isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            console.log(token,"Token validating...");
            if (!token) {
                return res.status(401).json({ message: "Token is missing" });
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "Rashid") as DecodedToken;
            console.log(decoded,"ithu decoded");
            
            req.userId = decoded?.id;
            if (!decoded) {
                return res.status(StatusCode.Unauthorized).json({ message: 'Invalid token' });
            }    
            next();
        } catch (e) {
            console.error(e);
            res.status(StatusCode.Unauthorized).json({ message: "token authentication failed" });
        }
    };
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshtoken = req.headers.authorization?.split(' ')[1] || ''; // Assuming Bearer token
            if (!refreshtoken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }
    
            const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123') as DecodedToken;
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
    
            console.log('Token refreshed');
    
            const newRefreshToken = jwt.sign({ id: decoded.userId }, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123', {
                expiresIn: '7d',
            });
    
            const newAccessToken = jwt.sign({ id: decoded.userId }, process.env.JWT_SECRET_KEY || 'Rashid', {
                expiresIn: '15m',
            });
    
            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Something went wrong in authentication' });
        }
    };

    socketRefresh = async (refreshtoken: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
        try {
            // Verify the refresh token
            const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123') as DecodedToken;
            if (!decoded) {
                throw new Error('Invalid refresh token');
            }
    
            console.log('Token refreshed');
    
            // Generate new tokens
            const newRefreshToken = jwt.sign({ id: decoded.userId }, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123', {
                expiresIn: '7d',
            });
    
            const newAccessToken = jwt.sign({ id: decoded.userId }, process.env.JWT_SECRET_KEY || 'Rashid', {
                expiresIn: '15m',
            });
    
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (e) {
            console.error(e);
            return null;
        }
    };
    
    
}
