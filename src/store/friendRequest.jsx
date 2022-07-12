import { createSlice, current  } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'friendRequest',
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
            state.items=state.items.filter(friend => friend.id!=action.payload.value.id)
        }
        else if(action.payload.type=='add'){
            state.items.push(action.payload.value)
        }
    }
  }
});

export { actions as friendRequestActions };
export { reducer as friendRequestReducer };