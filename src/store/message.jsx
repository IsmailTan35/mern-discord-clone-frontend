import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'message',
  initialState: {
    items:[],
  },
  reducers: {
    refresh(state, action) {
      const {name, value } = action.payload;
        state[name] = [];
        state[name] = value

    },
    update(state, action) {
      const {type, name, value } = action.payload;
        if(type=='remove'){
            state[name]=state[name].filter(message => message._id !== value._id)
        }
        else if(type=='add'){
            state[name].push(value)
        }
    },
    // Reactions or link previews of one message changed
    patch(state, action) {
      const { _id, ...fields } = action.payload;
      state.items = state.items.map(item =>
        (item._id || item.messageId) === _id ? { ...item, ...fields } : item
      );
    },
    // The messages of a deleted channel
    removeChannel(state, action) {
      const { serverID, channelID } = action.payload;
      state.items = state.items.filter(
        item => !(item.serverName === serverID && item.channelName === channelID)
      );
    },
    overWrite(state, action) {
      const {name, value } = action.payload;
        state[name] = [...state[name], ...value]
        // Messages fetched later (history) may be older than the ones already shown
        state[name] = [...new Map(state[name].map(item=> [item._id || item.messageId,item])).values()]
          .sort((a, b) => new Date(a.timestamps) - new Date(b.timestamps))
    }

  }
});

export { actions as messageActions };
export { reducer as messageReducer };
