export default interface TransformedData{
    tables: Array<string>
    columns: Array<any>
    values: Array<Array<Array<string>>>
    wheres: wheres
}

interface wheres{
    columns: Array<string>
    values: Array<string>
}