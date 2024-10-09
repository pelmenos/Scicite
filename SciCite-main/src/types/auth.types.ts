
export type TRegistrationData = {
    full_name: string
    last_name: string
    number_phone: string
    login: string
    password: string
    password_confirm: string
    email: string
}

export type TLoginData = {
    username: string
    password: string
}

export type TForgotData = {
    email: string
}

export type TResetPassword = {
    new_password: string
    confirm_new_password: string
}

export type TChangePasswordData = {
    old_password: string
    new_password: string
    confirm_password: string
}

export type TClientChangePasswordData = {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export type TVerifyEmail = {
    message: string
    achievement: string
    start_bonus: number
}