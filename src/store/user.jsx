import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id:null,
  name:null,
  code:null,
  token:null,
  message:[],
};

const { reducer, actions } = createSlice({
  name: 'user',
  initialState,
  reducers: {
    refresh(state, action) {
      const {name, value } = action.payload;
      state[name]=value
    },
    update(state, action) {
      const {name, value } = action.payload;
      state[name].push(value)
    },
    delete() {
      return initialState;
    }
  }
});

export { actions as userActions };
export { reducer as userReducer };
