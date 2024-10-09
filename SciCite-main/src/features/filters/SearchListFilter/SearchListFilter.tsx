import { FC } from "react"
import style from './SearchListFilter.module.scss'
import { useSelector } from "react-redux"
import { getCategoryList, getRequiredbaseList } from "store/cards/cardsSelector"
import { FilterItem } from "entities/FilterItem/FilterItem"
import { useTranslation } from "react-i18next"

type TProps = {
    currentFilterCategory: string[]
    setCurrentFilterCategory: (arr: string[]) => void
    currentFilterBase: string[]
    setCurrentFilterBase: (arr: string[]) => void
}

export const SearchListFilter: FC<TProps> = (
    {
        currentFilterCategory,
        setCurrentFilterCategory,
        currentFilterBase,
        setCurrentFilterBase
    }
) => {
    const {t} = useTranslation()

    const baseList = useSelector(getRequiredbaseList)
    const categoryList = useSelector(getCategoryList)

    return (
        <form className={style.searchListFilter}>
            <div className={style.searchListFilter__block}>
                <p className={style.searchListFilter__title}>{t("indexing")}</p>
                {baseList && baseList.map(b =>
                    <FilterItem
                        key={b.id}
                        name="base"
                        label={b.name}
                        value={b.id}
                        filterValues={currentFilterBase}
                        setMultiFilterValue={setCurrentFilterBase}
                    />
                )}
            </div>
            <div className={style.searchListFilter__block}>
                <p className={style.searchListFilter__title}>{t("areas")}</p>
                {categoryList && categoryList.map(c =>
                    <FilterItem
                        key={c.id}
                        name="category"
                        label={c.name}
                        value={c.id}
                        filterValues={currentFilterCategory}
                        setMultiFilterValue={setCurrentFilterCategory}
                    />
                )}
            </div>
        </form>
    )
}