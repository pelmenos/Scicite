import cn from "classnames"
import { FC, useState } from "react"
import style from './SearchFilter.module.scss'
import { removeModal } from "shared/Functions"
import { getCategoryList, getRequiredbaseList } from "store/cards/cardsSelector"
import { useSelector } from "react-redux"
import { FilterItem } from "entities/FilterItem/FilterItem"
import { useTranslation } from "react-i18next"

export interface SearchFormInput {
    searchStr: string
}

type TProps = {
    isMobile?: boolean
    searchFilterView?: boolean
    setSearchFilterView: (toggle: boolean) => void
    currentFilterCategory: string[]
    setCurrentFilterCategory: (arr: string[]) => void
    currentFilterBase: string[]
    setCurrentFilterBase: (arr: string[]) => void
    ishiddenCheckBox?: boolean
    setFilterLabels?: (arr: string[]) => void
    filterLabels?: string[]
}

export const SearchFilter: FC<TProps> = (
    {
        setSearchFilterView,
        searchFilterView,
        isMobile,
        currentFilterCategory,
        setCurrentFilterCategory,
        currentFilterBase,
        setCurrentFilterBase,
        ishiddenCheckBox,
        setFilterLabels,
        filterLabels
    }
) => {
    const {t} = useTranslation()

    const baseList = useSelector(getRequiredbaseList)
    const categoryList = useSelector(getCategoryList)

    const [addClass, setAddClass] = useState(true)

    return (
        <div className={cn(style.substrate, isMobile && addClass ? style.view : style.hidden)}>
            {
                isMobile ?
                    <div className={style.overlay} onClick={() => removeModal(setAddClass, setSearchFilterView)} /> :
                    ''
            }
            <form className={cn(style.searchFilter, isMobile && addClass ? style.viewModal : style.hiddenModal)}
                style={{ display: searchFilterView ? 'flex' : 'none' }}>
                <div className={style.searchFilter__block}>
                    <p className={style.searchFilter__title}>{t("areas")}</p>
                    {categoryList && categoryList.map(c =>
                        <FilterItem
                            key={c.id}
                            name="category"
                            label={c.name}
                            value={c.id}
                            filterValues={currentFilterCategory}
                            setMultiFilterValue={setCurrentFilterCategory}
                            ishiddenCheckBox={ishiddenCheckBox}
                            setFilterLabels={setFilterLabels}
                            filterLabels={filterLabels}
                        />
                    )}
                </div>
                <div className={style.searchFilter__block}>
                    <p className={style.searchFilter__title}>{t("indexing")}</p>
                    {baseList && baseList.map(b =>
                        <FilterItem
                            key={b.id}
                            name="base"
                            label={b.name}
                            value={b.id}
                            filterValues={currentFilterBase}
                            setMultiFilterValue={setCurrentFilterBase}
                            ishiddenCheckBox={ishiddenCheckBox}
                            setFilterLabels={setFilterLabels}
                            filterLabels={filterLabels}
                        />
                    )}
                </div>
                <div className={style.searchFilter__bottom}></div>
            </form>
        </div>
    )
}