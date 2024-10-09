import { FC } from "react"
import style from './SearchCards.module.scss'
import { SearchCardsItem } from "entities/cards/SearchCardsItem/SearchCardsItem"
import { TCard } from "types/cards.types"

type TProps = {
    cards: TCard[]
    scrollHandler: (e: React.UIEvent<HTMLDivElement>) => void
    cardPrice: { [k: string]: number } | undefined
}

export const SearchCards: FC<TProps> = ({ cards, scrollHandler, cardPrice }) => {

    const SearchCardsItemElement = cards.map(card =>
        <SearchCardsItem
            key={card.id}
            card={card}
            cardPrice={cardPrice}
        />
    )

    return (
        <div onScroll={scrollHandler} className={style.searchCards}>
            {SearchCardsItemElement}
        </div>
    )
}