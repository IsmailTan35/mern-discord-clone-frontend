import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { userReducer as user, userActions } from "./user";
import { peersReducer as peers } from "./peers";
import { socketReducer as socket } from "./socket";
import { streamReducer as stream } from "./stream";
import { serversReducer as server } from "./server";
import { messageReducer as message } from "./message";
import { friendsReducer as friends } from "./friends";
import { channelsReducer as channels } from "./channels";
import { userListReducer as userList } from "./userlist";
import { friendRequestReducer as friendRequest } from "./friendRequest";

const appReducer = combineReducers({
  stream,
  user,
  socket,
  peers,
  friends,
  friendRequest,
  message,
  server,
  userList,
  channels,
});

// Logging out (userActions.delete) empties every slice, not only the user:
// the next person on this browser must not see the previous one's messages,
// servers or friends
const reducer = (state, action) =>
  appReducer(action.type === userActions.delete.type ? undefined : state, action);

export { userActions } from "./user";
export { peersActions } from "./peers";
export { streamActions } from "./stream";
export { serversActions } from "./server";
export { messageActions } from "./message";
export { friendsActions } from "./friends";
export { userListActions } from "./userlist";
export { channelsActions } from "./channels";
export { friendRequestActions } from "./friendRequest";

export default configureStore({
  reducer,
});
