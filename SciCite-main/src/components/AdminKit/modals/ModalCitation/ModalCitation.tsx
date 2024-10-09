import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, removeModals } from "shared/Functions"
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalCitation.module.scss'
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { useDispatch, useSelector } from "react-redux"
import { getIsFetching, getOffersStatus } from "store/offers/offersSelector"
import { AppDispatch } from "store/store"
import { TOffer } from "types/offers.types"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"
import { resetCardOffers } from "store/admin/adminSlice"

type TProps = {
    isCitation?: boolean
    showDetail?: (toggle: boolean) => void
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    offers: TOffer[]
    cardNumber: number
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export const ModalCitation: FC<TProps> = (
    {
        isCitation,
        view,
        setView,
        showDetail,
        offers,
        cardNumber,
        onScroll
    }
) => {

    const [addClass, setAddClass] = useState(true)

    const ShowDetail = () => {
        removeModals(setAddClass, setView, view, isCitation ? 'citation' : 'responses')
        if (showDetail) {
            showDetail(true)
        }
    }

    const RowsCitation = offers.map(offer =>
        <div className={style.row} key={offer.id}>
            <span className={style.userCell}>
                <SvgIcon name={offer.perfomer.level.name} />
                <span>{offer.perfomer.login}</span>
            </span>
            <span className={style.cell}>
                {
                    (new Date(offer.created_at).getDate() < 10 ?
                        `0${new Date(offer.created_at).getDate()}` :
                        `${new Date(offer.created_at).getDate()}`) + '.' +
                    (new Date(offer.created_at).getMonth() + 1 < 10 ?
                        `0${new Date(offer.created_at).getMonth() + 1}` :
                        `${new Date(offer.created_at).getMonth() + 1}`) + '.' +
                    new Date(offer.created_at).getFullYear()
                }
            </span>
            <span className={style.cell}>
                {
                    isCitation && offer.status_executor.name.toLowerCase() !== 'отказ' ? 'подтверждено' :
                    isCitation && offer.status_executor.name.toLowerCase() === 'отказ' ? 'отклонено' :
                        (offer.barter && offer.status_executor.name.toLowerCase() === 'публикация' &&
                            'публикация/бартер') ||
                        (offer.barter && offer.status_executor.name.toLowerCase() === 'цитирование' &&
                            'цитирование/бартер') ||
                        (!offer.barter && offer.status_executor.name.toLowerCase() === 'публикация' &&
                            'публикация') ||
                        (!offer.barter && offer.status_executor.name.toLowerCase() === 'цитирование' &&
                            'цитирование')
                }
            </span>
        </div>
    )

    return (
        <ModalWrapper view={view} setView={setView} changeEl={isCitation ? 'citation' : 'responses'}
            addClass={addClass} setAddClass={setAddClass}>
            <div className={style.modal}>
                <div className={style.top}>
                    <p className={style.title}>список процитировавших карточку №{cardNumber}</p>
                </div>
                <div className={style.bottom}>
                    <div className={style.table}>
                        <div className={style.mainRow}>
                            <span className={style.colTitle}>имя пользователя</span>
                            <span className={style.colTitle}>дата {isCitation ? 'цитирования' : 'отклика'}</span>
                            <span className={style.colTitle}>{isCitation ? 'результат цитирования' : 'статус отклика'}</span>
                        </div>
                        <div className={style.list} onScroll={onScroll}>
                            {RowsCitation}
                        </div>
                    </div>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.btnClose)}
                        onClick={ShowDetail}>Закрыть</button>
                </div>
            </div>
        </ModalWrapper>
    )
}