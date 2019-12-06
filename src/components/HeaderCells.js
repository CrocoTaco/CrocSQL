/**
 * @Summary Creates a cell with background color and an event handler.
 *
 * @Description
 *  HeaderCells()
 *     < Input />
 *       handleEvent()
 *
 * @file   ./src/components/HeaderCells.js
 * @author ______
 */

import React from 'react';

function HeaderCell(props) {
  const tableHeaderStyle = {
    background: '#d6e0f5',
    fontSize: '12px',
  };
  return (
    <input
      placeholder={props.data}
      type="text"
      name={props.column}
      onClick={props.handleEvent}
      style={tableHeaderStyle}
    />
  );
}

export default HeaderCell;
