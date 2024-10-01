import { Router, Request, Response } from "express";

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

import refund_request_validation from "./controller/middleware/refund_request_validation.js";
import write_json from "./controller/file_handlers/write_json.js";
import modify_images from "./controller/file_handlers/modify_images.js";
import validate_user_data from "./controller/middleware/validate_user_data.js";
import send_receipt from "./controller/emails/send_receipt.js";


const bcrypt = require('bcrypt');

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
var endpointSecret: any = undefined


const express = require('express');

export const router = Router()  
  //stripe webhook
  const orderid = require('order-id')('key');


router.post('/webhook', express.raw({type: 'application/json'}), try_catch(async function (req: Request, res: Response) {

  const sig = req.headers['stripe-signature'];

  let data; 
  let event_type;

  if(endpointSecret){

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("webhook verified")
    } catch (err: any) {
      console.log("🚀 ~ router.post ~ err:", err.message)
      console.log("webhook not verified")
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object
    event_type = event.type
  }else{
    data = req.body.data.object
    event_type = req.body.type
  }

  // Handle the event
  if(event_type === "checkout.session.completed"){
    var cunstomer_data = await stripe.customers.retrieve(data.customer)

    var customer_obj = JSON.parse(cunstomer_data.metadata.customer)

    var tables = JSON.parse(cunstomer_data.metadata.tables)
    var columns = JSON.parse(cunstomer_data.metadata.columns)
    var values = JSON.parse(cunstomer_data.metadata.values)

    var email = JSON.parse(cunstomer_data.metadata.email)

    var cart_data = JSON.parse(cunstomer_data.metadata.cart)
    var order_code = JSON.parse(cunstomer_data.metadata.order_code)

    await insert_records(tables, columns, values)

    send_receipt(email, cart_data, order_code, customer_obj)
  }
  
  res.send().end;
}));

  
  //stripe webhook  

 
 
  router.post('/stripe_create_session', request_data_transformer, try_catch(async function (req: Request, res: Response) { 
    
    var items = JSON.parse(req.body.items)

    var delivery = {
      name: "Delivery",
      prize: req.body.delivery_price,
      amount: 1
    }

    items.push(delivery)

    const customer = await stripe.customers.create({
      metadata: {
        tables: JSON.stringify(req.body.transformed_data.tables),
        columns: JSON.stringify(req.body.transformed_data.columns),
        values: JSON.stringify(req.body.transformed_data.values),

        email: JSON.stringify(req.body.transformed_data.email),

        customer: req.body.customer_obj,

        cart: JSON.stringify(items),
        order_code: req.body.order_code,
      }
    }) 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      mode: "payment",
      customer: customer.id,
      line_items: items.map((item: any) => {return {price_data: {currency: "eur", product_data: {name: item.name}, unit_amount: item.prize * 100}, quantity: item.amount}}),
      success_url: process.env.PAGE_URL + "/order-completed",
      cancel_url: process.env.PAGE_URL + "/main" 
  }) 

  res.send({msg: "melo by vratit url stripu", url: session.url, next_status: undefined})
  }))
 
  
 

  router.post('/validate_cart_items', try_catch(async function (req: Request, res: Response) {   

    var products = JSON.parse(req.body.tables)

    var valid = true

    for(let item of products){
      var a = await select_request("SELECT * FROM products WHERE id = ? AND name = ? AND price = ? AND description = ? AND discount = ? AND status = 'Active'", [item.id, item.name, item.price, item.description, item.discount])
      
      if(a.length < 1){
        valid = false 
        break
      }
    }

    if(valid){
      res.send({msg: "all items valid", next_status: true})
    }else{
      res.send({msg: "items not valid, posible manipulation with cookies", next_status: false})
    }
 
  }))



  


  router.post('/generate_order_code', try_catch(async function (req: Request, res: Response) {   

    var test = async () => {
      const order_code = orderid.generate();

      var result = await select_request("select order_code from orders where order_code = " + order_code + "")

      if(result.length > 0){
        await test()
      }else{
        return order_code
      }
    }

    var order_code = await test()
    
    res.send({order_code: order_code})

  }))










  router.post('/login_request', request_data_transformer, login_request_validation, try_catch(async function (req: Request, res: Response) {   

    await update_records(["users"], [["login_status"]], [[["Active"]]], req.body.login_request_validation.user_id)

    const user_data = await select_request("SELECT username, email, password, login_status FROM users WHERE id = ?", req.body.login_request_validation.user_id)

    const user_account_data = await select_request("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", req.body.login_request_validation.user_id)

    res.send({msg: "User successfully logged in", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data})
 
  }))
 
  router.post('/logoff_request', validate_user_data, request_data_transformer, try_catch(async function (req: Request, res: Response) {   

    const record_id = req.body.user_data.id

    await update_records(["users"], [["login_status"]], [[["Inactive"]]], record_id)

    const user_data = await select_request("SELECT id, username, email, password, login_status FROM users WHERE id = ?", record_id)

    const user_account_data = await select_request("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", record_id)

    res.send({msg: "User successfully logged off", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data })

  }))


  router.post('/register_request', request_data_transformer, register_request_validation, try_catch(async function (req: Request, res: Response) {   

    const transformed_data = req.body.transformed_data

    const record_id = await insert_records(transformed_data.tables, transformed_data.columns, transformed_data.values)

    const user_data = await select_request("SELECT id, username, email, password, login_status FROM users WHERE id = ?", [record_id.toString()])

    const user_account_data = await select_request("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", [record_id.toString()])
     
    res.send({msg: "User successfully registered", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data})

  }))
 

  router.post('/check_password', try_catch(async function (req: Request, res: Response) {   

    var user_input = JSON.parse(req.body.userInputPassword)

    var storedHashedPassword = JSON.parse(req.body.storedHashedPassword)

    var psw_check_result = await new Promise((res, rej) => {bcrypt.compare(user_input, storedHashedPassword, (err: any, result: any) => {

      if(err){
        console.log(err)
      } 

      var obj 

      if(result){

      obj = {msg: "passwords match", next_status: true, status: true}
 

      }else{

        obj = {msg: "passwords do not match", next_status: false, status: false}

      }

      res(obj)

    })})

    res.send(psw_check_result)
    
  }))

 
 






  router.post('/add_record', request_data_transformer, check_for_duplicit_record, try_catch(async function (req: Request, res: Response) { 
    
    const transformed_data = req.body.transformed_data

    var record_id = await insert_records(transformed_data.tables, transformed_data.columns, transformed_data.values)

    if(req.files){
      await save_files("./public/images/temp/", req.files, JSON.parse(req.body.folder), record_id)
      modify_images("./public/images/temp/", record_id, JSON.parse(req.body.folder))
    }

    res.send({msg: "Record successfully added", next_status: true, status: true})

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
      modify_images("./public/images/temp/", JSON.parse(req.body.record_id), JSON.parse(req.body.folder))
    }else if(req.body.files_names_to_keep){
      await update_files(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id))
    }

    if(req.body.psw_change){
      return res.send({msg: "Password successfully changed", next_status: true})
    }

    res.send({msg: "Record successfully edited", next_status: true})
  }))  


  router.post('/change_record_status', request_data_transformer, try_catch(async function (req: Request, res: Response) { 

    const transformed_data = req.body.transformed_data

    await update_records(transformed_data.tables, transformed_data.columns, transformed_data.values, req.body.record_id)

    res.send({msg: "status changed", next_status: true, status: true})

  }))  









  router.post('/refund_request', request_data_transformer, check_for_duplicit_record, refund_request_validation, try_catch(async function (req: Request, res: Response) {   
    
    var code = Math.floor(100000 + Math.random() * 900000).toString()

    send_emails([req.body.transformed_data.email], code)

    var refund_products = await select_request("SELECT products.id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products ON products.id = order_products.product_id JOIN orders ON orders.id = order_products.order_id WHERE order_code = ?;", req.body.order_data[0].order_code)
    
    res.send({msg: "order found", next_status: true, status: true, code: code, data: {orders: [req.body.order_data[0]], order_products: refund_products}})

  }))



  router.post('/send_aut_code', request_data_transformer, check_for_duplicit_record, try_catch(async function (req: Request, res: Response) {   

    var code = Math.floor(100000 + Math.random() * 900000).toString()

    send_emails([req.body.transformed_data.email], code)

    res.send({msg: "order found", next_status: true, status: true, code: code, record_id: req.body.user_id_auth})

  })) 





  



  //page data getters


  router.post('/get_user_data', validate_user_data, try_catch(async function (req: Request, res: Response) {   

    const user_data = req.body.user_data

    res.send(JSON.stringify(user_data))

  }))
 
  


  router.post('/main_page_request', try_catch(async function (req: Request, res: Response) {   

    var last_item_id = req.body.last_item_id

    var data: any = await Promise.all([write_json(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%' AND products.id > " + last_item_id + " LIMIT 9;"])])

    res.send(JSON.parse(data))

  }))


  router.post('/get_product_by_id', try_catch(async function (req: Request, res: Response) {   

    var data: any = await Promise.all([write_json(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND products.id = " + JSON.parse(req.body.id) + " AND product_images.image_url like '%_main.%';", 
    
    "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ AND (product_images.image_url NOT LIKE '%_main%' OR product_images.image_url NOT LIKE '%_hover%');"])])

    res.send(JSON.parse(data))

  }))


  //AND (product_images.image_url NOT LIKE '%_main%' OR product_images.image_url NOT LIKE '%_hover%')

  router.post('/get_placed_orders', try_catch(async function (req: Request, res: Response) {   

    const id = req.body.user_data.id

    var data: any = await Promise.all([write_json(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE user_id = " + id + ";", 
    
    "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])])

    res.send(JSON.parse(data))

  }))
  

  router.post('/get_collections', try_catch(async function (req: Request, res: Response) {   

    var data: any = await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
    "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])])
    
    res.send(JSON.parse(data))

  }))

  router.post('/get_collections_showcase', try_catch(async function (req: Request, res: Response) {   

    var last_item_id = req.body.last_item_id

    var data: any = await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id) AND collections.id > " + last_item_id + " LIMIT 9;"])])
    
    res.send(JSON.parse(data))
  

    // old code 
    //var data: any = await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id) AND collections.id > " + last_item_id + " LIMIT 9;",
    //   "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])])
      

  }))

  
  router.post('/get_collection_product_showcase', try_catch(async function (req: Request, res: Response) {   

    const id = req.body.id

    var last_item_id = req.body.last_item_id

    var data: any = await Promise.all([write_json(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%' AND products.collection_id = " + id + " AND products.status = 'Active' AND products.id > " + last_item_id + " LIMIT 9;"])])
    
    res.send(JSON.parse(data))
  

  }))

  router.post('/get_refund_reasons', try_catch(async function (req: Request, res: Response) {   

    var data: any = await Promise.all([write_json(["SELECT id, reason FROM refund_reasons"])])
    console.log("🚀 ~ data:", data)
    
    res.send(JSON.parse(data))

  }))

















  router.post('/get_user_refunds', validate_user_data, try_catch(async function (req: Request, res: Response) {   

    const id = req.body.user_data.id

    var data: any = await Promise.all([write_json(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE orders.add_date + INTERVAL -30 DAY <= NOW() && user_id = " + id + ";",
    
    "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])])
    
    res.send(JSON.parse(data))

  }))

  router.post('/get_user_acccount_data', validate_user_data, try_catch(async function (req: Request, res: Response) {   

    const id = req.body.user_data.id

    var data: any = await Promise.all([write_json(["SELECT users.id, users.login_status, users.username, users.email, users.password FROM users WHERE users.id = " + id + " && users.login_status = 'Active' ;", 
    
    "SELECT user_data.id, user_data.user_id, user_data.name, user_data.surname, user_data.phone, user_data.adress, user_data.city, user_data.postcode, user_data.status, users.email FROM user_data JOIN users ON users.id = user_data.user_id WHERE user_id = " + id + " AND status = 'Active';"])])

    res.send(JSON.parse(data))

  }))

  router.post('/get_user_avaible_returns', validate_user_data, try_catch(async function (req: Request, res: Response) {   

    var last_item_id = req.body.last_item_id

    const id = req.body.user_data.id

    var data: any = await Promise.all([write_json(["SELECT orders.id, orders.order_code, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date FROM orders WHERE orders.status = 'Active' && orders.user_id = " + id + " && (SELECT COUNT(refunds.id) FROM refunds WHERE orders.id = refunds.order_id && user_id = " + id + ") < 1 && (orders.add_date + INTERVAL +30 DAY - NOW()) >= 0 AND orders.id > " + last_item_id + " LIMIT 3;",
    
    "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])])
    
    res.send(JSON.parse(data)) 

  }))

  router.post('/get_user_place_returns', validate_user_data, try_catch(async function (req: Request, res: Response) {   

    const id = req.body.user_data.id

    var last_item_id = req.body.last_item_id

    var data: any = await Promise.all([write_json(["SELECT orders.id, orders.order_code, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders ON orders.id = refunds.order_id WHERE orders.user_id = " + id + " AND orders.id > " + last_item_id + " LIMIT 3;",
    
    "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])])
    
    res.send(JSON.parse(data))

  }))

  router.post('/get_user_placed_orders', validate_user_data, try_catch(async function (req: Request, res: Response) {   

    var last_item_id = req.body.last_item_id
    
    const id = req.body.user_data.id

    var data: any = await Promise.all([write_json(["SELECT orders.id, orders.order_code, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE user_id = " + id + " AND orders.id > " + last_item_id + " LIMIT 3;", 
    
    "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])])

    res.send(JSON.parse(data))

  }))







 


  
  router.post('/get_admin_collections', try_catch(async function (req: Request, res: Response) {   

    // var data: any = await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
    // "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])])

    var data: any = await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';"])])

    res.send(JSON.parse(data))

  }))



router.post('/get_collection_by_id', try_catch(async function (req: Request, res: Response) {   

    // var data: any = await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
    // "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])])

    const id = req.body.id

    var data: any = await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active' AND collections.id = " + id + ";",
    "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])])
    console.log("🚀 ~ data:", data)

    res.send(JSON.parse(data))

  }))


  router.post('/get_admin_products_images', try_catch(async function (req: Request, res: Response) {  

    var id = req.body.id

    var data: any = await Promise.all([write_json(["SELECT product_images.image_url FROM product_images WHERE product_images.product_id = " + id + ";"])])

    res.send(JSON.parse(data))

  }))

  router.post('/get_admin_collection_images', try_catch(async function (req: Request, res: Response) {  

    var id = req.body.id
    console.log("🚀 ~ id:", id)

    var data: any = await Promise.all([write_json(["SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = " + id + ";"])])
    console.log("🚀 ~ data:", data)

    res.send(JSON.parse(data))

  }))



  router.post('/get_admin_products', try_catch(async function (req: Request, res: Response) {  
    
    var last_item_id = req.body.last_item_id

    // var data: any = await Promise.all([write_json(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%' AND products.id > " +last_item_id+ " LIMIT 9;", 
    
    // "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"])])

    var data: any = await Promise.all([write_json(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%' ;"])])

    res.send(JSON.parse(data))

  }))

  router.post('/get_admin_orders', try_catch(async function (req: Request, res: Response) {   

    var where_status = req.body.status

    var data: any = await Promise.all([write_json(["SELECT orders.id, orders.order_code, orders.zasilkovna, orders.country, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders WHERE orders.status = " + where_status + ";", 
    
    "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = $ ;"])])
    res.send(JSON.parse(data))

  }))


  router.post('/get_admin_refunds', try_catch(async function (req: Request, res: Response) {   

    var where_status = req.body.status

    var data: any = await Promise.all([write_json(["SELECT refunds.id, orders.order_code, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE refunds.status = " + where_status + ";",
    
    "SELECT refund_products.product_id, refund_products.amount, refund_products.size, products.name, refund_reasons.reason, products.price FROM refund_products JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_reasons.id = refund_products.reason_id JOIN refunds ON refunds.id = refund_products.refund_id WHERE refunds.id = $ ;"])])

    res.send(JSON.parse(data))

  }))

  router.post('/check_for_admin', try_catch(async function (req: Request, res: Response) {   

    var id = Number((await select_request("SELECT id FROM users WHERE email = ? AND password = ? ;", [JSON.parse(req.body.email), JSON.parse(req.body.password)]))[0].id)

    if(id === Number(process.env.ADMIN_ID)){
      res.send({msg: "user is admin", next_status: true})
    }else{
      res.send({msg: "user is not a admin", next_status: false})
    }

  }))


 


  router.use(error_handler)

  