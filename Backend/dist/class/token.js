"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    static getToken(palyload) {
        return jsonwebtoken_1.default.sign({
            usuario: palyload
        }, this.seed, {
            expiresIn: this.caducidad
        });
    }
    static checkToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this.seed, (error, decode) => {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(decode);
                }
            });
        });
    }
}
Token.seed = 'estaEsElSeed';
Token.caducidad = '1d';
exports.default = Token;
