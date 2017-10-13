/*
 * simplify-orm
 * Copyright(c) 2017 simplifyORM <dev@simplify-orm.org>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

let readerDB = require('fs');
let db = require('./database');
let global = require('./constants');

let queryExecute;
let bdConfig;
let TabList = [];
let mapData = [];

/**
 * add comment
 * @param  {JSON} `dbInfo`
 * @private
 */

let init = (dbInfo) => {

    bdConfig = dbInfo;

    queryExecute = db.connect(dbInfo);

    createModels();
}

/**
 * add comment
 * @param  {JSON} `dbInfo`
 * @private
 */

let createModelFile = () => {

    if (readerDB.existsSync('./models')) {
        readerDB.writeFile('models/models.js', "", (err) => {});
    } else {
        readerDB.mkdir('./models');
    }

    readerDB.appendFile('models/models.js', "'use strict'", (err) => {

    });

}

/**
 * add comment
 * @private
 */

let createModels = () => {

    createModelFile();

    queryExecute.connect((err) => {

        if (err) {
            console.error('error while connecting: ' + err.stack);
            return;
        }
        console.log(bdConfig.tables);
        if (typeof(bdConfig.tables) == "object") {

            let closed = false;
            for (var index = 0; index < bdConfig.tables.length; index++) {
                if ((index + 1) == bdConfig.tables.length) {
                    closed = true;
                }
                let SQL = "SHOW COLUMNS FROM " + bdConfig.tables[index];
                runGenerator(bdConfig.tables[index], SQL, closed);

            }
        } else {
            let SQL = "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? ";
            let closed = false;
            queryExecute.query(SQL, [bdConfig.database], (err, rows, fields) => {
                if (err) {
                    console.error('error while executing query : ' + err.stack);
                    return;
                }
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        if ((i + 1) == rows.length) {
                            closed = true;
                        }
                        let table = rows[i].TABLE_NAME;
                        let SQLTB = "SHOW COLUMNS FROM " + table;
                        runGenerator(table, SQLTB, closed);
                    }
                }

            })
        }

    });

}



/**
 * add comment
 * @param  {String} `elt`
 * @param  {String} `sql`
 * @param  {boolean} `closed`
 * @private
 */
let runGenerator = (elt, sql, closed) => {

    let properties = "";
    let name_object = elt;

    queryExecute.query(sql, (err, rows, fields) => {
        let object_mappe = {
            "table": elt,
            "classe": "",
            "properties": []
        }

        if (err) {
            console.error('error while executing query : ' + err.stack);
            return;
        }

        if (rows.length > 1) {

            for (let index = 0; index < rows.length; index++) {
                let element = rows[index].Field;

                console.log('Column :', element);
                properties = properties + element + ','
                let typeColumn = rows[index].Type.toString().substring(0, rows[index].Type.toString().indexOf('('));
                let isNull = (rows[index].Null == "NO") ? false : true;
                object_mappe.classe = elt;
                object_mappe.table = elt;
                console.log('key column :', rows[index].Key)
                object_mappe.properties[index] = {
                    "property": rows[index].Field,
                    "column": rows[index].Field,
                    "type": typeColumn,
                    "isNull": isNull
                }
                if (rows[index].Key == "PRI") {
                    object_mappe.properties[index].isPrimary = true;
                }
                if (rows[index].Key == "MUL") {
                    object_mappe.properties[index].isForeignKey = true;

                }

            }
            TabList.push(object_mappe);
            properties = properties.substring(0, properties.length - 1);
            writePojos(elt, properties, closed);
        } else {
            let element = rows[index].Field;
            console.log('Column Else:', element);
            properties = element;
            writePojos(elt, properties, closed);
        }



    })


}



/**
 * add comment
 * @param  {String} `namePojo`
 * @param  {String} `params`
 * @param  {boolean} `closed`
 * @private
 */
