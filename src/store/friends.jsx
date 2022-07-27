import { createSlice, current  } from '@reduxjs/toolkit';

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
            state[name]=state[name].filter(user => 
              user.name != value.name && user.code != value.code
            )
        }
        else if(type=='add'){
            state[name].push(value)
        }
        state[name] = [...new Map(state[name].map(item=> [item.name,item])).values()]
    }
  }
});

export { actions as friendsActions };
export { reducer as friendsReducer };