"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const SECRET = config_1.config.JWTS;
const Auth = (req, res, next) => {
    const token = req.headers["token"];
    const decoded = jsonwebtoken_1.default.verify(token, SECRET);
    if (decoded) { //@ts-ignore  
        req.id = decoded.id;
        next();
    }
    else {
        res.json({ message: "You are not logged in" });
    }
};
exports.Auth = Auth;
