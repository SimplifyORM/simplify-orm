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

let db = require('./database');
let global = require('./constants');
let sql = null;

let queryExecute = null;
let bdConfig = null;
let mappingConfig = null;

/**
 * add comment
 * @param  {JSON} `dbInfo`
 * @param  {JSON} `mapping`
 * @private
 */

let init = (dbInfo, mapping) => {

  bdConfig = dbInfo;

  mappingConfig = mapping;

  queryExecute = db.connect(dbInfo);

  var json = JSON.stringify(mapping);

  var content = JSON.parse(json);

  console.log(json);

}

/**
 * add comment
 * @param  {Object} `obj`
 * @private
 */

let save = (obj) => {


  let properties = Object.keys(obj);

  let objName = obj.constructor.name
  let keys = [];
  let values = [];

  for (let index = 0; index < properties.length; index++) {

    keys.push(properties[index]);
    values.push(obj[properties[index]]);

  }

  sql = "INSERT INTO " + objName + " (" + keys.join(',') + ") VALUES ('" + values.join("','") + "')";


  queryRunner(sql);


}

/**
 * add comment
 * @param  {class} `class`
 * @param  {object} `id`
 * @private
 */

let update = (obj) => {

  let properties = Object.keys(obj);

  let objName = obj.constructor.name
  let sets = [];

  for (let index = 0; index < properties.length; index++) {

    if (obj[properties[index]] != null) {
      sets.push(properties[index] + " = '" + obj[properties[index]] + "'");
    }

  }

  sql = "UPDATE " + objName + " SET " + sets.join(', ');

  queryRunner(sql)


}

/**
 * add comment
 * @param  {class} `sql`
 * @private
 */

let queryRunner = (sql) => {

  console.log(sql);

  queryExecute.connect((err) => {

    if (err) {
      console.error('error while connecting: ' + err.stack);
      return;
    }
  });

  /*queryExecute.query(sql, function (error, results, fields) {
    if (error) throw error;
    console.log(results.insertId);
  });*/

  queryExecute.end();

}

/**
 * add comment
 * @param  {class} `class`
 * @param  {object} `id`
 * @private
 */

let findByID = (obj, iprimaryKey) => {

  let objName = obj.constructor.name

}

/**
 * Module exports.
 * @public
 */

module.exports = {
  init: init,
  save: save,
  update: update,
}