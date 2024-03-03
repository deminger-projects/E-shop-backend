export default interface Query_result{
    fieldCount?: number,
    affectedRows?: number,
    insertId?: number,
    serverStatus?: number,
    warningCount?: number,
    message?: string,
    protocol41?: boolean,
    changedRows?: number,
    [index: number]: Array<string>

}

interface Select_query_result{
}