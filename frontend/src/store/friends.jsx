import { createSlice, current  } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'friends',
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

export { actions as friendsActions };
export { reducer as friendsReducer };