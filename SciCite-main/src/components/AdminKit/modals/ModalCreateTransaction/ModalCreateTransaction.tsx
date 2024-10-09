import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, removeModals } from "shared/Functions"
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalCreateTransaction.module.scss'
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { AppDispatch } from "store/store"
import { useDispatch } from "react-redux"
import { createTransaction } from "store/admin/adminSlice"
import { useForm } from "react-hook-form"

type formFields = {
    user: string
    sum: number
}

type TProps = {
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
}

export const ModalCreateTransaction: FC<TProps> = ({ view, setView }) => {
    const [addClass, setAddClass] = useState(true)

    const dispatch: AppDispatch = useDispatch()

    const {
        register,
        handleSubmit
    } = useForm<formFields>()

    const onSubmit = handleSubmit((data) => {
        dispatch(createTransaction({
            user: data.user,
            sum: +data.sum < 0 ? -+data.sum : +data.sum,
            basis_creation: 'enrollment_admin',
            type_transaction: +data.sum > 0 ? 'plus' : 'minus'
        }))
        removeModals(setAddClass, setView, view, 'createTrnsaction')
    })

    return (
        <ModalWrapper view={view} setView={setView} changeEl={'createTrnsaction'}
            addClass={addClass} setAddClass={setAddClass}>
            <form className={cn(style.modalCreateTrans)} onSubmit={onSubmit}>
                <p className={style.title}>создать транзакцию</p>
                <div className={style.fieldsBlock}>
                    <input
                        {...register('user', { required: true })}
                        type="text"
                        placeholder={'имя пользователя'}
                        className={cn('input-reset', style.field)}
                    />
                    <input
                        {...register('sum', { required: true })}
                        type="text"
                        placeholder={'сумма'}
                        className={cn('input-reset', style.field)}
                    />
                </div>
                <div className={style.btnsBlock}>
                    <button
                        type="submit"
                        className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                    >создать</button>
                    <button
                        type="button"
                        className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                        onClick={() => removeModals(setAddClass, setView, view, 'createTrnsaction')}
                    >отмена</button>
                </div>
            </form>
        </ModalWrapper>
    )
}