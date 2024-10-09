import cn from "classnames"
import { FC, useMemo, useState } from "react"
import { TToggleOBj } from "shared/Functions"
import style from './AdminCard.module.scss'
import styleBtns from 'assets/scss/btns.module.scss'
import { ModalAdminDetail } from "components/AdminKit/modals/ModalDetail/ModalAdminDetail"
import { ModalDeleteCard } from "components/AdminKit/modals/ModalDeleteCard/ModalDeleteCard"
import { Card } from "shared/ui/Card/Card"
import { TCard } from "types/cards.types"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"

type TProps = {
    card: TCard
    cardPrice: { [k: string]: number } | undefined
}

export const AdminCard: FC<TProps> = ({ card, cardPrice }) => {
    const [showModals, setShowModals] = useState<TToggleOBj>({
        delete: false,
        detail: false
    })

    const price = useMemo(() => {
        return cardPrice && cardPrice[Object.keys(cardPrice).filter(item => (
            item.includes(card.base.name)
        ))[0]]
    }, [card.base.name, cardPrice])

    const cardDeadline = new Date(
        new Date(card.created_at)
            .setMonth(new Date(card.created_at)
                .getMonth() + card.tariff.period)
    )
    const parseDate = (cardDeadline.getDate() < 10 ? `0${cardDeadline.getDate()}` : `${cardDeadline.getDate()}`) +
        '.' + (cardDeadline.getMonth() + 1 < 10 ? `0${cardDeadline.getMonth() + 1}` : `${cardDeadline.getMonth() + 1}`) +
        '.' + (`${cardDeadline.getFullYear()}`).substring(2)

    return (
        <Card isAdmin cardTitle={card.theme} bcgImg={card.category[0]?.name}>
            <>
                <div className={style.topBlock}>
                    <span className={style.number}>№{card.cart_number}</span>
                    <button className={cn('btn-reset', style.deleteBtn)}
                        onClick={() => setShowModals(old => ({ ...old, delete: true }))}>
                        <SvgIcon name="btn-cross" />
                    </button>
                </div>
            </>
            <>
                <ul className={cn('list-reset', style.info)}>
                    <li className={style.infoItem}>
                        {card.user.login.length > 15 ? `${card.user.login.slice(0, 15)}...` : card.user.login}
                    </li>
                    <li className={style.infoItem}>
                        {parseDate}
                    </li>
                    <li className={cn(style.infoItem, style.price)}>
                        {
                            (card.base.name.toLowerCase() === 'другое' &&
                                cardPrice && cardPrice['вак']) ||
                            (card.base.name.toLowerCase() === 'web of science' &&
                                cardPrice && cardPrice['scopus/wos']) ||
                            price
                        }
                        <SvgIcon name="coins" />
                    </li>
                </ul>
                <button className={cn('btn-reset', styleBtns.btnAstral, style.infoBtn)}
                    onClick={() => setShowModals(old => ({ ...old, detail: true }))}>информация</button>
                {
                    showModals.delete &&
                    <ModalDeleteCard view={showModals} setView={setShowModals} itemId={card.id} />
                }
                {
                    showModals.detail &&
                    <ModalAdminDetail view={showModals} setView={setShowModals} card={card} />
                }
            </>
        </Card>
    )
}