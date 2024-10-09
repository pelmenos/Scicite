import { FC, useState } from "react"
import cn from "classnames"
import style from './ProfileInfo.module.scss'
import styleMain from 'pages/Profile/Profile.module.scss'
import styleBtns from 'assets/scss/btns.module.scss'
import { ProfileForm } from "./ProfileForm/ProfileForm"
import { useSelector } from "react-redux"
import { getAchievements, getEmail, getLogin, getName, getPhoneNumber, getStatistic } from "store/user/userSelector"
import { TToggleOBj } from "shared/Functions"
import { ModalChangePassword } from "components/Modals/authorization/ModalChangePassword/ModalChangePassword"
import { AchivementsList } from "components/Modals/Achivements/AchivementsList/AchivementsList"
import { useTranslation } from "react-i18next"


export const ProfileInfo: FC = () => {
    const {t} = useTranslation()

    const [showModals, setShowModals] = useState<TToggleOBj>({
        changePass: false,
        achievements: false
    })

    const [edit, setEdit] = useState(false)
    const user = {
        login: useSelector(getLogin),
        phoneNumber: useSelector(getPhoneNumber),
        email: useSelector(getEmail),
        name: useSelector(getName),
    }
    const statistic = useSelector(getStatistic)
    const achivements = useSelector(getAchievements)

    const DataItem: FC<{ innerText: string }> = ({ innerText }) => {
        return (
            <li className={style.profileInfo__dataItem}>
                <span className={style.profileInfo__text}>{innerText}</span>
            </li>
        )
    }

    const StatisticItem: FC<{ value: string | number, title: string }> = ({ value, title }) => {
        return (
            <li className={style.profileInfo__statisticsItem}>
                <span className={style.profileInfo__value}>{title}</span>
                <span className={style.profileInfo__value}>{value}</span>
            </li>
        )
    }

    return (
        <div className={style.profileInfo}>
            <div className={style.profileInfo__dataBlock}>
                <p className={styleMain.main__title}>{t("profile_data")}</p>
                {
                    !edit ?
                        <ul className={cn('list-reset', style.profileInfo__dataList)}>
                            <DataItem innerText={user.login} />
                            <DataItem innerText={user.name} />
                            <DataItem innerText={user.phoneNumber} />
                            <DataItem innerText={user.email} />
                            <li className={style.profileInfo__dataItem}>
                                <button className={cn('btn-reset', style.profileInfo__btnChange)}
                                    onClick={() => setEdit(true)}>{t("edit")}</button>
                            </li>
                        </ul> :
                        <ProfileForm profileData={user} setEdit={setEdit} />
                }
                <button
                    className={
                        cn('btn-reset',
                            styleBtns.btnAstral,
                            style.profileInfo__btnChPas)
                    } onClick={() => setShowModals(old => ({ ...old, changePass: true }))}>
                    {t("change_password")}
                </button>
            </div>
            <div className={style.profileInfo__dataBlock}>
                <p className={styleMain.main__title}>{t("statistics")}</p>
                <ul className={cn('list-reset', style.profileInfo__statisticsList)}>
                    <StatisticItem
                        title={t("statistic_data.created_cards")}
                        value={statistic ? statistic.card_create : 0}
                    />
                    <StatisticItem
                        title={t("statistic_data.citations_received")}
                        value={statistic ? statistic.citations_received : 0}
                    />
                    <StatisticItem
                        title={t("statistic_data.citations_formated")}
                        value={statistic ? statistic.citations_formatted : 0}
                    />
                    <StatisticItem
                        title={t("statistic_data.successful_citations")}
                        value={statistic ? statistic.successful_citations : '0%'}
                    />
                    <StatisticItem
                        title={t("statistic_data.scicoins_spent")}
                        value={statistic ? statistic.scicoins_spent : 0}
                    />
                    <StatisticItem
                        title={t("statistic_data.scicoins_earned")}
                        value={statistic ? statistic.scicoins_earned : 0}
                    />
                    <StatisticItem
                        title={t("statistic_data.exchanges_completed")}
                        value={statistic ? statistic.exchanges_completed : 0}
                    />
                    <li className={style.profileInfo__statisticsItem}>
                        <span className={style.profileInfo__value}>{t("achievements_earned")}</span>
                        <button
                            className={cn(
                                'btn-reset',
                                styleBtns.btnAstral,
                                style.valueAchevement
                            )}
                            onClick={() => setShowModals(old => ({ ...old, achievements: true }))}
                        >
                            {achivements?.length} {t("of")} 5
                        </button>
                    </li>
                </ul>
            </div>
            {
                showModals.changePass &&
                <ModalChangePassword view={showModals} setView={setShowModals} />
            }
            {
                showModals.achievements &&
                <AchivementsList
                    view={showModals}
                    setView={setShowModals}
                    achievements={achivements}
                />
            }
        </div>
    )
}