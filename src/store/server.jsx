import { createSlice, current } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "servers",
  initialState: {
    items: [],
  },
  reducers: {
    refresh(state, action) {
      const { name, value } = action.payload;
      state[name] = [];
      state[name] = value;
    },
    update(state, action) {
      const { type, name, value } = action.payload;

      if (type == "remove") {
        state[name] = state[name].filter(
          user => user.name != value.name && user.code != value.code
        );
      } else if (type == "add") {
        state[name] = [...state[name], ...[value]];
        state[name] = [
          ...new Map(state[name].map(item => [item._id, item])).values(),
        ];
      }
    },
    mutationOnlineUser(state, action) {
      const { type, name, value } = action.payload;
      const { serverID, channelID, username, code, _id } = value;
      const serverIndex = state.items.findIndex(item => item._id === serverID);
      const channels = state.items[serverIndex].channels;
      const channelIndex = channels.findIndex(item => item._id === channelID);
      const channel = state.items[serverIndex].channels[channelIndex];

      if (serverIndex === -1 || channelIndex === -1) return;
      if (type == "remove") {
        state.items[serverIndex].channels[channelIndex].onlineUser =
          state.items[serverIndex].channels[channelIndex].onlineUser.filter(
            user => user.username != username && user.code != code
          );
      } else if (type == "add") {
        // state.items[serverIndex].channels[channelIndex].onlineUser.push({
        //   username,
        //   code,
        //   _id,
        // });

        state[name] = [...state[name], ...[value]];
        state[name] = [
          ...new Map(state[name].map(item => [item._id, item])).values(),
        ];
      }
    },
  },
});

export { actions as serversActions };
export { reducer as serversReducer };
