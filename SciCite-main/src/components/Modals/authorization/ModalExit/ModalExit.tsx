import cn from "classnames"
import { FC, useEffect, useState } from "react"
import { TToggleOBj, removeModals } from "shared/Functions"
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalExit.module.scss'
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { AppDispatch } from "store/store"
import { useDispatch } from "react-redux"
import { logout } from "store/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

type TProps = {
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    isAuth: boolean
}

export const ModalExit: FC<TProps> = ({ view, setView, isAuth }) => {
    const {t} = useTranslation()

    const dispatch: AppDispatch = useDispatch()

    const navigation = useNavigate()

    const [addClass, setAddClass] = useState(true)

    useEffect(() => {
        if (!isAuth) {
            removeModals(setAddClass, setView, view, 'exit')
            navigation('/main', {
                replace: true
            })
        }
    }, [isAuth])

    const handleClick = () => {
        dispatch(logout())
    }

    return (
        <ModalWrapper view={view} setView={setView} changeEl={'exit'} addClass={addClass} setAddClass={setAddClass}>
            <div className={style.modal}>
                <p className={style.title}>{t("exit")}</p>
                <div className={style.btnsBlock}>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                        onClick={handleClick}>{t("yes")}</button>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                        onClick={() => removeModals(setAddClass, setView, view, 'exit')}>{t("no")}</button>
                </div>
            </div>
        </ModalWrapper>
    )
}