import { TAchivement, TLevel, TProgress, TUpdateUser, TUser, TStatistic } from "types/user.types";
import { TResponse, TResponseWithResults, instance } from "./api";

export const userAPI = {
    async getUserData(userId: string) {
        const response = await instance.get<TResponse<TUser>>(`/profiles/users/${userId}/`);
        return response.data;
    },

    async getUserLevel(levelId: string) {
        const response = await instance.get<TResponse<TLevel>>(`/profiles/levels/${levelId}/`);
        return response.data
    },

    async getUserStatistic(userId: string) {
        const response = await instance.get<TResponse<TStatistic>>(`/profiles/users/statistic/${userId}/`);
        return response.data
    },

    async getUserProgress() {
        const response = await instance.get<TResponse<TProgress>>(`/profiles/levels/progress/`);
        return response.data
    },

    async getUserAchievements(userId: string) {
        const response = await instance.get<TResponseWithResults<TAchivement>>(`/profiles/achievement/?user__id=${userId}`);
        return response.data
    },

    async getAchievementById(achieveId: string) {
        const response = await instance.get<TResponse<TAchivement>>(`/profiles/achievement/${achieveId}/`);
        return response.data
    },

    async updateUserData(newUserData: TUpdateUser, userId: string) {
        const response = await instance.patch<TResponse<TUser>>(`/profiles/users/${userId}/`, newUserData);
        return response.data
    },
    
	async getNotifications() {
		const response = await instance.get<any>(`/profiles/users/notify/`)
		if (response.data.success) return response.data.data
		else return
	},

	async clearNotifications() {
		const response = await instance.post<any>(`/profiles/users/notify/clear/`)
		return response.data.data
	},

    async emailSubscribe(email: string) {
        const response = await instance.post<{email: string}>('/profiles/subscribe/', {email})
        return response
    }
}