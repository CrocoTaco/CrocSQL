const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const file = require('./controller');
const { connectionPoint } = require('./connection.js');

const PORT = 3000;

//Parsing request body from JSON object into JS object format
app.use(bodyParser.json());

//Upon receiving a get request to '/' path, server sends back index.html and status code 200
app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

//Upon receiving a post request to '/server/tablenames' path, iterate through the two middleware functions which create a connection to the database and retrieves the table names. Send data via a JSON object and a status code of 200 to the getTableNames and re-render function in Main Container component
app.post('/server/tablenames',
  connectionPoint.createConnection, file.getTableNames, (req, res) => res.status(200).json(res.locals.tableName));

// Upon receiving a post request to '/server/table' path, iterate through the two middleware functions which create a connection to the database and retrieves the tables. Send data via a JSON object and a status code of 200 to the getTable  and re-render function in Main Container component
app.post('/server/table',
  connectionPoint.createConnection, file.getData, (req, res) => res.status(200).json(res.locals.info));

// Upon receiving a post request to '/server/update' path, iterate through the two middleware functions which create a connection to the database and replaces the Row value with the user-input value (both in the Row Component and the database)  
app.post('/server/update', connectionPoint.createConnection, file.update, (req, res) => res.status(200).json(res.locals.new));

// Upon receiving a post request to '/server/create' path, iterate through the two middleware functions which create a connection to the database and creates a new row of data in the database via user-input data entered into the CreatePopup Component (this is not a popup, it's more of a hidden component) 
app.post('/server/create', connectionPoint.createConnection, file.create, (req, res) => res.status(200).json(res.locals.create));

// Upon receiving a delete request to '/server/delete' path, iterate through the two middleware functions which create a connection to the database and deletes a  row of data in the database via user-input data entered into the Main Container

app.delete('/server/delete', connectionPoint.createConnection, file.delete, (req, res) => res.status(200).json(res.locals.delete));

//The App listens on port indicated on line 9
app.listen(PORT, () => { console.log(`Listening on Port ${PORT}`); });

module.exports = app;
