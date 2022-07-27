import { createSlice, current  } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'message',
  initialState: {
    items:[],
  },
  reducers: {
    refresh(state, action) {
      const {name, value } = action.payload;
        state[name] = [];
        state[name] = value

    },
    update(state, action) {
      const {type, name, value } = action.payload;
        if(type=='remove'){
            state[name]=state[name].filter(user => 
              user.name != value.name && user.code != value.code
            )
        }
        else if(type=='add'){
            state[name].push(value)
        }
    },
    overWrite(state, action) {
      const {name, value } = action.payload;
        state[name] = [...state[name], ...value]
        state[name] = [...new Map(state[name].map(item=> [item.timestamps,item])).values()]
    }

  }
});

export { actions as messageActions };
export { reducer as messageReducer };