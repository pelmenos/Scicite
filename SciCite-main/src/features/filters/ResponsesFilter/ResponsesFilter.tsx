import { FC, useState } from "react"
import style from './ResponsesFilter.module.scss'
import cn from "classnames"
import { TToggleOBj, removeModals } from "shared/Functions"
import { FilterItem } from "entities/FilterItem/FilterItem"
import { useSelector } from "react-redux"
import { getOffersStatus } from "store/offers/offersSelector"
import { useTranslation } from "react-i18next"


type TProps = {
    isMobile?: boolean
    view: TToggleOBj,
    setView: (toggle: TToggleOBj) => void
    currentFilter: string
    setCurrentFilter: (currentFilter: string) => void
}

export const ResponsesFilter: FC<TProps> = ({ view, isMobile, setView, currentFilter, setCurrentFilter }) => {
    const { t } = useTranslation()
    const statusArr = useSelector(getOffersStatus)
    const filteredStatusArr = statusArr.filter(status => status.name !== 'ожидание')
    const [addClass, setAddClass] = useState(true)

    return (
        <div className={cn(style.substrate, isMobile || addClass ? style.view : style.hidden)}>
            {
                isMobile ?
                    <div className={style.overlay} onClick={() => removeModals(setAddClass, setView, view, 'filter')} /> :
                    ''
            }
            <div className={cn(style.responsesFilter, isMobile && addClass ? style.viewModal : style.hiddenModal)}
                style={{ display: view.filter ? 'flex' : 'none' }}>
                <div className={style.searchFilter__block}>
                    <p className={style.responsesFilter__title}>{t("areas")}</p>
                    {filteredStatusArr.map(s =>
                        <FilterItem
                            key={s.id}
                            name="status"
                            label={s.name}
                            value={s.id}
                            filterValues={currentFilter}
                            setOnceFilterValue={setCurrentFilter}
                            ishiddenCheckBox={true}
                        />
                    )}
                </div>
                <div className={style.responsesFilter__bottom}></div>
            </div>
        </div>
    )
}