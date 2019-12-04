// WARNING // THIS FILE IS NOT BEING USED 
// Redux is not implemented yet, all methods used on react should have been reducers


import * as types from '../constant/actionTypes';

const initialState = {
  count: 0,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TYPE': 
    state.count += 1;

    return {
      ...state,    
    }

    default: return state;
  }
}


export default reducer;