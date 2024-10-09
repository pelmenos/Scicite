import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, parseDate } from "shared/Functions"
import style from 'components/AdminKit/modals/ModalCitation/ModalCitation.module.scss'
import { ModalContact } from "components/AdminKit/modals/ModalContact/ModalContact"
import { ModalProfile } from "components/AdminKit/modals/ModalProfile/ModalProfile"
import { ModalResponseInfo } from "components/AdminKit/modals/ModalResponseInfo/ModalResponseInfo"
import { TSupport } from "types/support.types"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"

type TProps = {
    setCurrentSubSection: (num: number) => void
    setCurrentMainSection: (num: number) => void
    support: TSupport
}

export const ArgumentRow: FC<TProps> = (
    {
        setCurrentSubSection,
        setCurrentMainSection,
        support
    }
) => {
    const [showModals, setShowModals] = useState<TToggleOBj>({
        profile: false,
        contact: false,
        responsesInfo: false
    })

    const parseUserDate = parseDate(new Date(support.declarer.created_at), true)
    const parseSuppDate = parseDate(new Date(support.created_at), true)

    return (
        <div className={cn(style.row, style.rowSb)}>
            <button className={cn('btn-reset', style.userCell)}
                onClick={() => setShowModals(old => ({ ...old, profile: true }))}>
                <SvgIcon name={support.declarer.level.name} />
                <span>{support.declarer.login}</span>
            </button>
            <span className={style.cell}>{parseSuppDate}</span>
            <span className={style.userCell}>
                <SvgIcon name={support.offer?.perfomer.level.name} />
                <span>{support.offer?.perfomer.login}</span>
            </span>
            <button className={cn('btn-reset', style.userCell)}
                onClick={() => { setCurrentSubSection(1); setCurrentMainSection(1) }}>
                <SvgIcon name={support.offer?.card.user.level.name} />
                <span>{support.offer?.card.user.login}</span>
            </button>
            <button className={cn('btn-reset', style.cell, style.cellBtn)}
                onClick={() => setShowModals(old => ({ ...old, responsesInfo: true }))}>
                <span className={style.under}>ОТКЛИК №{support.offer?.offer_number}</span>
            </button>
            <button className={cn('btn-reset', style.cell, style.cellBtn)}
                onClick={() => setShowModals(old => ({ ...old, contact: true }))}>
                <span className={style.under}>перейти</span>
            </button>
            {/* {
                showModals.profile &&
                    <ModalProfile view={showModals} setView={setShowModals} />
            } */}
            {
                showModals.contact &&
                <ModalContact
                    view={showModals}
                    setView={setShowModals}
                    isArgument={true}
                    email={support.declarer.login === support.offer.perfomer.login ? support.offer.perfomer.email : support.declarer.email}
                    login={support.declarer.login === support.offer.perfomer.login ? support.offer.perfomer.login : support.declarer.login}
                    fullName={support.declarer.login === support.offer.perfomer.login ? support.offer.perfomer.full_name : support.declarer.full_name}
                    phoneNumber={support.declarer.login === support.offer.perfomer.login ? support.offer.perfomer.number_phone : support.declarer.number_phone}
                    offerNumber={support.offer.offer_number}
                    offerId={support.offer.id}
                    suppId={support.id}
                    narrative={support.narrative}
                    createdDate={parseUserDate}
                    refuse={support.declarer.login === support.offer.perfomer.login}
                />
            }
            {
                showModals.responsesInfo &&
                <ModalResponseInfo
                    view={showModals}
                    setView={setShowModals}
                    offer={support.offer}
                />
            }
        </div>
    )
}