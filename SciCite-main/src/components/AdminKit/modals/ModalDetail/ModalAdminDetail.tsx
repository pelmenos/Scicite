import cn from "classnames"
import { FC, useEffect, useState } from "react"
import { TToggleOBj, removeModals } from "shared/Functions"
import previewImg from 'assets/img/cardItemPreview.png'
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalAdminDetail.module.scss'
import { ModalCitation } from "../ModalCitation/ModalCitation"
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { TCard } from "types/cards.types"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"
import { Link } from "react-router-dom"
import { AppDispatch } from "store/store"
import { useDispatch, useSelector } from "react-redux"
import { getIsFetching } from "store/offers/offersSelector"
import { TOffer } from "types/offers.types"
import { requestCardOffers, resetCardOffers } from "store/admin/adminSlice"
import { getCardOffers, getCardOffersCurrentPage, getCardOffersNextPage } from "store/admin/adminSelector"

type TProps = {
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    card: TCard
}

export const ModalAdminDetail: FC<TProps> = ({ view, setView, card }) => {
    const dispatch: AppDispatch = useDispatch()
    const offers = useSelector(getCardOffers)
    const currentPage = useSelector(getCardOffersCurrentPage)
    const nextPage = useSelector(getCardOffersNextPage)
    const isFetching = useSelector(getIsFetching)

    const [addClass, setAddClass] = useState(true)
    const [showModals, setShowModals] = useState<TToggleOBj>({
        citation: false,
        responses: false
    })
    const [citationOffers, setCitationOffers] = useState<TOffer[]>([])
    const [responsesOffers, setResponsesOffers] = useState<TOffer[]>([])

    useEffect(() => {
        if (offers.length > 0) {

            const citationOffers = []
            const responsesOffers = []

            for (let i = 0; i < offers.length; i++) {
                if (
                    (offers[i].status_customer?.name.toLowerCase() === 'отказ' &&
                        offers[i].status_executor?.name.toLowerCase() === 'отказ') ||
                    (offers[i].status_customer?.name.toLowerCase() !== 'отказ' &&
                        offers[i].status_customer?.name.toLowerCase() !== 'цитирование' &&
                        offers[i].status_customer?.name.toLowerCase() !== 'спор')
                ) {
                    citationOffers.push(offers[i])
                }
                if (offers[i].status_executor?.name.toLowerCase() === 'цитирование' ||
                    offers[i].status_executor?.name.toLowerCase() === 'публикация') {
                    responsesOffers.push(offers[i])
                }
            }
            setCitationOffers([...citationOffers])
            setResponsesOffers([...responsesOffers])
        }
    }, [offers])

    const cardCreated = new Date(card.created_at)
    const parseDate = (cardCreated.getDate() < 10 ?
        `0${cardCreated.getDate()}` : `${cardCreated.getDate()}`) + '.' +
        (cardCreated.getMonth() + 1 < 10 ? `0${cardCreated.getMonth() + 1}` :
            `${cardCreated.getMonth() + 1}`) + '.' + (`${cardCreated.getFullYear()}`).substring(2)


    useEffect(() => {
        dispatch(resetCardOffers())
        dispatch(requestCardOffers({
            card_id: card.id,
            is_evidence: null,
            perfomer_id: '',
            search: '',
            status_customer__id: '',
            status_executor__id: '',
            page: 1
        }))
    }, [])

    const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
        const containerHeight = e.currentTarget.clientHeight;
        const scrollHeight = e.currentTarget.scrollHeight;

        const scrollTop = e.currentTarget.scrollTop;
        if (scrollHeight - (scrollTop + containerHeight) < 100 && nextPage && !isFetching) {
            dispatch(requestCardOffers({
                card_id: '',
                is_evidence: true,
                page: currentPage + 1,
                perfomer_id: '',
                search: '',
                status_executor__id: '',
                status_customer__id: '',
            }))
        }
    }

    const ShowCitation = () => {
        setShowModals(old => ({ ...old, citation: true }))
    }

    const ShowResponses = () => {
        setShowModals(old => ({ ...old, responses: true }))
    }

    return (
        <ModalWrapper
            view={view}
            setView={setView}
            changeEl={'detail'}
            addClass={addClass}
            setAddClass={setAddClass}
        >
            <div className={style.detailModal}>
                <div className={style.detailModal__top}>
                    <div className={style.detailModal__labelsBlock}>
                        <p className={style.detailModal__number}>карточка №{card.cart_number}</p>
                        <p className={style.detailModal__number}>создана {parseDate}</p>
                        <p className={style.detailModal__number}>
                            выставлена {card.tariff.scicoins === 0 ? 'бартер' : `${card.tariff.period} мес.`}
                        </p>
                    </div>
                    <p className={style.detailModal__title}>
                        {card.theme}
                    </p>
                </div>
                <div className={style.detailModal__info}>
                    <div className={style.detailModal__infoLeft}>
                        <div className={style.detailModal__preview}>
                            <img src={previewImg} alt={'preview'} />
                            <div
                                className={style.detailModal__iconsBlock}
                                style={!card.article.file ?
                                    { justifyContent: 'right' } :
                                    {}}
                            >
                                {
                                    card.article.file ?
                                        <Link to={card.article.file} download className={'a'}>
                                            <SvgIcon name="download" />
                                        </Link> : ''
                                }
                                <span>
                                    <SvgIcon name={card.user.level.name} />
                                </span>
                            </div>
                        </div>
                        <p className={style.detailModal__fieldScienceTitle}>ключевые слова</p>
                        <ul className={cn('list-reset', style.detailModal__tagList)}>
                            {
                                card.article.keywords.map((keyword, index) =>
                                    index < 3 ?
                                        <li
                                            key={keyword.id}
                                            className={style.detailModal__tagItem}
                                        >{keyword.name}</li> :
                                        ''
                                )
                            }
                        </ul>
                    </div>
                    <div className={style.detailModal__infoMiddle}>
                        <ul className={cn('list-reset', style.detailModal__infoList)}>
                            <li className={style.detailModal__infoItem_top}>{card.user.login}</li>
                            <li className={style.detailModal__infoItem_top}>{card.article.citation_url}</li>
                            <li className={style.detailModal__infoItem_top}>{card.base.name}</li>
                            <li className={style.detailModal__infoItem_top}>{card.article.doi}</li>
                        </ul>
                        <p className={style.detailModal__fieldScienceTitle}>категории</p>
                        <ul className={cn('list-reset', style.detailModal__infoList)}>
                            {
                                card.category.map(c =>
                                    <li key={c.id} className={style.detailModal__infoItem}>
                                        <SvgIcon name={c.name} />
                                        {c.name}
                                    </li>
                                )
                            }

                        </ul>
                    </div>
                </div>
                <div className={style.detailModal__bottom}>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.detailModal__btn)}
                        onClick={ShowCitation}>цитирования</button>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.detailModal__btn)}
                        onClick={ShowResponses}>отклики</button>
                    <button className={cn('btn-reset', styleBtns.btnAstral, style.detailModal__btn)}
                        onClick={() => removeModals(setAddClass, setView, view, 'detail')}>закрыть</button>
                </div>
            </div>
            {
                showModals.citation &&
                <ModalCitation
                    view={showModals}
                    setView={setShowModals}
                    showDetail={setAddClass}
                    isCitation={true}
                    offers={citationOffers}
                    cardNumber={card.cart_number}
                    onScroll={scrollHandler}
                />
            }
            {
                showModals.responses &&
                <ModalCitation
                    view={showModals}
                    setView={setShowModals}
                    showDetail={setAddClass}
                    isCitation={false}
                    offers={responsesOffers}
                    cardNumber={card.cart_number}
                    onScroll={scrollHandler}
                />
            }
        </ModalWrapper>
    )
}