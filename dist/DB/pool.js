"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mysql = require('mysql2');
exports.pool = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: 'kNCTPsadaPxbNEUNROgvqaZjNNkHtIdE',
    database: 'railway',
    connectionLimit: 10,
    multipleStatements: false,
    port: 52153
});
