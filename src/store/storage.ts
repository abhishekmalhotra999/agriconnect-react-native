import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {authReducer} from './slices/auth.slice';
import {learnReducer} from './slices/learn.slice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {signupReducer} from './slices/signup.slice';
import {appReducer} from './slices/app.slice';

const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    learn: learnReducer,
    signup: signupReducer,
    app: appReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
