import { createSlice, current } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'users',
  initialState: {
	items:[]
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

export { actions as usersActions };
export { reducer as usersReducer };
