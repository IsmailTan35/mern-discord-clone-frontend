import { createSlice, current  } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'servers',
  initialState: {
    items:[],
  },
  reducers: {
    refresh(state, action) {
      const { name, value } = action.payload;
      state[name] = [];
      state[name] = value

    },
    update(state, action) {
      const { type, name, value } = action.payload;
      if(type=='remove'){
          state[name]=state[name].filter(user => 
            user.name != value.name && user.code != value.code
          )
      }
      else if(type=='add'){
          state[name].push(value)
      }
    }
  }
});

export { actions as serversActions };
export { reducer as serversReducer };