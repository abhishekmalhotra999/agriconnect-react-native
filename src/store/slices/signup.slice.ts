import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  phone: '',
  name: '',
  accountType: '',
  jwt: '',
  email: '',
  profile: {},
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    saveSignDetail: (state, action) => {
      state.phone = action.payload.phone;
      state.accountType = action.payload.accountType;
      state.name = action.payload.name;
      state.email = action.payload?.email || '';
      state.jwt = action.payload?.jwt || '';
    },
    saveInitialUserDetail: (state, action) => {
      state.phone = action.payload.phone;
      state.accountType = action.payload.accountType;
      state.name = action.payload.name;
      state.email = action.payload?.email || '';
      state.jwt = action.payload?.jwtToken || '';
      state.profile = action.payload?.profile;
    },
  },
});

export const signupReducer = signupSlice.reducer;
export const signupActions = signupSlice.actions;
