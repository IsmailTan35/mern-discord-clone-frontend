import { createSlice, current } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'user',
  initialState: {
      id:null,
      name:null,
      code:null,
      token:null,
      message:[],
  },
  reducers: {
    refresh(state, action) {
      const {name, value } = action.payload;
      state[name]=value
    },
    update(state, action) {
      const {name, value } = action.payload;
      state[name].push(value)
    },
    delete(state, action) {
      // delete state.items[action.payload];
    }
  }
});

export { actions as userActions };
export { reducer as userReducer };
