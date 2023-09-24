import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    // read the token from header or url
    const token = req.headers['x-access-token'] as string;
    // token does not exist
    if (!token) {
        return res.status(401).send({
            message: 'Access Denied. No token provided.'
        });
    }
    // token exists
    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET! as string, (err: unknown, result: unknown) => {
        if (err) {
            return res.status(401).send({
                message: 'Invalid Token'
            });
        } else {
            req.body.username = (result as { username: string }).username;
            req.body.userid = (result as { id: number }).id;
            next();
        }
    });
}

export default validateToken;