import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'user',
  initialState: {
      id:null,
    
  },
  reducers: {
    update(state, action) {
        state[action.payload.name]=action.payload.value
    },
  }
});

export { actions as userActions };
export { reducer as userReducer };
