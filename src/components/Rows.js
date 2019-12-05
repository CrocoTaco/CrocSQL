/**
 * Summary: Each Row is an array of InputCells.
 *
 * Description:
 *  Row
 *    onEnter()
 *    render()
 *     Array of < InputCells />
 *
 * @file   ./src/components/Rows.js
 * @author ______
 */

import React, { Component } from 'react';
import InputCell from './InputCells.js';

class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onEnter = this.onEnter.bind(this);
  }

  /**
   *
   * @param event
   *
   * Checks what key is pressed when call is selected
   *  '?' - Only show rows with that cell value
   *  '/' - Only show rows without that cell value
   *  'Enter' - Changes that cell to new value
   */
  onEnter(event) {
    const PK = Object.keys(this.props.data)[0];
    const { reRender, uri, tableName } = this.props;

    const columnName = event.target.name;
    const query = event.target.placeholder;
    let filterString = `SELECT * FROM ${tableName} WHERE ${columnName} `;

    switch (event.key) {
      case '?':
        filterString += `= '${query}'`;
        reRender(filterString);
        break;
      case '/':
        filterString += `!= '${query}'`;
        reRender(filterString);
        break;
      case 'Enter':
        const newValue = event.target.value;
        const PKValue = this.props.data[PK];
        let queryString = `UPDATE ${tableName} SET ${columnName} = `;

        if (isNaN(newValue)) {
          queryString += `'${newValue}' WHERE ${PK} = ${PKValue}`;
        } else {
          queryString += `${Number(newValue)} WHERE ${PK} = ${PKValue}`;
        }

        fetch('/server/update', {
          method: 'POST',
          body: JSON.stringify({ uri, queryString }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((data) => reRender());
        break;
      default:
        break;
    }
  }

  render() {
    const columns = Object.entries(this.props.data);
    const rowsArr = [];
    columns.forEach((val, index) => {
      rowsArr.push(
        <InputCell
          key={`${index}_inputCell`}
          data={val[1]}
          column={val[0]}
          onEnter={this.onEnter}
        />,
      );
    });

    return <div>{rowsArr}</div>;
  }
}

export default Row;
