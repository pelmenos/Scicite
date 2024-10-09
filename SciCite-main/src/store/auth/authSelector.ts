import { TAppState } from "store/store";

export const getIsAuth = (state: TAppState) => {
    return state.auth.isAuth
}

export const getErrors = (state: TAppState) => {
	return state.auth.errors
}