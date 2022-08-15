import { createSlice, current } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'userList',
  initialState: {
	items:[]
  },
  reducers: {
    refresh(state, action) {
      const { name, value } = action.payload;
      state[name] = [];
      state[name] = value
    },
    
    update(state, action) {
      const {type, name, value } = action.payload;
      if(type=='remove'){
          state.items=state.items.filter(friend => friend.id!=value.id)
      }
      else if(type=='add'){
          state.items.push(value)
      }
      state[name] = [...new Map(state[name].map(item=> [item.id,item])).values()]
    },
    mutation(state, action) {
      const { name, value } = action.payload;
      const mergeArr = [...state[name], ...value];
      state[name] = [...new Map(mergeArr.map(item=> [item.name,item])).values()]

    }
  }
});

export { actions as userListActions };
export { reducer as userListReducer };
