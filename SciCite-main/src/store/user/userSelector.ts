import { TAppState } from "store/store";

export const getUserId = (state: TAppState) => {
    return state.users.id
}

export const getIsStaff = (state: TAppState) => {
    return state.users.is_staff
}

export const getRole = (state: TAppState) => {
    return state.users.roles
}

export const getLogin = (state: TAppState) => {
    return state.users.login
}

export const getBalance = (state: TAppState) => {
    return state.users.balance
}

export const getLevel = (state: TAppState) => {
    return state.users.level
}

export const getNextLevel = (state: TAppState) => {
    return state.users.next_level
}

export const getCountPublication = (state: TAppState) => {
    return state.users.count_publication
}

export const getAchievements = (state: TAppState) => {
    return state.users.achievements
}

export const getCurrentAchievement = (state: TAppState) => {
    return state.users.currentAchievement
}

export const getPhoneNumber = (state: TAppState) => {
    return state.users.number_phone
}

export const getEmail = (state: TAppState) => {
    return state.users.email
}

export const getName = (state: TAppState) => {
    return state.users.full_name
}

export const getStatistic = (state: TAppState) => {
    return state.users.statistic
}

export const getNotifications = (state: TAppState) => {
	return state.users.notifications
}

export const getErrors = (state: TAppState) => {
	return state.users.errors
}