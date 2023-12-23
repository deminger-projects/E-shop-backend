import { Router, Request, Response } from "express";
import { FileArray } from "express-fileupload";

import handle_add from "./controller/handlers/handler_add.js";
import update_json_files from "./controller/file_handlers/updates/update_json_files.js";
import handle_edit from "./controller/handlers/hadle_edit.js";
import handle_status_change from "./controller/handlers/handle_status_change.js";
import handle_login from "./controller/handlers/handle_login.js";
import handle_register from "./controller/handlers/handle_register.js";
import update_login_data from "./controller/file_handlers/updates/update_login_data.js";
import add_item from "./controller/handle_cart/add_item.js";
import delete_item from "./controller/handle_cart/delete_item.js";
import handle_refund from "./controller/handlers/handle_refund.js";
import empty_cart from "./controller/handle_cart/empty_cart.js";
import handle_send_aut_code from "./controller/handlers/handle_send_aut_code.js";
import stripe_payment from "./controller/apis/stripe.js";
import { write } from "fs";
import write_json from "./controller/file_handlers/write_json.js";

export const router = Router()  

router.post('/stripe_payment_webhook', async function (req: Request, res: Response) {   
console.log("🚀 ~ file: routes.ts:23 ~ req:", req.body.data.object.metadata)

//var handle_add_responce = await handle_add(JSON.parse(req.body.data.object.metadata.tables))

var kokotina = "whsec_b6e67eada329714ee59ea0f0cea0617712dc177e12091c01d5f83e5196c52d49"
  console.log("penis2")
 
  res.sendStatus(200);
})
 

  router.post('/get_stripe_payment_url', async function (req: Request, res: Response) {   
    await stripe_payment(JSON.parse(req.body.items), JSON.parse(req.body.tables), (session: any, err: any) => {
      console.log("🚀 ~ file: routes.ts:33 ~ awaitstripe_payment ~ err:", err)
      console.log("🚀 ~ file: routes.ts:33 ~ awaitstripe_payment ~ session:", session)
      if(err){
        res.send({error: err.msg})
      }else{
        res.send({payment_url: session.url})
      }
    }) 
  })
 
  router.post('/add_record', async function (req: Request, res: Response) {   

    if(req.files){
      var handle_add_responce = await handle_add(JSON.parse(req.body.tables), req.files as FileArray, req.body.folder)

      if(handle_add_responce.status === true){
        if(req.body.order){
          empty_cart()
        }

        if(!req.body.user_id){
          await update_json_files()
          console.log("test")
        }else{
          await update_json_files(req.body.user_id)
          console.log("test")

        }

        res.send({msg: "records saved", status: true, duplicit_value: handle_add_responce.duplicit_value})

      }else{
        res.send({msg: "error ocured", status: false, duplicit_value: handle_add_responce.duplicit_value})
      }
    }else{
      var handle_add_responce = await handle_add(JSON.parse(req.body.tables))

      if(handle_add_responce.status === true){
        if(req.body.order){
          empty_cart()
        }

        if(!req.body.user_id){
          await update_json_files()
          console.log("test")

        }else{
          await update_json_files(req.body.user_id)
          console.log("test")

        }

        res.send({msg: "records saved", status: true, duplicit_value: handle_add_responce.duplicit_value})

      }else{
        res.send({msg: "error ocured", status: false, duplicit_value: handle_add_responce.duplicit_value})
      }
    }
  })        

  router.post('/edit_record', async function (req: Request, res: Response) {   
    
    if(!req.body.folder){
      var hadle_edit_responce = await handle_edit(JSON.parse(req.body.tables), req.body.record_id)

      if(hadle_edit_responce.status === true){
          if(!req.body.user_id){
            await update_json_files()
          }else{
            await update_json_files(req.body.user_id)
          }
          res.send({msg: "records updated", status: true, duplicit_value: hadle_edit_responce.duplicit_value})
      }else{
        res.send({msg: "error ocured", status: false, duplicit_value: hadle_edit_responce.duplicit_value})
      }
    }else if(!req.files){
      var hadle_edit_responce = await handle_edit(JSON.parse(req.body.tables), req.body.record_id, JSON.parse(req.body.files_names_to_keep), req.body.folder)

      if(hadle_edit_responce.status === true){
        if(!req.body.user_id){
          await update_json_files()
        }else{
          await update_json_files(req.body.user_id)
        }
        res.send({msg: "records updated", status: true, duplicit_value: hadle_edit_responce.duplicit_value})

    }else{
      res.send({msg: "error ocured", status: false, duplicit_value: hadle_edit_responce.duplicit_value})
    }
    }else{
      var hadle_edit_responce = await handle_edit(JSON.parse(req.body.tables), req.body.record_id, JSON.parse(req.body.files_names_to_keep), req.body.folder, req.files as FileArray)

      if(hadle_edit_responce.status === true){
        if(!req.body.user_id){
          await update_json_files()
        }else{
          await update_json_files(req.body.user_id)
        }
        res.send({msg: "records updated", status: true, duplicit_value: hadle_edit_responce.duplicit_value})

      }else{
        res.send({msg: "error ocured", status: false, duplicit_value: hadle_edit_responce.duplicit_value})
    }
    }
  })

  router.post('/change_status', async function (req: Request, res: Response) {   

    var change_result = await handle_status_change(JSON.parse(req.body.tables), req.body.record_id)

    if(change_result.status){
      if(!req.body.user_id){
        await update_json_files()
      }else{
        await update_json_files(req.body.user_id)
      }
    }

    res.send({status: change_result.status, msg: change_result.msg});

  })











  router.post('/login_reguest', async function (req: Request, res: Response) {   

    var login_result = await handle_login(JSON.parse(req.body.tables), req.body.record_id)

    if(login_result.status && login_result.user_id){
      await update_login_data(login_result.user_id)
    }

    res.send({msg: login_result.msg, status: login_result.status, user_id: login_result.user_id})
  })

  router.post('/register_request', async function (req: Request, res: Response) {   

    var register_result = await handle_register(JSON.parse(req.body.tables))

    if(register_result.user_id){
      update_json_files(Number(register_result.user_id))
    }

    res.send({msg: register_result.msg, status: register_result.status, user_id: register_result.user_id})

  })












 


  router.post('/add_to_cart', function (req: Request, res: Response) {   

    add_item(JSON.parse(req.body.product), JSON.parse(req.body.selected_size))
    
    res.send({msg: "added to cart"})

  })

  router.post('/delete_from_cart', function (req: Request, res: Response) {   

    delete_item(req.body.pozition)
    
    res.send({msg: "deleted from cart"})

  })














  router.post('/refund_request', async function (req: Request, res: Response) {   

    var refund_result = await handle_refund(JSON.parse(req.body.tables), req.body.email)

    if(refund_result.code){
      res.send({msg: refund_result.msg, status: refund_result.status, code: refund_result.code, data: refund_result.data})
    }else{
      res.send({msg: refund_result.msg, status: refund_result.status})
    }
  })



  router.post('/send_aut_code', async function (req: Request, res: Response) {   

    var send_aut_code_result = await handle_send_aut_code(JSON.parse(req.body.tables))

    if(send_aut_code_result.code){
      res.send({code: send_aut_code_result.code, status: send_aut_code_result.status, msg: send_aut_code_result.msg, record_id: send_aut_code_result.record_id})
    }else{
      res.send({status: send_aut_code_result.status, msg: send_aut_code_result.msg})
    }

  })