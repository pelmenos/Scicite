import { FC } from "react"
import style from './SearchList.module.scss'
import { SearchListFilter } from "features/filters/SearchListFilter/SearchListFilter"
import { SearchListItem } from "entities/SearchListItem/SearchListItem"
import { TCard } from "types/cards.types"

type TProps = {
    cards: TCard[]
    scrollHandler: (e: React.UIEvent<HTMLDivElement>) => void
    currentFilterCategory: string[]
    setCurrentFilterCategory: (arr: string[]) => void
    currentFilterBase: string[]
    setCurrentFilterBase: (arr: string[]) => void
    cardPrice: { [k: string]: number } | undefined
}

export const SearchList: FC<TProps> = (
    {
        cards,
        scrollHandler,
        currentFilterCategory,
        setCurrentFilterCategory,
        currentFilterBase,
        setCurrentFilterBase,
        cardPrice
    }
) => {


    const SearchListItemElement = cards.map(card =>
        <SearchListItem
            key={card.id}
            card={card}
            cardPrice={cardPrice}
        />
    )

    return (
        <div className={style.searchList}>
            <SearchListFilter
                currentFilterCategory={currentFilterCategory}
                setCurrentFilterCategory={setCurrentFilterCategory}
                currentFilterBase={currentFilterBase}
                setCurrentFilterBase={setCurrentFilterBase}
            />
            <div onScroll={scrollHandler} className={style.searchList__list}>
                {SearchListItemElement}
            </div>
        </div>
    )
}