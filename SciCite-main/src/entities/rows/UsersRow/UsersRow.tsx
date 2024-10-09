import { FC, useState } from "react"
import cn from "classnames"
import style from 'components/AdminKit/modals/ModalCitation/ModalCitation.module.scss'
import { ModalProfile } from "components/AdminKit/modals/ModalProfile/ModalProfile"
import { TToggleOBj, parseDate } from "shared/Functions"
import { TUsers } from "types/admin.types"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"

type TProps = {
    user: TUsers
    setCurrentSubSection: (num: number) => void
    setCurrentParam: (param: string) => void
}

export const UsersRow: FC<TProps> = (
    {
        user,
        setCurrentSubSection,
        setCurrentParam
    }
) => {
    const [showModals, setShowModals] = useState<TToggleOBj>({
        profile: false
    })

    const parseUserDate = parseDate(new Date(user.user_created_at), true)

    const getUserInfo = (section: number) => {
        setCurrentSubSection(section)
        setCurrentParam(user.id)
    }

    return (
        <div className={cn(style.row, style.rowSb)}>
            <button className={cn('btn-reset', style.userCell)}
                onClick={() => setShowModals(old => ({ ...old, profile: true }))}>
                <SvgIcon name={user.level?.name} />
                <span>{user.login}</span>
            </button>
            <span className={style.cell}>{parseUserDate}</span>
            <span className={style.cell}>{user.scicoins_earned}</span>
            <span className={style.cell}>
                <span className={style.under}>{user.balance}</span>
            </span>
            <button className={cn('btn-reset', style.cell, style.cellBtn)} onClick={() => getUserInfo(1)}>
                <span className={style.under}>{user.card_create}</span>
            </button>
            <button className={cn('btn-reset', style.cell, style.cellBtn)} onClick={() => getUserInfo(2)}>
                <span className={style.under}>{user.citations_formatted}</span>
            </button>
            {
                showModals.profile &&
                <ModalProfile
                    view={showModals}
                    setView={setShowModals}
                    user={user}
                />
            }
        </div>
    )
}