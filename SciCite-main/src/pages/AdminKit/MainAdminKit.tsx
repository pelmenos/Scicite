import { FC, useEffect, useState } from "react"
import cn from "classnames"
import style from './MainAdminKit.module.scss'
import { SectionsAdminKit } from "../../components/AdminKit/SectionsAdminKit/SectionsAdminKit"
import { Settings } from "../../components/AdminKit/SettAdminKit/SettAdminKit"


const MainAdminKit: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({ setFooterVisible }) => {

    const [currentMainSection, setCurrentMainSection] = useState(1)

    useEffect(() => {
        setFooterVisible(false)
    }, [])

    return (
        <main className={style.main}>
            <div className={cn('container', style.container)}>
                <div className={style.mainToggleBLock}>
                    <button className={cn('btn-reset', style.mainToggleBtn,
                        currentMainSection === 1 ? style.activeBtn : '')}
                        onClick={() => setCurrentMainSection(1)}>Лента</button>
                    <button className={cn('btn-reset', style.mainToggleBtn,
                        currentMainSection === 2 ? style.activeBtn : '')}
                        onClick={() => setCurrentMainSection(2)}>взаимодействие</button>
                    <button className={cn('btn-reset', style.mainToggleBtn,
                        currentMainSection === 3 ? style.activeBtn : '')}
                        onClick={() => setCurrentMainSection(3)}>настройки</button>
                </div>
                {
                    currentMainSection !== 3 ?
                        <SectionsAdminKit currentMainSection={currentMainSection} 
                            setCurrentMainSection={setCurrentMainSection} /> : 
                        <Settings />
                }
            </div>
        </main>
    )
}

export default MainAdminKit;