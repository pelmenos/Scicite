import { FC, useEffect } from "react"
import cn from "classnames"
import { TToggleOBj, removeModals } from "shared/Functions"
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalAddCardInResponses.module.scss'
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"


type TProps = {
    isAddCard?: boolean
    setClass: (toggle: boolean) => void
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    barter?: boolean
}

export const ModalAddCardInResponses: FC<TProps> = (
    {
        isAddCard,
        setClass,
        view,
        setView,
        barter
    }
) => {
    const {t} = useTranslation()

    const navigate = useNavigate()

    const deleteModal = () => {
        removeModals(setClass, setView, view, barter ? 'barter' : 'detail')
        navigate('/responses', {
            replace: true
        })
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            setView({ ...view, addCard: false })
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={cn(style.modalAddCardInResponses, isAddCard ? style.viewModal : '')}>
            <p className={style.modalAddCardInResponses__title}>
                {t("card_added")}
            </p>
            <button className={cn('btn-reset', styleBtns.btnAstral,
                style.modalAddCardInResponses__btnClose)}
                onClick={deleteModal}>{t("go")}</button>
        </div>
    )
}