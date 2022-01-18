import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'stream',
  initialState: {
    calling: false,
    callerId: null,
    callerName: null,
    
  },
  reducers: {
    update(state, action) {
      console.log(action.payload);
      state[action.payload.name]=action.payload.value
    },
  }
});

export { actions as streamActions };
export { reducer as streamReducer };
