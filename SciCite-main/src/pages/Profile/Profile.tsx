import { FC, useEffect, useState } from "react"
import cn from "classnames"
import style from './Profile.module.scss'
import styleBtns from 'assets/scss/btns.module.scss'
import { ProfileInfo } from "components/Profile/ProfileInfo/ProfileInfo"
import { ProfileProgress } from "components/Profile/ProfileProgress/ProfileProgress"
import { BtnsHelp } from "shared/ui/BtnsHelp/BtnsHelp"
import useWindow from "shared/CustomHooks"
import { useTranslation } from "react-i18next"


const Profile: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({ setFooterVisible }) => {
    const {t} = useTranslation()
    useEffect(() => {
        setFooterVisible(true)
    }, [setFooterVisible])

    const [profileView, setProfileView] = useState(true)
    const isMobile = useWindow()

    return (
        <main className={style.main}>
            <div className={cn('container', style.main__container)}>
                <div className={style.main__toogleBtnsMobile}>
                    <button className={cn('btn-reset', styleBtns.btnAstral,
                        style.main__toggleBtnMobile, profileView ? styleBtns.btnAstral_active : '')}
                        onClick={() => setProfileView(true)}>{t("profile")}</button>
                    <button className={cn('btn-reset', styleBtns.btnAstral,
                        style.main__toggleBtnMobile, !profileView ? styleBtns.btnAstral_active : '')}
                        onClick={() => setProfileView(false)}>{t("progress")}</button>
                </div>
                {
                    isMobile ?
                        (profileView ? <ProfileInfo /> : <ProfileProgress />) :
                        <>
                            <ProfileInfo />
                            <ProfileProgress />
                        </>
                }
            </div>
            <BtnsHelp />
        </main>
    )
}

export default Profile;