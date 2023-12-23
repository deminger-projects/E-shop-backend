import express, {Express} from "express";
import cors from 'cors';
import fileUpload from 'express-fileupload'
import bp from 'body-parser';

import {router} from './routes.js';
import load_json_files from "./controller/file_handlers/loaders/load_json_files.js";

const app: Express = express();

app.use(cors())   //enable the express server to respond to preflight requests

app.use(bp.urlencoded({extended: true}));   //support parsing of application/x-www-form-urlencoded post data
app.use(bp.json())    // support parsing of application/json type post data
app.use(fileUpload())   //file support

app.use('/', router)  // pristupuje k app.post/get requestum

load_json_files().then(
  result => {
    app.listen(8001, () => {          // zapne server na portu 8001
      console.log("Server running successfully on 8001");
    })
  }
) // loads needed data

