import { FC, useState } from "react"
import cn from "classnames"
import style from './SectionsAdminKit.module.scss'
import { Tape } from "../Tape/Tape"
import { Interaction } from "../Interaction/Interaction"

type TProps = {
    currentMainSection: number
    setCurrentMainSection: (num: number) => void
}

export const SectionsAdminKit: FC<TProps> = ({ currentMainSection, setCurrentMainSection }) => {
    const [currentSubSection, setCurrentSubSection] = useState(1)
    const [currentParam, setCurrentParam] = useState('')

    const changeSection = (section: number) => {
        setCurrentSubSection(section)
        setCurrentParam('')
    }

    return (
        <div className={style.section}>
            <div className={style.subToggleBlock}>
                <button className={cn('btn-reset', style.subToggleBtn, currentSubSection === 1 ? style.activeBtn : '')}
                    onClick={() => changeSection(1)}>{currentMainSection === 1 ? 'карточки' :
                        'помощь'}</button>
                <button className={cn('btn-reset', style.subToggleBtn, currentSubSection === 2 ? style.activeBtn : '')}
                    onClick={() => changeSection(2)}>{currentMainSection === 1 ? 'отклики' :
                        'споры'}</button>
                <button className={cn('btn-reset', style.subToggleBtn, currentSubSection === 3 ? style.activeBtn : '')}
                    onClick={() => changeSection(3)}>{currentMainSection === 1 ? 'пользователи' :
                        'транзакции'}</button>
            </div>
            {
                currentMainSection === 1 ?
                    <Tape
                        currentSection={currentSubSection}
                        setCurrentSubSection={setCurrentSubSection}
                        currentParam={currentParam}
                        setCurrentParam={setCurrentParam}
                    /> :
                    <Interaction
                        currentSection={currentSubSection}
                        setCurrentSubSection={setCurrentSubSection}
                        setCurrentMainSection={setCurrentMainSection}
                    />
            }
        </div>
    )
}