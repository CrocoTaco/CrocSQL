// MIDDLEWARES
const file = {};


/**
 * @summary Middleware that queries database and returns resulting table data.
 * 
 * @description Upon user hitting get data button, req.body is populated with query and the response is constructed and saved in res.locals.info.
 * 
 * @param {Object} req Request body
 *  @param {Object} res Response body
 * @param {Function} next Invokes next piece of middleware 

 */

file.getData = (req, res, next) => {
  //connection to the db
  const db = res.locals.pool;

  const { queryString } = req.body;
  db.query(queryString, (err, result) => {
    if (err) {
      return next({ log: err.stack, message: 'Error executing query in getData' });
    }
    res.locals.info = result.rows;
    return next();
  });
};


/**
 * @summary Middleware that queries database and returns resulting table names data.
 * 
 * @description Query returns all table names from the connected database and saves results in res.locals.tableNames. The table names are displayed on the drop down menu.
 * 
 * @param {Object} req Request body
 *  @param {Object} res Response body
 * @param {Function} next Invokes next piece of middleware 

 */

file.getTableNames = (req, res, next) => {
  const db = res.locals.pool;
  

const queryString = `select tablename
from pg_catalog.pg_tables
where schemaname = 'public';`


  db.query(queryString, (err, result) => {
    if (err) {
      return next({ log: err.stack, message: 'Error executing query in getTableNames' });
    }
    res.locals.tableName = result.rows;
    return next();
  });
};

/**
 * @summary Middleware that queries database based on user-input query. 
 * 
 * @description Upon user interacting directly in the tables (e.g. rewriting row values or sorting values based on column headers), req.body is populated with query and the response is constructed and saved in res.locals.new. The table and row is re-rendered.
 * 
 * @param {Object} req Request body
 *  @param {Object} res Response body
 * @param {Function} next Invokes next piece of middleware 
 */

file.update = (req, res, next) => {
  const db = res.locals.pool;
  
  const { queryString } = req.body;

  db.query(queryString, (err, result) => {
    if (err) {
      return next({ log: err.stack, message: 'Error executing query in update' });
    }
    res.locals.new = result.rows;
    return next();
  });
};

/**
 * @summary Middleware that queries database based on user-input query.
 * 
 * @description Upon user hitting the delete button, req.body is populated with query and the response is constructed and saved in res.locals.delete. The specified row is deleted.
 * 
 * @param {Object} req Request body
 *  @param {Object} res Response body
 * @param {Function} next Invokes next piece of middleware 
 */
file.delete = (req, res, next) => {
  const db = res.locals.pool;
  
  const { queryString } = req.body;

  db.query(queryString, (err, result) => {
    console.log('result:', result);

    if (err) {
      return next({ log: err.stack, message: 'Error executing query in delete' });
    }
    res.locals.delete = result.rows;
    console.log('res.locals.delete:', res.locals.delete);

    return next();
  });
};

/**
 * @summary Middleware that queries database based on user-input query.
 * 
 * @description Upon user hitting the create button and populating the Createpopup component, req.body is populated with query and the response is constructed and saved in res.locals.create. A new row is inserted.
 * 
 * @param {Object} req Request body
 *  @param {Object} res Response body
 * @param {Function} next Invokes next piece of middleware 
 */
file.create = (req, res, next) => {
  const db = res.locals.pool;
  const { queryString } = req.body;

  db.query(queryString, (err, result) => {
    if (err) {
      return next({ log: err.stack, message: 'Error executing query in create' });
    }
    res.locals.create = result.rows;
    return next();
  });
};

module.exports = file;
