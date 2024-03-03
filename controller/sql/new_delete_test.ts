import delete_request from "../../DB/delete_request"

export default function new_delete_test(table: string, column: string, record_id: number){

    var sql = "DELETE FROM " + table + " WHERE " + column + " = ? ;"

    var result = delete_request(sql, [record_id.toString()])

}