import jwt from 'jsonwebtoken';
import { NextFunc, CustomReq } from '../types';

module.exports = (req: CustomReq, res: Response, next: NextFunc) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) throw new Error();

    const token = authHeader.split(' ')[1]; // Bearer $#$#@T0k3N$##%
    if (!token || token === '') throw new Error();

    const decodedToken: { userId: string } | any = jwt.verify(
      token,
      'supersecretkey'
    );

    if (!decodedToken) throw new Error();

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
