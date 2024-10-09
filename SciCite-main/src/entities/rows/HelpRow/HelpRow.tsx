import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, parseDate } from "shared/Functions"
import style from 'components/AdminKit/modals/ModalCitation/ModalCitation.module.scss'
import { ModalContact } from "components/AdminKit/modals/ModalContact/ModalContact"
import { ModalProfile } from "components/AdminKit/modals/ModalProfile/ModalProfile"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"
import { THelp } from "types/admin.types"

type TProps = {
    help: THelp
    setCurrentSubSection: (num: number) => void
    setCurrentMainSection: (num: number) => void
}

export const HelpRow: FC<TProps> = (
    {
        setCurrentSubSection,
        setCurrentMainSection,
        help
    }
) => {
    const [showModals, setShowModals] = useState<TToggleOBj>({
        profile: false,
        contact: false
    })

    const parseUserDate = parseDate(new Date(help.declarer_user.created_at), true)
    const parseHelpDate = parseDate(new Date(help.created_at), true, true)

    return (
        <div className={cn(style.row, style.rowSb)}>
            <button className={cn('btn-reset', style.userCell)}
                onClick={() => setShowModals(old => ({ ...old, profile: true }))}>
                <SvgIcon name={help.declarer_user.level.name} />
                <span>{help.declarer_user.login}</span>
            </button>
            <span className={style.cell}>{parseUserDate}</span>
            <span className={style.cell}>{parseHelpDate}</span>
            <button className={cn('btn-reset', style.cell, style.cellBtn)}
                onClick={() => { setCurrentSubSection(1); setCurrentMainSection(1) }}>
                <span className={style.under}>{help.declarer_cards_count}</span>
            </button>
            <button className={cn('btn-reset', style.cell, style.cellBtn)}
                onClick={() => { setCurrentSubSection(2); setCurrentMainSection(1) }}>
                <span className={style.under}>{help.declarer_user.level.count_offers}</span>
            </button>
            <button className={cn('btn-reset', style.cell, style.cellBtn)}
                onClick={() => setShowModals(old => ({ ...old, contact: true }))}>
                <span className={style.under}>
                    {
                        (help.total_supports_with_declarer % 10 === 1 &&
                            `${help.total_supports_with_declarer} новое сообщение`) ||
                        `${help.total_supports_with_declarer} новых сообщений`
                    }
                </span>
            </button>
            {/* {
                showModals.profile &&
                <ModalProfile
                    view={showModals}
                    setView={setShowModals}

                />
            } */}
            {
                showModals.contact &&
                <ModalContact
                    view={showModals}
                    setView={setShowModals}
                    email={help.declarer_user.email}
                    login={help.declarer_user.login}
                    fullName={help.declarer_user.full_name}
                    phoneNumber={help.declarer_user.number_phone}
                    narrative={help.narrative}
                    createdDate={parseUserDate}
                />
            }
        </div>
    )
}