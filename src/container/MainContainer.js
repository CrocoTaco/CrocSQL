/**
 * @Summary The main parent component for the app.
 *
 * @Description
 *  MainContainer
 *    state{}
 *    reRender()
 *    deleteRow()
 *    getTableNames()
 *    getTable()
 *    render()
 *      < URI & Input & Button >
 *      < Table Names & Menu & Button >
 *      < Delete Row & Input & Button >
 *      < Table Display />
 *
 * @file   ./src/container/MainContainer.js
 * @author ______
 */

import React, { Component } from 'react';
import TableDisplay from '../components/TableDisplay';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // The data contained in a specific table
      uri: '', // User inputed link to database
      tableNames: [], // Names of tables in that database
      isLoading: true, // Not sure yet
      currentTable: '', // Name of table currently displayed
    };

    this.reRender = this.reRender.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.getTableNames = this.getTableNames.bind(this);
    this.getTable = this.getTable.bind(this);
  }

  /**
   * Passed down to components as prop.
   *
   * @param {String} newString Optional Query: Default -> 'select * from {state.currentTable}'
   */
  reRender(newString) {
    const tableName = this.state.currentTable;
    const { uri } = this.state;

    // If no query is sent as an arg -> set default query
    const queryString = newString !== undefined ? newString : `select * from ${tableName}`;

    this.setState({ isLoading: true });

    // First fetch is to get tableNames. sending a post request of the URI of the DB.
    // Second fetch request is to get the table specifying the tablename from the DB.

    this.getTableNames(() => {
      fetch('/server/table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri, queryString }),
      })
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            data: result,
            isLoading: false,
            currentTable: tableName,
          });
        });
    });
  }

  /**
   * Grab row's _id from user input
   * Sends query to delete that row from database
   * Updates data by sending fetch to database (reRender())
   */
  deleteRow() {
    const PK = Object.keys(this.state.data[0])[0]; // _id
    const PKValue = document.querySelector('#deleteRow').value;
    const queryString = `DELETE FROM ${this.state.currentTable} WHERE ${PK} = ${PKValue}`;
    const { uri } = this.state;

    fetch('/server/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri, queryString }),
    }).then(() => {
      this.reRender();
    });
  }

  /**
   * Grabs uri from user input.
   * Sets state to contain list of table names from SQL database.
   * Calls callback after fetch resolves.
   *
   * @param {Function} [callback] Optional
   */
  getTableNames(callback = () => {}) {
    // updates state with user inputed uri
    const uri = document.querySelector('#uri').value;
    this.setState({ uri });

    fetch('/server/tablenames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri }),
    })
      .then((res) => res.json())
      .then((result) => {
        // result = array of { tablename: String, __proto__ }
        // filters out sql metadata
        // creates array of table names and sets to state
        const titlesArray = [];
        result.forEach((el) => {
          // removes sql metadata
          if (el.tablename.slice(0, 4) !== 'sql_') {
            titlesArray.push(el.tablename);
          }
        });
        this.setState({ tableNames: titlesArray });
      })
      .then(() => callback());
  }

  /** Gets user's selected table then gets table data from server and updates state. */
  getTable() {
    // Grabs uri from state
    // Grab tablename from user input
    // Builds query for fetching from database
    const { uri } = this.state;
    const tableName = document.querySelector('#selectedTable').value;
    const queryString = `select * from ${tableName}`;

    // send URI and queryString in a post request
    fetch('/server/table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri, queryString }),
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          data: result,
          isLoading: false,
          currentTable: tableName,
        });
      });
  }

  render() {
    const inputStyle = { margin: '10px', width: '500px' };
    const inputTableStyle = { margin: '10px', width: '100px' };
    const tableOptions = [];


    for (let i = 0; i < this.state.tableNames.length; i++) {
      tableOptions.push(<option key={`${i}_tableOptions`} value={this.state.tableNames[i]}>{this.state.tableNames[i]}</option>);
    }

    let tableArray = [];

    if (!this.state.isLoading) {
      tableArray = [
        <TableDisplay
          key={this.state.currentTable}
          tableName={this.state.currentTable}
          uri={this.state.uri}
          data={this.state.data}
          reRender={this.reRender}
        />,
      ];
    }

    return (
      <div className="flex">
        <span>
          <label>Place URI Here:</label>
          <input
            id="uri"
            style={inputStyle}
            placeholder="progres://"
          />
          <button onClick={() => this.getTableNames()}>Get Tables</button>
        </span>
        <br />
        <span>
          <label>Table Name</label>
          <select id="selectedTable" style={inputTableStyle}>
            {tableOptions}
          </select>
          <button onClick={() => this.getTable()}>Get Data</button>
        </span>
        <br />
        <span>
          <label>Delete a Row (Insert id):</label>
          <input style={inputTableStyle} id="deleteRow" />
          <button onClick={this.deleteRow}>Delete</button>
        </span>
        <div>{tableArray}</div>
      </div>
    );
  }
}

export default MainContainer;
