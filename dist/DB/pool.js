"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mysql = __importStar(require("mysql"));
// export const pool = mysql.createPool({
//     host: 'viaduct.proxy.rlwy.net',
//     user: 'root',
//     password: '5c5hbH22f3dddAF-D23D6-545CGbGdf2',
//     database: 'railway',   
//     port: 43545,
//     connectionLimit: 10,
//     multipleStatements: false
//   })
exports.pool = mysql.createPool({
    host: 'srv1342.hstgr.io',
    user: 'u976476949_pepa',
    password: '4oVEqeZ!',
    database: 'u976476949_joynda_shop',
    connectionLimit: 10,
    multipleStatements: false
});
// export const pool = mysql.createPool({ //local
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'eshop_2022',   
//   connectionLimit: 10,
//   multipleStatements: false
// }) 
