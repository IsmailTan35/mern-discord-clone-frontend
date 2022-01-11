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
            const ids = state.items.map((e)=> { return e.id; }).indexOf(action.payload.value.id);
            if(ids<0) return;
            state.items=state.items.splice(ids,1)
        }
        else if(action.payload.type=='add'){
            state.items.push(action.payload.value)
        }
    }
  }
});

export { actions as friendsActions };
export { reducer as friendsReducer };