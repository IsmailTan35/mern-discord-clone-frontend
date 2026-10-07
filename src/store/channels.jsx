import { createSlice, current } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "channels",
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
        state[name] = state[name].filter(item => item._id !== value._id);
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

      // A user can only be in one voice channel, so "remove" clears them everywhere
      if (type == "remove") {
        state[name] = state[name].map(item => ({
          ...item,
          onlineUser: (item.onlineUser || []).filter(user => user._id !== _id),
        }));
      } else if (type == "add") {
        state[name] = state[name].map(item => {
          if (item._id !== channelID) return item;
          const onlineUser = [...(item.onlineUser || []), { username, code, _id }];
          return {
            ...item,
            onlineUser: [
              ...new Map(onlineUser.map(user => [user._id, user])).values(),
            ],
          };
        });
      }
    },
  },
});

export { actions as channelsActions };
export { reducer as channelsReducer };
