import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { userReducer as user } from "./user";
import { peersReducer as peers } from "./peers";
import { socketReducer as socket } from "./socket";
import { streamReducer as stream } from "./stream";
import { serversReducer as server } from "./server";
import { messageReducer as message } from "./message";
import { friendsReducer as friends } from "./friends";
import { channelsReducer as channels } from "./channels";
import { userListReducer as userList } from "./userlist";
import { friendRequestReducer as friendRequest } from "./friendRequest";

const reducer = combineReducers({
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
