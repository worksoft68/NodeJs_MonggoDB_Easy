const dbConfig = require(__path_configs + 'database');
var sqlLog = require('mssql');
const getConnectionLog = async () => {
    try {
        let poolLog = await sqlLog.connect(dbConfig.sqlServerLog); // create a new connection poo
        // catch any connection errors and close the pool
        poolLog.on("error", async err => {

            return null;
        });
        return poolLog;
    } catch (err) {

        return null;
    }
};

let addAnything = async (schema, data) => {

    try {
        await sqlLog.connect(dbConfig.sqlServerLog);
        var requestLog = await new sqlLog.Request();
        var keysData = Object.keys(data);
        var keysChemas = Object.keys(schema);
        let countKey = keysData.length - 1;
        let SqlColumn = "";
        let strSqlValue = "";
        //==============================

        for (let i = 0; i < countKey; i++) {
            let column = keysData[i];// keysData[i] is column name
            let index = keysChemas.findIndex((key => key === column))
            if (index > -1) { //  found the column in the schema
                SqlColumn += '' + column + ',';
                strSqlValue += '@' + column + ',';
                //let dataType    = schema[column];   // dataType of column name 
                let paramValue = await createInsertParamVHC(column, schema[column], data[column]);
                // console.log(paramValue);
                let p = paramValue[0];
                await requestLog.input(p.name, p.sqltype, p.value);
            }
        }// end for for(let i=0; i < countKey; i++)
        let columnEnd = keysData[countKey]; // keysData[countKey] is the end  column name 
        let index = keysChemas.findIndex((key => key === columnEnd))//
        if (index > -1) { //  found the column in the schema
            SqlColumn += '' + columnEnd + '';
            let paramValue = await createInsertParamVHC(columnEnd, schema[columnEnd], data[columnEnd])[0];   //let dataType    = schema[columnEnd];   // dataType of the end column name            
            //console.log(paramValue);
            await requestLog.input(paramValue.name, paramValue.sqltype, paramValue.value);
            strSqlValue += '@' + columnEnd;
        }
        else {
            SqlColumn = SqlColumn.substring(0, SqlColumn.length - 1); // remove the last comma
            strSqlValue = strSqlValue.substring(0, strSqlValue.length - 1); // remove the last comma
        }

        let query = ' INSERT INTO ' + schema.table + ' (' + SqlColumn + ') VALUES (' + strSqlValue + ') ';

        let results = await requestLog.query(query);

        sqlLog.close();


        if (results.rowsAffected[0] == 1) {
            return 'true';
        }
    }
    catch (error) {
        console.log(error);
        try { pool.close(); }
        catch (err2) { }
        return 'false: ' + error
    }
    return 'false';
}



let createInsertParamVHC = (column, dataType, dataValue) => {
    dataType = dataType.toLowerCase();

    let resultDataType;
    switch (dataType) {
        case 'bit':
            resultDataType = sqlLog.Bit;
            break;
        case 'boolean':
            if ((dataValue == true) || (dataValue == "true") || (dataValue == "True") || (dataValue == "TRUE") || (dataValue == 1) || (dataValue == "1"))
                dataValue = true;
            else dataValue = false;
            resultDataType = sqlLog.Bit;
            break;
        case 'bigint':
            resultDataType = sqlLog.BigInt;
            break;
        case 'decimal':
            resultDataType = sqlLog.Decimal;
            break;
        case 'float':
            resultDataType = sqlLog.Float;
            break;
        case 'int':
            resultDataType = sqlLog.Int;
            break;
        case 'money':
            resultDataType = sqlLog.Money;
            break;
        case 'numeric':
            resultDataType = sqlLog.Numeric;
            break;
        case 'smallint':
            resultDataType = sqlLog.SmallInt;
            break;
        case 'smallmoney':
            resultDataType = sqlLog.SmallMoney;
            break;
        case 'real':
            resultDataType = sqlLog.Real;
            break;
        case 'tinyint':
            resultDataType = sqlLog.TinyInt;
            break;
        case 'number':
            resultDataType = sqlLog.Int;
            break;

        case 'char':
            resultDataType = sqlLog.NVarChar;
            break;
        case 'text':
            resultDataType = sqlLog.Text;
            break;
        case 'ntext':
            resultDataType = sqlLog.NText;
            break;
        case 'varchar':
            resultDataType = sqlLog.NVarChar;
            break;
        case 'nvarchar':
            resultDataType = sqlLog.NVarChar;
            break;
        case 'string':
            resultDataType = sqlLog.NVarChar;
            break;
        case 'xml':
            resultDataType = sqlLog.Xml;
            break;
        case 'time':
            resultDataType = sqlLog.Time;
            break;
        case 'date':
            resultDataType = sqlLog.Date;
            break;
        case 'datetime':
            resultDataType = sqlLog.DateTime;
            break;
        case 'datetime2':
            resultDataType = sqlLog.DateTime2;
            break;
        case 'datetimeoffset':
            resultDataType = sqlLog.DateTimeOffset;
            break;
        case 'smalldatetime':
            resultDataType = sqlLog.SmallDateTime;
            break;
        case 'uniqueidentifier':
            resultDataType = sqlLog.UniqueIdentifier;
            break;
        case 'variant':
            resultDataType = sqlLog.Variant;
            break;
        case 'binary':
            resultDataType = sqlLog.Binary;
            break;
        case 'varbinary':
            resultDataType = sqlLog.VarBinary;
            break;
        case 'image':
            resultDataType = sqlLog.Image;
            break;
        case 'udt':
            resultDataType = sqlLog.UDT;
            break;
        case 'geography':
            resultDataType = ssqlDataTypeql.Geography;
            break;
        case 'geometry':
            resultDataType = sqlLog.Geometry;
            break;
        default:
            resultDataType = sqlLog.NVarChar;
    };

    var parameters = [
        { name: column, sqltype: resultDataType, value: dataValue },
    ];
    return parameters;
}



module.exports = {
    addAnything,

}




