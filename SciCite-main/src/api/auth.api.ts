import { TChangePasswordData, TForgotData, TLoginData, TRegistrationData, TResetPassword, TVerifyEmail } from "types/auth.types";
import { TResponse, instance } from "./api";

type TRegResponse = {
    success: boolean
}

type TAuthResponse = {
    access: string
    refresh: string
    user_id: string
}

export const authAPI = {
    async registration(registrationData: TRegistrationData) {
        const response = await instance
            .post<TRegResponse>('/profiles/authentication/registration/', registrationData);
        return response.data;
    },

    async login(loginData: TLoginData) {
        const response = await instance.post<TAuthResponse>('/profiles/authentication/token/', loginData);
        return response.data;
    },

    async forgot(forgotData: TForgotData) {
        const response = await instance.post<any>('/profiles/authentication/password/reset/', forgotData);
        return (response.data);
    },

    async resetPassword(uid: string, token: string, resetData: TResetPassword) {
        const response = await instance.post<any>(
            `/profiles/authentication/password/reset/confirm/${uid}/${token}/`, resetData);
        return (response.data);
    },

    async changePassword(changePasswordData: TChangePasswordData) {
        const response = await instance.post<any>('/profiles/users/change_password/', changePasswordData);
        return response.data;
    },

    async logout(refreshToken: string | null) {
        const response = await instance.post<any>('/profiles/authentication/logout/', {refresh_token: refreshToken});
        return response.data;
    },

    async checkAuth(refreshToken: string | null) {
        const response = await instance
            .post<any>('/profiles/authentication/token/refresh/', {refresh: refreshToken});
        return response.data
    },

    async checkVerifyEmail(querySearch: string) {
        const response = await instance.get<TResponse<TVerifyEmail>>(
            `/profiles/authentication/verify_email/${querySearch}`);
        return response.data
    },
}