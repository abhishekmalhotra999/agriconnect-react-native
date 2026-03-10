import {createSlice} from '@reduxjs/toolkit';
import {User} from '../../models/user';

export type InitialState = {
  authToken: null | string;
  userDetail: User | null;
};

const initialState: InitialState = {
  authToken: null,
  userDetail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUserDetail: (state, action) => {
      console.log(action.payload);
      state.userDetail = action.payload;
    },
    saveAuthToken: (state, action) => {
      state.authToken = action.payload.authToken;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
