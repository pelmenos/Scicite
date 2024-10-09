import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, removeModals } from "shared/Functions"
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalProfile.module.scss'
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { TUsers } from "types/admin.types"

type userData = {
    login: string
    full_name: string
    number_phone: string
    email: string
    card_create: number
    citations_received: number
    citations_formatted: number
    successful_citations: string
    scicoins_spent: number
    scicoins_earned: number
    exchanges_completed: number
}

type TProps = {
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    user: userData
}

export const ModalProfile: FC<TProps> = (
    {
        view,
        setView,
        user
    }
) => {

    const [addClass, setAddClass] = useState(true)

    return (
        <ModalWrapper
            view={view}
            setView={setView}
            changeEl={'profile'}
            addClass={addClass}
            setAddClass={setAddClass}
        >
            <div className={style.modal}>
                <div className={style.dataBlock}>
                    <p className={style.title}>{user.login}</p>
                    <ul className={cn('list-reset', style.dataList)}>
                        <li className={style.dataItem}>
                            <span className={style._text}>{user.full_name}</span>
                        </li>
                        <li className={style.dataItem}>
                            <span className={style.text}>{user.number_phone}</span>
                        </li>
                        <li className={style.dataItem}>
                            <span className={style.text}>{user.email}</span>
                        </li>
                    </ul>
                </div>
                <div className={style.dataBlock}>
                    <p className={style.title}>статистика</p>
                    <ul className={cn('list-reset', style.statisticsList)}>
                        <li className={style.statisticsItem}>
                            <span className={style.value}>карточек создано</span>
                            <span className={style.value}>{user.card_create}</span>
                        </li>
                        <li className={style.statisticsItem}>
                            <span className={style.value}>цитирований получено</span>
                            <span className={style.value}>{user.citations_received}</span>
                        </li>
                        <li className={style.statisticsItem}>
                            <span className={style.value}>цитирований оформлено</span>
                            <span className={style.value}>{user.citations_formatted}</span>
                        </li>
                        <li className={style.statisticsItem}>
                            <span className={style.value}>успешные цитирования</span>
                            <span className={style.value}>{user.successful_citations}</span>
                        </li>
                        <li className={style.statisticsItem}>
                            <span className={style.value}>scicoins потрачено</span>
                            <span className={style.value}>{user.scicoins_spent}</span>
                        </li>
                        <li className={style.statisticsItem}>
                            <span className={style.value}>scicoins заработано</span>
                            <span className={style.value}>{user.scicoins_earned}</span>
                        </li>
                        <li className={style.statisticsItem}>
                            <span className={style.value}>обменов выполнено</span>
                            <span className={style.value}>{user.exchanges_completed}</span>
                        </li>
                    </ul>
                </div>
                <button className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                    onClick={() => removeModals(setAddClass, setView, view, 'profile')}>закрыть</button>
            </div>
        </ModalWrapper>
    )
}