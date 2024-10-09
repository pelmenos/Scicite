import { FC } from "react"
import cn from "classnames"
import style from './MyCardsArchive.module.scss'
import { MyCardsArchiveItem } from "entities/cards/MyCardsArchiveItem/MyCardsArchiveItem"
import { TCard } from "types/cards.types"
import { useSelector } from "react-redux"
import { getSettings } from "store/admin/adminSelector"


type TProps = {
    cards: TCard[] | null
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export const MyCardsArchive: FC<TProps> = ({ cards, onScroll }) => {
    const { price_publication } = { ...useSelector(getSettings) }

    const MyCardsItems = cards?.map(card =>
        <MyCardsArchiveItem
            key={card.id}
            card={card}
            cardPrice={price_publication}
        />
    )

    return (
        <div className={cn('container', style.myCardsArchive)} onScroll={onScroll}>
            {MyCardsItems}
        </div>
    )
}