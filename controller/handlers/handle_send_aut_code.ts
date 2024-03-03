import check_duplicity from "../other/check_duplicity"
import send_emails from "../other/send_emails"
import transform_records from "../other/transform_records"

export default async function handle_send_aut_code(records: object){

    var new_data = transform_records(records)

    var dup_check_result = await check_duplicity(new_data, undefined, 'register')

    if(dup_check_result.status){
        var code = Math.floor(100000 + Math.random() * 900000).toString()
        send_emails([new_data.values[0][0][0]], code)
        return {msg: "email is in sytem, code send", status: true, code: code, record_id: dup_check_result.record_id}
    }

    return {msg: "email in not in system", status: false}

}