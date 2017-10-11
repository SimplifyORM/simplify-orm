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

let db = require('mysql');

/**
 * add comment
 * @param  {JSON} `dbInfo`
 * @private
 */

module.exports = {

  connect: function(dbInfo) {
    
    return  db.createConnection({
        'host': dbInfo.host,
        'port': dbInfo.port,
        'user': dbInfo.user,
        'password': dbInfo.password,
        'database': dbInfo.database
    });
  },
       
};