import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, parseDate, removeModals } from "shared/Functions"
import preview from 'assets/img/cardItemPreview.png'
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalResponseInfo.module.scss'
import { ModalDeleteCard } from "../ModalDeleteCard/ModalDeleteCard"
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { TOffer } from "types/offers.types"
import { AppDispatch } from "store/store"
import { useDispatch } from "react-redux"
import { ModalAdminDetail } from "../ModalDetail/ModalAdminDetail"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"
import { Link } from "react-router-dom"

type TProps = {
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    offer: TOffer
}

export const ModalResponseInfo: FC<TProps> = (
    {
        offer,
        view,
        setView
    }
) => {
    const dispatch: AppDispatch = useDispatch()

    const [addClass, setAddClass] = useState(true)
    const [showModals, setShowModals] = useState<TToggleOBj>({
        delete: false,
        detail: false
    })

    const parseOfferDate = parseDate(new Date(offer.created_at), true)

    return (
        <ModalWrapper
            view={view}
            setView={setView}
            changeEl={'responsesInfo'}
            addClass={addClass}
            setAddClass={setAddClass}
        >
            <div className={style.modal}>
                <div className={style.top}>
                    <div className={style.labelsBlock}>
                        <p className={style.number}>отклик №{offer.offer_number}</p>
                        <p className={style.number}>создан {parseOfferDate}</p>
                        <p className={style.number}>карточка №{offer.card.cart_number}</p>
                    </div>
                    <p className={style.title}>
                        {offer.card.theme}
                    </p>
                </div>
                <div className={style.middle}>
                    <div
                        className={style.imgWrapper}
                        style={offer.status_executor?.name === 'цитирование' &&
                            !offer.status_customer?.name ? { zIndex: 'unset' } : {}}
                    >
                        <img src={preview} alt={'preview'} />
                        <div className={style.previewInfo}>
                            <Link
                                to={offer.evidence?.article.file}
                                className={cn('a', style.downloadBtn)}
                                style={!offer.evidence?.article.file ? { pointerEvents: 'none' } : {}}
                            >
                                <SvgIcon name={'download'} />
                            </Link>
                            <span className={style.status}>
                                {
                                    offer.status_executor?.name === 'цитирование' &&
                                        offer.status_customer?.name !== 'ожидание' ?
                                        'ожидание' : 'принят'
                                }
                            </span>
                        </div>
                        <span className={style.type}>цитирование</span>
                    </div>
                    <div className={style.imgWrapper} style={{
                        zIndex: offer.status_customer?.name !== 'принят'
                            && offer.status_customer?.name !== 'отказ' ? 'unset' : ''
                    }}>
                        <img src={preview} alt={'preview'} />
                        <div className={style.previewInfo}>
                            <Link
                                to={offer.evidence?.article.file_publication}
                                className={cn('a', style.downloadBtn)}
                                style={!offer.evidence?.article.file_publication ? { pointerEvents: 'none' } : {}}
                            >
                                <SvgIcon name={'download'} />
                            </Link>
                            <span className={style.status}>
                                {
                                    (offer.status_customer?.name === 'принят' && 'принят') ||
                                    (offer.status_customer?.name === 'отказ' && 'отказ') ||
                                    'ожидание'
                                }
                            </span>
                        </div>
                        <span className={style.type}>публикация</span>
                    </div>
                </div>
                <div className={style.bottom}>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                        onClick={() => setShowModals(old => ({ ...old, detail: true }))}>карточка</button>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                        onClick={() => setShowModals(old => ({ ...old, delete: true }))}>удалить</button>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                        onClick={() => removeModals(setAddClass, setView, view, 'responsesInfo')}>закрыть</button>
                </div>
            </div>
            {
                showModals.delete &&
                <ModalDeleteCard
                    view={showModals}
                    setView={setShowModals}
                    isDelete={() => removeModals(setAddClass, setView, view, 'responsesInfo')}
                    itemId={offer.card.id}
                />
            }
            {
                showModals.detail &&
                <ModalAdminDetail
                    view={showModals}
                    setView={setShowModals}
                    card={offer.card}
                />
            }
        </ModalWrapper>
    )
}