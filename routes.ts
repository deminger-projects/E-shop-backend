import { Router, Request, Response } from "express";

import add_item from "./controller/handle_cart/add_item.js";
import delete_item from "./controller/handle_cart/delete_item.js";

import error_handler from "./controller/middleware/error_handler.js";
import try_catch from "./controller/utils/try_catch.js";
import request_data_transformer from "./controller/middleware/request_data_transformer.js";
import check_for_duplicit_record from "./controller/middleware/check_for_duplicit_record.js";

import insert_records from "./controller/sql/insert_records.js"
import update_records from "./controller/sql/update_records.js";

import login_request_validation from "./controller/middleware/login_request_validation.js";
import register_request_validation from "./controller/middleware/register_request_validation.js";

import update_files from "./controller/file_handlers/updates/update_files.js";
import save_files from "./controller/file_handlers/savers/save_files.js";

import send_emails from "./controller/other/send_emails.js";

import select_request from "./DB/select_request.js";

import update_login_data from "./controller/file_handlers/updates/update_login_data.js";
import update_not_user_data from "./controller/file_handlers/updates/update_not_user_data.js";
import update_admin_data from "./controller/file_handlers/updates/update_admin_data.js";
import udpade_user_data from "./controller/file_handlers/updates/update_user_data.js";
import empty_cart from "./controller/handle_cart/empty_cart.js";
import refund_request_validation from "./controller/middleware/refund_request_validation.js";
import get_products from "./controller/file_handlers/gettets/get_products.js";
import write_json from "./controller/file_handlers/write_json.js";

export const router = Router()  

  router.post('/login_request', request_data_transformer, login_request_validation, try_catch(async function (req: Request, res: Response) {   

    await update_records(["users"], [["login_status"]], [[["Active"]]], req.body.login_request_validation.user_id)

    if(req.body.login_request_validation.user_id == process.env.ADMIN_ID){
      console.log("admin")
      await update_admin_data(req.body.login_request_validation.user_id)
    }else{
      await udpade_user_data(req.body.login_request_validation.user_id)
    }

    res.send({msg: "user loged in", next_status: true, status: true})

  }))
 
  router.post('/logoff_request', request_data_transformer, try_catch(async function (req: Request, res: Response) {   

    await update_records(["users"], [["login_status"]], [[["Inactive"]]], req.body.record_id)

    await update_login_data(req.body.user_id)

    res.send({msg: "user loged off", next_status: true, status: true})

  }))


  router.post('/register_request', request_data_transformer, register_request_validation, try_catch(async function (req: Request, res: Response) {   

    const transformed_data = req.body.transformed_data

    const record_id = await insert_records(transformed_data.tables, transformed_data.columns, transformed_data.values)

    await udpade_user_data(Number(record_id))

    res.send({msg: "user registred", next_status: true, status: true})

  }))






  router.post('/add_record', request_data_transformer, check_for_duplicit_record, try_catch(async function (req: Request, res: Response) {   

    const transformed_data = req.body.transformed_data

    var record_id = await insert_records(transformed_data.tables, transformed_data.columns, transformed_data.values)

    if(req.files){
      await save_files("../client/public/images/" + JSON.parse(req.body.folder) + "/" + record_id, req.files)
    }

    if(req.body.user_id){
      if(req.body.user_id == process.env.ADMIN_ID){
        await update_admin_data(req.body.user_id)
      }else{
        await udpade_user_data(req.body.user_id)
      }
    }else{
      await update_not_user_data()
    }

    if(req.body.order){
      empty_cart()
    }

    res.send({msg: "record added", next_status: true, status: true})

  }))  

  router.post('/edit_record', request_data_transformer, check_for_duplicit_record, try_catch(async function (req: Request, res: Response) { 

    const transformed_data = req.body.transformed_data

    if(req.body.files_names_to_keep){
      await update_records(transformed_data.tables, transformed_data.columns, transformed_data.values, JSON.parse(req.body.record_id), JSON.parse(req.body.files_names_to_keep))
    }else{
      await update_records(transformed_data.tables, transformed_data.columns, transformed_data.values, JSON.parse(req.body.record_id))
    }
  
    if(req.files){
      await update_files(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id), req.files)
    }else if(req.body.files_names_to_keep){
      await update_files(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id))
    }

    if(req.body.user_id){
      if(req.body.user_id == process.env.ADMIN_ID){
        await update_admin_data(req.body.user_id)
      }else{
        await udpade_user_data(req.body.user_id)
      }
    }else{
      await update_not_user_data()
    }

    if(req.body.psw_change){
      res.send({msg: "password changed", next_status: true})
    }

    res.send({msg: "record edited", next_status: true})
  }))  


  router.post('/change_record_status', request_data_transformer, try_catch(async function (req: Request, res: Response) { 

    const transformed_data = req.body.transformed_data

    await update_records(transformed_data.tables, transformed_data.columns, transformed_data.values, req.body.record_id)
 
    if(req.body.user_id){
      if(req.body.user_id == process.env.ADMIN_ID){
        await update_admin_data(req.body.user_id)
      }else{
        await udpade_user_data(req.body.user_id)
      }
    }else{
      await update_not_user_data()
    }

    res.send({msg: "status changed", next_status: true, status: true})

  }))  


 






  router.post('/add_to_cart', try_catch(async function (req: Request, res: Response) {   

    add_item(JSON.parse(req.body.product), JSON.parse(req.body.selected_size))
    
    res.send({msg: "added to cart"})

  }))

  router.post('/delete_from_cart', try_catch(async function (req: Request, res: Response) {   

    delete_item(req.body.pozition)
    
    res.send({msg: "deleted from cart"})

  }))







  router.post('/refund_request', request_data_transformer, check_for_duplicit_record, refund_request_validation, try_catch(async function (req: Request, res: Response) {   
    
    var code = Math.floor(100000 + Math.random() * 900000).toString()

    send_emails([req.body.transformed_data.email], code)

    var refund_products = await select_request("SELECT products.id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products ON products.id = order_products.product_id WHERE order_id = ?;", req.body.order_data[0].id)

    if(req.body.user_id){
      if(req.body.user_id == process.env.ADMIN_ID){
        await update_admin_data(req.body.user_id)
      }else{
        await udpade_user_data(req.body.user_id)
      }
    }else{
      await update_not_user_data()
    }
    
    res.send({msg: "order found", next_status: true, status: true, code: code, data: {refunds: [req.body.order_data[0]], order_products: refund_products}})

  }))



  router.post('/test_request', try_catch(async function (req: Request, res: Response) {   

    var data: any = await Promise.all([write_json(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", 
    
    "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"])])

    res.send(JSON.parse(data))

  }))




  router.post('/send_aut_code', request_data_transformer, check_for_duplicit_record, try_catch(async function (req: Request, res: Response) {   

    var code = Math.floor(100000 + Math.random() * 900000).toString()

    send_emails([req.body.transformed_data.email], code)

    res.send({msg: "order found", next_status: true, status: true, code: code, record_id: req.body.user_id_auth})

  }))

  router.use(error_handler)