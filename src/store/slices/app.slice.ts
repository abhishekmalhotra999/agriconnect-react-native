import {createSlice} from '@reduxjs/toolkit';

type InitialState = {
  privacyPolicy: string;
};

const initialState: InitialState = {
  privacyPolicy: '',
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    savePrivacyPolicy: (state, action) => {
      state.privacyPolicy = action.payload;
    },
  },
});

export const appReducer = appSlice.reducer;

export const appActions = appSlice.actions;
