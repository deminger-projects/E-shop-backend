import express, {Express} from "express";
import cors from 'cors';
import fileUpload from 'express-fileupload'
import bp from 'body-parser';
import {router} from './routes.js';

require("dotenv").config()

const app: Express = express();

app.use(cors())   //enable the express server to respond to preflight requests

app.use(bp.urlencoded({extended: true}));   //support parsing of application/x-www-form-urlencoded post data
app.use(bp.json())    // support parsing of application/json type post data
app.use(fileUpload())   //file support

app.use(express.static('public'))

app.use('/', router)  // pristupuje k app.post/get requestum

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log("server on port " + port)
});
