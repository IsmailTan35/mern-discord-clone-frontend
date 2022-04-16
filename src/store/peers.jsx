import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'peers',
  initialState: {
    items:[],
    refPeers:[],
  },
  reducers: {
    refresh(state, action) {
        state[action.payload.name] = [];
        state[action.payload.name]=action.payload.value
      },
      update(state, action) {
        state[action.payload.name].push(action.payload.value)

      },
  }
});

export { actions as peersActions };
export { reducer as  peersReducer };