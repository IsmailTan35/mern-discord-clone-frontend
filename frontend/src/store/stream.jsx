import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'stream',
  initialState: {
    peer:null,
    receivingCall:false,
    name:"",
    callerSignal:null,
    signal:null,
    myStream:null,
    userStream:null,
    userId:null,
    callAccepted:false,
    callEnded:false,
    data:null,
    caller:null,
    button1:null,
    button2:null,
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
