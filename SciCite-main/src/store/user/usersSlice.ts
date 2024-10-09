import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "api/user.api";
import { AxiosError } from "axios";
import { ProfileFormInput } from "components/Profile/ProfileInfo/ProfileForm/ProfileForm";
import { TAction, TAppState } from "store/store";
import { TAchivement, TLevel, TNotification, TStatistic } from "types/user.types";

type TSetUserActionPayload = {
    id: string
    login: string
    number_phone: string
    email: string
    full_name: string
    roles: string
    is_staff: boolean
}

type TSetUserInfoActionPayload = {
    balance: number
    level: string
    limit: number
    next_level: TLevel | null
    count_publication: number
}

const initialState = {
    id: '',
    is_staff: false,
    login: '',
    roles: null as string | null,
    level: null as string | null,
    citationLimit: null as number | null,
    balance: null as number | null,
    number_phone: '',
    email: '',
    full_name: '',
    statistic: null as TStatistic | null,
    next_level: null as TLevel | null,
    count_publication: null as number | null,
    achievements: [] as TAchivement[],
    currentAchievement: null as string | null,
	notifications: [] as TNotification[],
    errors: null as { [k: string]: string[] } | null
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<TSetUserActionPayload>) => {
            state.id = action.payload.id
            state.roles = action.payload.roles
            state.login = action.payload.login
            state.number_phone = action.payload.number_phone
            state.email = action.payload.email
            state.full_name = action.payload.full_name
        },

        setUserLevelData: (state, action: PayloadAction<TSetUserInfoActionPayload>) => {
            state.balance = action.payload.balance
            state.level = action.payload.level
            state.citationLimit = action.payload.limit
            state.next_level = action.payload.next_level
            state.count_publication = action.payload.count_publication
        },

        setAcivements: (state, action: PayloadAction<TAchivement[]>) => {
            state.achievements = [...action.payload]
        },

        setUserStatisticData: (state, action: PayloadAction<TStatistic>) => {
            state.statistic = { ...action.payload }
        },

        setCurrentAchievement: (state, action: PayloadAction<string | null>) => {
            state.currentAchievement = action.payload
        },

        setErrors: (state, action: PayloadAction<{ [k: string]: string[] } | null>) => {
            state.errors = action.payload
        },

        setNotifications: (state, action: PayloadAction<TNotification[]>) => {
			state.notifications = action.payload
		},
		clearNotifications: (state) => {
			state.notifications = []
		},
    }
})

export const {
    setUser,
    setAcivements,
    setCurrentAchievement,
    setUserLevelData,
    setUserStatisticData,
    setNotifications,
    clearNotifications,
    setErrors
} = userSlice.actions

type TThunk = ThunkAction<Promise<void>, TAppState, unknown, TAction<typeof userSlice.actions>>

const getUserStatistic = (userId: string): TThunk => async (dispatch) => {
    const data = await userAPI.getUserStatistic(userId)
    dispatch(setUserStatisticData(data.data))
}

const getAcievements = (userId: string): TThunk => async (dispatch) => {
    const data = await userAPI.getUserAchievements(userId)
    dispatch(setAcivements(data.results))
}

export const getCurrentAcievement = (achieveId: string | null): TThunk => async (dispatch) => {
    if (achieveId) {
        const data = await userAPI.getAchievementById(achieveId)
        dispatch(setCurrentAchievement(data.data.achievement))
    } else {
        dispatch(setCurrentAchievement(achieveId))
    }
}

export const getUserData = (userId: string): TThunk => async (dispatch) => {
    const data = await userAPI.getUserData(userId)
    dispatch(setUser(
        {
            id: data.data.id,
            is_staff: data.data.is_staff,
            roles: data.data.roles.name,
            login: data.data.login,
            number_phone: data.data.number_phone,
            email: data.data.email,
            full_name: data.data.full_name
        }
    ))
    const progressData = await userAPI.getUserProgress()
    dispatch(setUserLevelData({
        balance: data.data.balance,
        level: data.data.level.name,
        limit: data.data.level.limit,
        next_level: progressData.data.next_level ? progressData.data.next_level : null,
        count_publication: progressData.data.count_publication
    }))
    dispatch(getAcievements(data.data.id))
    dispatch(getUserStatistic(data.data.id))
}

export const updateUserData = (newUserData: ProfileFormInput, userId: string): TThunk => async (dispatch) => {
    try {
        const data = await userAPI.updateUserData(
            {
                email: newUserData.email,
                login: newUserData.login,
                full_name: newUserData.name,
                number_phone: newUserData.phoneNumber
            }, userId)
        dispatch(setUser(
            {
                id: data.data.id,
                is_staff: data.data.is_staff,
                roles: data.data.roles.name,
                login: data.data.login,
                number_phone: data.data.number_phone,
                email: data.data.email,
                full_name: data.data.full_name
            }
        ))
    } catch (error) {
        const err = error as AxiosError
		if (typeof err.response?.data === "object") {
			dispatch(setErrors({ ...err.response?.data }))
		}
    }
}

export const fetchNotifications = (): TThunk => async (dispatch) => {
	const data = await userAPI.getNotifications()
	dispatch(setNotifications(data.rows))
}

export const deleteNotifications = (): TThunk => async dispatch => {
	const data = await userAPI.clearNotifications()
	dispatch(clearNotifications())
}

export const emailSubscriber = (email: string): TThunk => async () => {
    const data = await userAPI.emailSubscribe(email)
}

export default userSlice.reducer;