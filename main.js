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

let init =require('./lib/initializer');

/**
 * add comment 
 * @param  {JSON} `dbconfig`
 * @private
 */

let initialize = (dbconfig) => { 

        init.init(dbconfig)

};


/**
 * Module exports.
 * @public
 */

exports.initialize = initialize;


