import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "stream",
  initialState: {
    items: {
      calling: false,
      callerId: null,
      callerName: null,
      userId: null,
    },
  },
  reducers: {
    update(state, action) {
      const { name, value } = action.payload;
      state.items[name] = value;
    },
    delete(state, action) {
      state.items.calling = false;
      state.items.callerId = null;
      state.items.callerName = null;
      state.items.userId = null;
    },
  },
});

export { actions as streamActions };
export { reducer as streamReducer };
