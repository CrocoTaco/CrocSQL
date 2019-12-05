/**
 * Summary: Displays table and creates popup to create new rows.
 *
 * Description:
 *  TableHeader
 *    handleEvent()
 *    render()
 *     Array of < HeaderCells />
 *
 * @file   ./src/components/TableDisplay.js
 * @author ______
 */

import React, { Component } from 'react';
import HeaderCell from './HeaderCells.js';

class TableHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleEvent = this.handleEvent.bind(this);
  }

  /**
   *
   * @param event
   *
   * Gets ordered data from database when event is fired.
   */
  handleEvent(event) {
    const queryString = `SELECT * FROM ${this.props.tableName} ORDER BY ${event.target.placeholder}`;
    console.log(queryString);

    this.props.reRender(queryString);
  }

  render() {
    const rowsArr = [];
    this.props.keys.forEach((val, index) => {
      rowsArr.push(
        <HeaderCell
          handleEvent={this.handleEvent}
          key={`${index}_headerCell`}
          data={val}
        />,
      );
    });

    return <div>{rowsArr}</div>;
  }
}

export default TableHeader;
