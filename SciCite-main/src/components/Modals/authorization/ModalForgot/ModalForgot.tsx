import cn from 'classnames'
import { FC, useEffect, useState } from 'react'
import { TToggleOBj, removeModals } from 'shared/Functions'
import styleBtns from 'assets/scss/btns.module.scss'
import style from 'entities/AuthForm/AuthForm.module.scss'
import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/FormInput/FormInput'
import { AuthForm } from 'entities/AuthForm/AuthForm'
import { forgotPassword, setErrors } from 'store/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getErrors } from 'store/auth/authSelector'
import { AppDispatch } from 'store/store'
import { emailPattern } from 'shared/Patterns'
import { useTranslation } from 'react-i18next'

type TProps = {
	view: TToggleOBj
	setView: (toggle: TToggleOBj) => void
}

type FormFields = {
	email: string
}

export const ModalForgot: FC<TProps> = ({ view, setView }) => {
	const {t} = useTranslation()
	const [addClass, setAddClass] = useState(true)
	const [isSubmit, setIsSubmit] = useState(false)
	const [email, setEmail] = useState('')

	const dispatch: AppDispatch = useDispatch()
	const err = useSelector(getErrors)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormFields>()

	const Login = () => {
		removeModals(setAddClass, setView, view, 'forgot', 'login')
	}

	const onSubmit = handleSubmit(async (data) => {
		if (err !== null) {
			dispatch(setErrors(null))
		}
		await dispatch(forgotPassword(data))
		setEmail(data.email)
	})

	useEffect(() => {
		const closeModal = () => {
			if (err === null && email) {
				setIsSubmit(true)
			}
		}

		closeModal()
	}, [email, err])

	return (
		<AuthForm
			addClass={addClass}
			setAddClass={setAddClass}
			changeEl='forgot'
			onSubmit={onSubmit}
			view={view}
			setView={setView}
			title={isSubmit ? '' : t("password_reset")}
			addStyles={isSubmit ? style.subForm : ''}
		>
			{
				!isSubmit ?
					<>
						<div>
							<FormInput<FormFields>
								type='text'
								name='email'
								placeholder={t("Email")}
								register={register}
								errors={errors}
								rules={{
									required: t("required", {name: "Email"}),
									minLength: { value: 5, message: t("min_length") },
									maxLength: { value: 50, message: t("max_length") },
									pattern: {
										value: emailPattern.value,
										message: t("incorrect", "Email"),
									},
								}}
								addStyle={style.field}
							/>
							{errors.email && <p className={style.error}>{errors.email.message}</p>}
						</div>
						<button
							type={'submit'}
							className={cn('btn-reset', styleBtns.btnDark, style.btnSub)}
						>
							{t("reset")}
						</button>
					</> :
					<p className={style.title}>
						{t("reset_confirm.part1")} <span>{email}</span> {t("reset_confirm.part2")}
					</p>
			}
			<button
				type={'button'}
				className={cn('btn-reset', style.btnAuth)}
				onClick={Login}
			>
				{t("signIn")}
			</button>
		</AuthForm>
	)
}
