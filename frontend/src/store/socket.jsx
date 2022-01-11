import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'socket',
  initialState: {
    client:null,
  },
  reducers: {
    update(state, action) {
        state[action.payload.name]=action.payload.value
    },
  }
});

export { actions as socketActions };
export { reducer as socketReducer };