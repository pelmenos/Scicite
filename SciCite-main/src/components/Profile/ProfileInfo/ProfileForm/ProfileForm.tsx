import { FC, FormEvent, FocusEvent, useEffect, useState } from 'react'
import cn from 'classnames'
import style from './ProfileForm.module.scss'
import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/FormInput/FormInput'
import { emailPattern } from 'shared/Patterns'
import { useDispatch, useSelector } from 'react-redux'
import { getErrors, getUserId } from 'store/user/userSelector'
import { AppDispatch } from 'store/store'
import { setErrors, updateUserData } from 'store/user/usersSlice'
import PhoneInput from 'react-phone-input-2'
import { useTranslation } from 'react-i18next'

export type ProfileFormInput = {
	login: string
	phoneNumber: string
	email: string
	name: string
}

type TProps = {
	profileData: ProfileFormInput
	setEdit: (toggle: boolean) => void
}

export const ProfileForm: FC<TProps> = ({ profileData, setEdit }) => {
	const {t} = useTranslation()
	const dispatch: AppDispatch = useDispatch()
	const userId = useSelector(getUserId)
	const err = useSelector(getErrors)
	const [isSubmit, setIsSubmit] = useState(false)

	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<ProfileFormInput>({
		defaultValues: {
			login: profileData.login ? profileData.login : '',
			phoneNumber: profileData.phoneNumber ? profileData.phoneNumber : '',
			email: profileData.email ? profileData.email : '',
			name: profileData.name ? profileData.name : '',
		},
	})

	const onSubmit = handleSubmit(async (data) => {
		if (err !== null) {
			dispatch(setErrors(null))
		}
		await dispatch(updateUserData(data, userId))
		setIsSubmit(true)
	})

	useEffect(() => {
		if (err === null && isSubmit) {
			setEdit(false)
		}
		setIsSubmit(false)
	}, [err, isSubmit, setEdit])

	const handleChangeNumberPhone = (value: string) => {
		setValue('phoneNumber', value)
	}

	const handleBlurNumberPhone = (e: FocusEvent<HTMLInputElement>) => {
		if (e.currentTarget.value.length > 10) {
			clearErrors('phoneNumber')
		} else if (e.currentTarget.value.length < 10 && e.currentTarget.value.length > 1) {
			setError('phoneNumber', {type: 'minLength', message: t("min_length")})
		} else if (!e.currentTarget.value) {
			setError('phoneNumber', {type: 'required', message: t("reauired", {name: t("phone_number")})})
		}
	}

	const handleChangeLogin = (e: FormEvent<HTMLInputElement>) => {
		if (e.currentTarget.value.length > 32) {
			e.currentTarget.value = e.currentTarget.value.substring(0, e.currentTarget.value.length - 1)
		}
	}

	return (
		<form className={style.profileForm} onSubmit={onSubmit}>
			<div className={style.inputWrapper}>
				<FormInput<ProfileFormInput>
					type='text'
					name='login'
					placeholder={t("login")}
					register={register}
					errors={errors}
					rules={{
						required: t("required", {name: t("login")}),
						minLength: {
							value: 3,
							message: t("min_length_many", {name: t("login"), count: 3}),
						},
					}}
					addStyle={style.profileForm__field}
					onInput={handleChangeLogin}
				/>
				{err?.login ? err?.login.map(error =>
					<span className={style.errorText}>{error}</span>
				) : errors.login && <span className={style.errorText}>{errors.login.message}</span>}
			</div>
			<div className={style.inputWrapper}>
				<FormInput<ProfileFormInput>
					type='text'
					name='name'
					placeholder={t("full_name")}
					register={register}
					errors={errors}
					addStyle={style.profileForm__field}
				/>
				{err?.full_name ? err?.full_name.map(error =>
					<span className={style.errorText}>{error}</span>
				) : errors.name && <span className={style.error}>{errors.name.message}</span>}
			</div>
			<div className={style.inputWrapper}>
				<PhoneInput
					country={'ru'}
					specialLabel=''
					value={getValues('phoneNumber')}
					onChange={handleChangeNumberPhone}
					onBlur={handleBlurNumberPhone}
					containerClass={style.reactTelInput}
					inputClass={cn('input-reset', style.input, style.profileForm__field)}
					inputStyle={(errors.phoneNumber || err) ? { border: '2px solid var(--error-color)' } : {}}
					buttonClass={style.flagDropdown}
					dropdownClass={style.dropdown}
					placeholder={t("phone")}
				/>
				{(errors.phoneNumber || err) && (
					<p className={style.error}>
						{errors?.phoneNumber?.message || err?.number_phone}
					</p>
				)}
			</div>
			<div className={style.inputWrapper}>
				<FormInput<ProfileFormInput>
					type='email'
					name='email'
					placeholder={t("email")}
					register={register}
					errors={errors}
					rules={{
						required: t("required", {name: "Email"}),
						pattern: {
							value: emailPattern.value,
							message: t("incorrect", {name: "Email"}),
						},
					}}
					addStyle={style.profileForm__field}
				/>
				{err?.email ? err?.email.map(error =>
					<span className={style.errorText}>{error}</span>
				) : errors.email && <span className={style.error}>{errors.email.message}</span>}
			</div>
			<button
				className={cn('btn-reset', style.profileForm__btnSub)}
				type='submit'
			>
				{t("accept")}
			</button>
		</form>
	)
}
