/**
 * @Summary Displays the a row/column value.
 *
 * @Description
 *  InputCells()
 *     < Input />
 *       onEnter()
 *
 * @file   ./src/components/InputCells.js
 * @author ______
 */

import React from 'react';

function InputCell(props) {
  return (<input placeholder={props.data} type="text" name={props.column} onKeyPress={props.onEnter} />);
}

export default InputCell;
