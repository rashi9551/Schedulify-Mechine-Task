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
import redisClient from './redis';
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
    isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            console.log(token, "Token validating...");
    
            if (!token) {
                return res.status(401).json({ message: "Token is missing" });
            }
    
            // Check if token is blacklisted
            const isBlacklisted = await this.isTokenBlacklisted(token);
            if (isBlacklisted) {
                return res.status(StatusCode.Unauthorized).json({ message: "Token is blacklisted" });
            }
    
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "Rashid") as DecodedToken;
            console.log(decoded, "Decoded token");
    
            if (!decoded) {
                return res.status(StatusCode.Unauthorized).json({ message: 'Invalid token' });
            }
    
            // Attach userId to request object for future use
            req.userId = decoded.id;
    
            // Proceed to next middleware or controller
            next();
        } catch (e) {
            console.error(e);
            return res.status(StatusCode.Unauthorized).json({ message: "Token authentication failed" });
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


    public async logout(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization?.split(' ')[1]; // Extract the JWT token
            if (!token) {
                return res.status(StatusCode.BadRequest).json({ message: 'Token not provided' });
            }

            // Add the token to the Redis blacklist
            const tokenExpireTime = 3600; // Set TTL (should match JWT expiration)
            await redisClient.setEx(token, tokenExpireTime, 'blacklisted');

            return res.status(StatusCode.OK).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Error logging out:', error);
            return res.status(StatusCode.InternalServerError).json({ error: 'Error logging out' });
        }
    }

    async isTokenBlacklisted(token: string): Promise<boolean | null> {
        try {
            const result = await redisClient.get(token);
            return result === 'blacklisted';
            
        } catch (error) {
          console.log(error);
          return null
        }
    }
    
    
}
