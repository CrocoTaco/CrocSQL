/**
 * @summary The connection file containing middleware that establishes a connection to the database
 *
 * @description Connection is established with the user-input database url 
 *
 * @file   ./server/connection.js
 * @author ______, Tammy Tan, Joseph Corrado
 */

const { Pool } = require('pg');
const connectionPoint = {};

/**
 * @summary Middleware that creates connection with user-input database via URI.
 * 
 * @description Creates a new pool connection using user-input database URI (from the request body). This middleware is invoked every time user triggers an event that requires interaction with database.
 * 
 * @requires pg
 * 
 * @param {Object} req Request body
 *  @param {Object} res Response body
 * @param {Function} next Invokes next piece of middleware 

 */
connectionPoint.createConnection = (req, res, next) => {
  // Grab URI from POST request at input form
  const { uri } = req.body;


  // URI to TEST
  // uri='postgres://gymyqkck:KDN5_PWumJO6UorMKuex8LLGBsTlISs8@salt.db.elephantsql.com:5432/gymyqkck'

  // Connect to pool with URI from POST request
  const pool = new Pool({
    connectionString: uri,
  });
  res.locals.pool = pool;

  return next();
};


//making this available to other files
module.exports = {
  connectionPoint
};
