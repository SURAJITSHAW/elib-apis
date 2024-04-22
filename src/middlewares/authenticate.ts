import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../utils/config";


const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return next(createHttpError(401, "No token provided"))
    }
    const jwtToken = token.split(" ").at(-1)
    try {
        const decoded = verify(jwtToken as string, config.jwt_secret as string);
        console.log(decoded);
        
        // req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
}

export default authenticate;