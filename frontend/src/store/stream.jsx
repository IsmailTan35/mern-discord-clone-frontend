import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'stream',
  initialState: {
    items:{
      calling: false,
      callerId: null,
      callerName: null,
    }
    
  },
  reducers: {
    update(state, action) {
      state.items[action.payload.name]=action.payload.value
    },
  }
});

export { actions as streamActions };
export { reducer as streamReducer };
