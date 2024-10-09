import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import authReducer from "./auth/authSlice";
import usersReducer from "./user/usersSlice";
import cardsReducer from "./cards/cardsSlice";
import supportReducer from "./support/supportSlice";
import offersReducer from "./offers/offersSlice";
import adminReducer from "./admin/adminSlice";

const reducers = combineReducers({
  auth: authReducer,
  users: usersReducer,
  cards: cardsReducer,
  offers: offersReducer,
  supp: supportReducer,
  admin: adminReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
	getDefaultMiddleware().concat(thunkMiddleware),
});

type TReducer = typeof reducers;
export type TAppState = ReturnType<TReducer>;

export type TAction<T> = T extends { [k: string]: (...args: any[]) => infer U }
  ? U
  : never;

export type AppDispatch = typeof store.dispatch;
