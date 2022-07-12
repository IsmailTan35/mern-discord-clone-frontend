import { createSlice, current  } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'message',
  initialState: {
    items:[],
  },
  reducers: {
    refresh(state, action) {
        state[action.payload.name] = [];
        state[action.payload.name] = action.payload.value

    },
    update(state, action) {
        if(action.payload.type=='remove'){
            state[action.payload.name]=state[action.payload.name].filter(user => 
              user.name != action.payload.value.name && user.code != action.payload.value.code
            )
        }
        else if(action.payload.type=='add'){
            state[action.payload.name].push(action.payload.value)
        }
    },
    overWrite(state, action) {
        state[action.payload.name] = [...state[action.payload.name], ...action.payload.value]
        state[action.payload.name] = [...new Map(state[action.payload.name].map(item=> [item.timestamps,item])).values()]
    }

  }
});

export { actions as messageActions };
export { reducer as messageReducer };