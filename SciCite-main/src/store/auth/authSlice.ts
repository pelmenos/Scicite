import { PayloadAction, ThunkAction, createSlice } from '@reduxjs/toolkit'
import { authAPI } from 'api/auth.api'
import { AxiosError } from 'axios'
import { TAction, TAppState } from 'store/store'
import { getCurrentAcievement, getUserData } from 'store/user/usersSlice'
import {
	TClientChangePasswordData,
	TForgotData,
	TLoginData,
	TRegistrationData,
	TResetPassword,
} from 'types/auth.types'

type TSetAuthDataActionPayload = {
	user_id: string | null
	isAuth: boolean
}

const initialState = {
	userId: null as string | null,
	isAuth: false,
	errors: null as { [k: string]: string[] } | null
}

const authSlice = createSlice({
	name: 'authSlice',
	initialState,
	reducers: {
		setAuthData: (state, action: PayloadAction<TSetAuthDataActionPayload>) => {
			state.userId = action.payload.user_id
			state.isAuth = action.payload.isAuth
		},
		setErrors: (state, action: PayloadAction<{ [k: string]: string[] } | null>) => {
			state.errors = action.payload
		},
	},
})

export const {
	setAuthData,
	setErrors
} = authSlice.actions

type TThunk = ThunkAction<Promise<void>, TAppState, unknown, TAction<typeof authSlice.actions>>

export const registration = async (registrationData: TRegistrationData) => {
	await authAPI.registration(registrationData)
}

export const forgotPassword = (forgotData: TForgotData): TThunk => async (dispatch) => {
	try {
		await authAPI.forgot(forgotData)
	} catch (error) {
		const err = error as AxiosError
		if (typeof err.response?.data === "object") {
			dispatch(setErrors({ ...err.response?.data }))
		}
	}
}

export const resetPassword = (
	uid: string,
	token: string,
	resetData: TResetPassword
): TThunk => async (dispatch) => {
	try {
		await authAPI.resetPassword(uid, token, resetData)
	} catch (error) {
		const err = error as AxiosError
		if (typeof err.response?.data === "object") {
			dispatch(setErrors({ ...err.response?.data }))
		}
	}
}

export const checkVerifyEmail = (querySearch: string): TThunk => async (dispatch) => {
	const data = await authAPI.checkVerifyEmail(querySearch)
	localStorage.setItem('registerAchieve', data.data.achievement)
	localStorage.setItem('start_bonus', `${data.data.start_bonus}`)
}

export const login = (loginData: TLoginData): TThunk => async dispatch => {
	const data = await authAPI.login(loginData)
	dispatch(setAuthData({ ...data, isAuth: true }))
	localStorage.setItem('accessToken', data.access)
	localStorage.setItem('refreshToken', data.refresh)
	await dispatch(getUserData(data.user_id))
	await dispatch(getCurrentAcievement(localStorage.getItem('registerAchieve')))
}

export const logout = (): TThunk => async dispatch => {
	try {
		const data = await authAPI.logout(localStorage.getItem('refreshToken'))
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		dispatch(setAuthData({ user_id: null, isAuth: false }))
	} catch (e) {
	}
}

export const checkAuth = (): TThunk => async dispatch => {
	try {
		const data = await authAPI.checkAuth(localStorage.getItem('refreshToken'))
		localStorage.setItem('accessToken', data.access)
		dispatch(setAuthData({ user_id: data.user_ud, isAuth: true }))
		await dispatch(getUserData(data.user_ud))
	} catch (error) {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
	}
}

export const changePassword = (changePasswordData: TClientChangePasswordData): TThunk => async dispatch => {
	try {
		const data = await authAPI.changePassword({
			old_password: changePasswordData.oldPassword,
			new_password: changePasswordData.newPassword,
			confirm_password: changePasswordData.confirmPassword,
		})
	} catch (error) {
		const err = error as AxiosError
		if (typeof err.response?.data === 'object') {
			dispatch(setErrors({...err.response.data}))
		}
	}
}

export default authSlice.reducer
