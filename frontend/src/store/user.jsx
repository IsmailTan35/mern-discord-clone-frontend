import { createSlice, current } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'user',
  initialState: {
      id:null,
      name:null,
      code:null,
      message:[],
  },
  reducers: {
    refresh(state, action) {
        state[action.payload.name]=action.payload.value
    },
    update(state, action) {
      state[action.payload.name].push(action.payload.value)
    }
  }
});

export { actions as userActions };
export { reducer as userReducer };
