import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { positionsReducer as positions } from './positions';

const reducer = combineReducers({

  positions,

});
export { positionsActions } from './positions';

export default configureStore({ reducer });
