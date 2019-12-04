import React, { Component } from 'react';
import TableDisplay from '../components/TableDisplay';
import { connect } from 'react-redux';
import { update } from '../actions/actions.js';

const mapDispatchToProps = dispatch => ({
  update: () => dispatch(update())
});

// Create container. This is the main parent.
class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      uri: '',
      tableNames: [],
      isLoading: true,
      currentTable: ''
    };
    this.getTable = this.getTable.bind(this);
    this.getTableNames = this.getTableNames.bind(this);
    this.reRender = this.reRender.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }
  // The following are METHODS used THROUGHOUT the APP /// 
  // There are only a few methods not contained in here. 
  // update method which was dispatched to here for fun/learning. and a eventHandler on HeaderCell file.
  getTable() {
    // Get required data to build queryString to query database
    const uri = this.state.uri;
    const tableName = document.querySelector('#selectedTable').value;
    const queryString = 'select * from ' + tableName;
    const data = { uri, queryString };
    
    // send URI and queryString in a post request
    fetch('/server/table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data) 
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          data: result,
          isLoading: false,
          currentTable: tableName
        });
      });
  }
  getTableNames() {
    const uri = document.querySelector('#uri').value;
    this.setState({ uri });
    const data = { uri };
    fetch('/server/tablenames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        const titlesArray = [];
        result.forEach(el => {
          if (el.tablename.slice(0, 4) !== 'sql_') {
            titlesArray.push(el.tablename);
          }
        });
        this.setState({ tableNames: titlesArray });
      });
  }

  // This method is called throughout the APP to reRender after doing something
  reRender(newString) {
    const tableName = this.state.currentTable;
    const uri = this.state.uri;
    let queryString;

    // If no personalised query is send as an arg do normal default query
    if(newString!== undefined){
      queryString=newString;
    }
    else{
      queryString='select * from '+ tableName;
    }
    // console.log('**********************************', queryString)
    const tableData = { uri, queryString };
    this.setState({ isLoading: true });

    // First fetch is to get tableNames. sending a post request of the URI of the DB.
    // Second fetch request is to get the table specifying the tablename from the DB.

    fetch('/server/tablenames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri })
    })
      .then(res => res.json())
      .then(result => {
        const titlesArray = [];

        result.forEach(el => {
          if (el.tablename.slice(0, 4) !== 'sql_') {
            titlesArray.push(el.tablename);
          }
        });
        this.setState({ tableNames: titlesArray });
      })
      .then(() => {
        fetch('/server/table', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tableData)
        })
          .then(res => res.json())
          .then(result => {
            this.setState({
              data: result,
              isLoading: false,
              currentTable: tableName
            });
          });
      });
  }

   // Delete row method
    deleteRow(){
        const PK = Object.keys(this.state.data[0])[0]
        const PKValue = document.querySelector('#deleteRow').value;
        const queryString = `DELETE FROM ${this.state.currentTable} WHERE ${PK} = ${PKValue}`
        const uri = this.state.uri;

        fetch('/server/delete',{
            method: 'DELETE',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({uri, queryString})
        }).then(()=>{
          console.log('hi')
          this.reRender()})
    }
    

    // END OF METHODS // 

render(){
    const inputStyle={margin:'10px', width: "500px",}
    const inputTableStyle={margin:'10px', width: "100px",}
    const tableOptions =[]

    
    for(let i=0; i<this.state.tableNames.length; i++){
      tableOptions.push(<option key={i + '_tableOptions'} value={this.state.tableNames[i]}>{this.state.tableNames[i]}</option>)
    }

    let tableArray = []; 

    if (this.state.isLoading !== true) {
      tableArray = [
        <TableDisplay
          key={this.state.currentTable}
          tableName={this.state.currentTable}
          uri={this.state.uri}
          data={this.state.data}
          reRender={this.reRender}
        />
      ];
    }

    return (
      <div class="flex">
        <span>
          <label>Place URI Here:</label>
          <input
            id="uri"
            style={inputStyle}
            placeholder="progres://"
          ></input>
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
        <br/>
            <span><label>Delete a Row (Insert id):</label>
            <input style={inputTableStyle} id='deleteRow'></input>
            <button onClick={this.deleteRow}>Delete</button>
            </span>
        <h2>{this.state.currentTable}</h2>
        <div>{tableArray}</div>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(MainContainer);
