import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { streamReducer as stream } from './stream';
import { userReducer as user } from './user';
import { socketReducer as socket } from './socket';
import { peersReducer as peers } from './peers';
import { friendsReducer as friends } from './friends';

const reducer = combineReducers({
  stream,
  user,
  socket,
  peers,
  friends
});
export { streamActions } from './stream';
export { userActions } from './user';
export { peersActions } from './peers';
export { friendsActions } from './friends';

export default configureStore({ 
  reducer,
});
