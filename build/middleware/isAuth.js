"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
module.exports = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader)
            throw new Error();
        const token = authHeader.split(' ')[1]; // Bearer $#$#@T0k3N$##%
        if (!token || token === '')
            throw new Error();
        const decodedToken = jsonwebtoken_1.default.verify(token, 'supersecretkey');
        if (!decodedToken)
            throw new Error();
        req.isAuth = true;
        req.userId = decodedToken.userId;
        next();
    }
    catch (err) {
        req.isAuth = false;
        return next();
    }
};
