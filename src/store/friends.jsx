import { createSlice } from '@reduxjs/toolkit';

// Friend lists hold `_id` (all / requests / blocked) or `userId` (onlineUsers).
// Removal payloads may also be a bare id string.
const getId = item => {
  if (!item) return undefined;
  if (typeof item === 'string') return item;
  return String(item._id || item.userId || '');
};

const { reducer, actions } = createSlice({
  name: 'friends',
  initialState: {
    onlineUsers:[],
    blocked:[],
    requests:[],
    all:[],
  },
  reducers: {
    refresh(state, action) {
      const { name, value } = action.payload;
      state[name] = [];
      state[name] = value
    },

    update(state, action) {
      const { name, value ,type} = action.payload;
        if(type=='remove'){
            state[name]=state[name].filter(user => getId(user) !== getId(value))
        }
        else if(type=='add'){
            state[name].push(value)
        }
        state[name] = [...new Map(state[name].map(item=> [getId(item),item])).values()]
    }
  }
});

export { actions as friendsActions };
export { reducer as friendsReducer };
