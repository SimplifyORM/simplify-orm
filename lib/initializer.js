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
let db = require('mysql');
let global = require('./constants');

let queryExecute = null;
let bdConfig = null;

/**
 * add comment
 * @param  {JSON} `dbInfo`
 * @private
 */

let init = (dbInfo) => {

        bdConfig = dbInfo;

        queryExecute = db.createConnection({
            'host': bdConfig.host,
            'port': bdConfig.port,
            'user': bdConfig.user,
            'password': bdConfig.password,
            'database': bdConfig.database
        });

      createModels();
}

/**
 * add comment
 * @private
 */

let createModels = () => {
    
    queryExecute.connect((err) => {

        if (err) {
        console.error('error while connecting: ' + err.stack);
        return;
    }

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

    queryExecute.query(sql, (err, rows, fields) => {

         if (err) {
        console.error('error while executing query : ' + err.stack);
            return;
        }

        if (rows.length > 1) {

            for (let index = 0; index < rows.length; index++) {
                let element = rows[index].Field;
                console.log('Column :', element);
                properties = properties + element + ','

            }
            properties = properties.substring(0, properties.length - 1);
            writePojos(elt, properties, closed);
        } else {
            let element = rows[index].Field;
            console.log('Column :', element);
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
        readerDB.appendFile('models/models.js', data, (err) => {
        console.log('Create Class :', namePojo);
        if (closed) {
            queryExecute.end()
        }
    });
}


/**
 * Module exports.
 * @public
 */

exports.init = init;