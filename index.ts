import express, {Express} from "express";
import cors from 'cors';
import fileUpload from 'express-fileupload'
import bp from 'body-parser';
require("dotenv").config()

import {router} from './routes.js';
import update_not_user_data from "./controller/file_handlers/updates/update_not_user_data.js";

const app: Express = express();

app.use(cors())   //enable the express server to respond to preflight requests

app.use(bp.urlencoded({extended: true}));   //support parsing of application/x-www-form-urlencoded post data
app.use(bp.json())    // support parsing of application/json type post data
app.use(fileUpload())   //file support

app.use(express.static('public'))

app.use('/', router)  // pristupuje k app.post/get requestum

console.log("node js jedo more")

//process.env.PORT
//4354
//8001

app.listen(8001, () => {          // zapne server na portu 8001
  console.log("Server running successfully on 8001");
})