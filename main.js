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

let init = require('./lib/initializer');
let queryBuilder = require('./lib/queryBuider');

let dbInfo;

/**
 * add comment 
 * @param  {JSON} `dbconfig`
 * @param  {JSON} `mapping`
 * @private
 */

let initialize = (dbconfig) => {

    dbInfo = dbconfig
        //queryBuilder.init(dbInfo,mapping)
    createModels();
};


/**
 * add comment 
 * @param  {JSON} `dbconfig`
 * @private
 */

let createModels = () => {

    init.init(dbInfo)

};

/**
 * add comment 
 * @param  {Object} `obj`
 * @private
 */

let saveObject = (obj) => {

    queryBuilder.save(obj);
};

/**
 * add comment 
 * @param  {Object} `obj`
 * @private
 */

let updateObject = (obj) => {

    queryBuilder.update(obj);
};


/**
 * Module exports.
 * @public
 */

module.exports = {

    initialize: initialize,
    createModels: createModels,
    saveObject: saveObject,
    updateObject: updateObject

}