let writePojos = (namePojo, params, closed) => {

    let line = "";
    let parameters = params.split(',');

    parameters.forEach((param) => {
        line = line + global.TAB + global.TAB + "this." + param + "=" + param + ";" + global.NBR;
    })
    let comments = " //This class is mapped with " + namePojo + " table in database " + bdConfig.database.toString().toUpperCase() + "//";
    let data = global.NBR + global.NBR + comments + global.NBR + global.CLASS + " " + namePojo + " " +
        global.ACCOPEN + global.NBR + global.TAB + "constructor(" + params + ") " + global.ACCOPEN +
        global.NBR + line + global.NBR + global.NBR + global.TAB + global.ACCEND + global.NBR + global.TAB + global.NBR + global.ACCEND + global.NBR + "exports." + namePojo + "=" + namePojo;
    if (!readerDB.existsSync('./models')) {
        readerDB.mkdir('./models');
    }
    readerDB.appendFile('models/models.js', data, (err) => {
        console.log('Create Class :', namePojo);
        if (closed) {
            ForeignKeyDetect(TabList)
        }
    });
}


let ForeignKeyDetect = (tab) => {

    let counter = 0;
    let closed = false;
    let isFK = false;
    let SQL = "SELECT i.TABLE_SCHEMA, i.TABLE_NAME,k.COLUMN_NAME,i.CONSTRAINT_TYPE, i.CONSTRAINT_NAME, k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME FROM " +
        " information_schema.TABLE_CONSTRAINTS i  LEFT JOIN " +
        " information_schema.KEY_COLUMN_USAGE k ON i.CONSTRAINT_NAME = k.CONSTRAINT_NAME" +
        " WHERE i.CONSTRAINT_TYPE = ?  AND i.TABLE_SCHEMA =? AND i.TABLE_NAME =?";


    for (var index = 0; index < TabList.length; index++) {
        counter++;
        if (counter == (TabList.length)) {

            closed = true;
        }
        let arrayColumns = [];
        let columnObject = {};
        let objectFK = {
            'criteria': 'FOREIGN KEY',
            'table': TabList[index].table,
            'database': bdConfig.database
        }
        console.log("Table :", TabList[index].table + " Columns :" + TabList[index].properties.length);
        let list_properties = TabList[index].properties;
        for (var iCols = 0; iCols < TabList[index].properties.length; iCols++) {

            if (TabList[index].properties[iCols].isForeignKey != undefined) {

                let columnObject = {
                    'columnName': TabList[index].properties[iCols].column,
                    'iCols': iCols
                }
                arrayColumns.push(columnObject);

            }

        }
        if (arrayColumns.length > 0) {

            infoFK(SQL, objectFK, TabList[index], arrayColumns, closed).then((response) => {

                if (response != null) {


                    mapData.push(response);
                    readerDB.writeFile('models/mappage.json', JSON.stringify(mapData));


                } else {}

            });

        } else {

            mapData.push(TabList[index]);
            readerDB.writeFile('models/mappage.json', JSON.stringify(mapData));
            if ((index + 1) == TabList.length) {
                queryExecute.end();
            }

        }

    }


}
let infoFK = (SQL, objectFK, Table, Cols, closed) => {

    return new Promise((response, error) => {

        queryExecute.query(SQL, [objectFK.criteria, objectFK.database, objectFK.table], (err, rows, fields) => {
            if (rows.length > 0) {

                for (var index = 0; index < Cols.length; index++) {
                    let i = Cols[index].iCols;
                    Table.properties[i].isForeignKey = {
                        'table_fk': rows[index].REFERENCED_TABLE_NAME,
                        'id_fk': rows[index].REFERENCED_COLUMN_NAME,
                        'name_fk': rows[index].CONSTRAINT_NAME
                    }
                }
            } else {
                //Table = null;

            }
            if (closed)
                queryExecute.end();

            response(Table);

        })
    })


}



/**
 * Module exports.
 * @public
 */
exports.init = init;