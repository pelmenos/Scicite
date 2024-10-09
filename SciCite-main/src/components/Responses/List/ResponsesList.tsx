import cn from "classnames";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import useWindow from "shared/CustomHooks";
import styleBtns from 'assets/scss/btns.module.scss';
import style from './ResponsesList.module.scss';
import { ModalUpCitation } from "../../Modals/UpCitation/ModalUpCitation";
import { ResponsesFilter } from "features/filters/ResponsesFilter/ResponsesFilter";
import { ResponsesItem } from "entities/cards/ResponsesItem/ResponsesItem";
import { TToggleOBj } from "shared/Functions";
import { TOffer } from "types/offers.types";
import { requestOffers, resetOffers } from "store/offers/offersSlice";
import { AppDispatch } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import { getOffersStatus } from "store/offers/offersSelector";
import { getUserId } from "store/user/userSelector";
import { ModalPublition } from "components/Modals/Publition/ModalPublition";
import { requestSupport } from "store/support/supportSlice";
import { getSupportTypes, getSupports } from "store/support/supportSelector";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { getSettings } from "store/admin/adminSelector";
import { useTranslation } from "react-i18next";

type TProps = {
    offers: TOffer[]
    toggleCP: {
        citation: boolean,
        publition: boolean
    }
    setToggleCP: ({ citation, publition }: { citation: boolean, publition: boolean }) => void
    currentFilter: string
    setCurrentFilter: (currentFilter: string) => void
}

export const ResponsesList: FC<TProps> = ({
    offers,
    toggleCP,
    setToggleCP,
    currentFilter,
    setCurrentFilter
}) => {
    const { t } = useTranslation()
    const dispatch: AppDispatch = useDispatch()
    const supportArr = useSelector(getSupports)
    const supportTypes = useSelector(getSupportTypes)
    const statusArr = useSelector(getOffersStatus)
    const userId = useSelector(getUserId)
    const { price_citation } = { ...useSelector(getSettings) }
    
    
    const isMobile = useWindow()
    const [showModals, setShowModals] = useState<TToggleOBj>({
        multi: false,
        filter: false
    })
    const [selected, setSelected] = useState<string[]>([])

    const getOfferStatusId = (status: string) => {
        let statusId = ''
        for (let i = 0; i < statusArr.length; i++) {
            if (statusArr[i].name === status) {
                statusId = statusArr[i].id
            }
        }

        return statusId
    }

    useEffect(() => {
        const checkProcesseSupport = () => {
            let types = []
            if (supportTypes) {
                for (let i = 0; i < supportTypes.length; i++) {
                    if (supportTypes[i].name.toLowerCase() === 'отказ' ||
                        supportTypes[i].name.toLowerCase() === 'спор') {
                        types.push(supportTypes[i].id)
                    }
                }
            }
            dispatch(requestSupport({
                type_support__id: types
            }))
        }

        checkProcesseSupport()
    }, [dispatch, supportTypes])

    const multiOffer = (action: string) => {
        const statusId = getOfferStatusId(action === t("citation") ? t("citation") : t("publication"))
        dispatch(resetOffers())
        dispatch(requestOffers({
            page: 1,
            card_id: '',
            perfomer_id: userId,
            search: '',
            status_executor__id: statusId,
            status_customer__id: '',
            is_evidence: null
        }))
        setToggleCP(action === t("citation") ? { ...toggleCP, citation: true } : { ...toggleCP, publition: true })
    }

    const citation = () => {
        multiOffer(t("citation"))
    }

    const publication = () => {
        multiOffer(t("publication"))
    }

    const resetFilter = () => {
        setSelected([])
        dispatch(resetOffers())
        dispatch(requestOffers({
            page: 1,
            card_id: '',
            perfomer_id: userId,
            search: '',
            status_executor__id: '',
            status_customer__id: '',
            is_evidence: null
        }))
        setToggleCP({ citation: false, publition: false })
    }

    const ResponsesItems = offers.map(offer =>
        (toggleCP.citation || toggleCP.publition) &&
            !supportArr.filter(support => support.offer?.id === offer.id).length &&
            !(offer.status_customer?.name === t("citation") || offer.status_customer?.name === t("publication")) ?
            <ResponsesItem
                key={offer.id}
                offer={offer}
                perfomerId={userId}
                multi={toggleCP.citation || toggleCP.publition ? true : false}
                selected={selected}
                setSelected={setSelected}
                disabled={supportArr.filter(support =>
                    support.offer?.id === offer.id &&
                    (support.type_support.name.toLowerCase() === 'спор' ||
                        support.type_support.name.toLowerCase() === 'отказ')
                ).length ? true : false}
                inProgress={offer.status_customer?.name === t("citation") ||
                    offer.status_customer?.name === t("publication")}
                resetFilter={resetFilter}
                cardPrice={price_citation}
            /> :
            !(toggleCP.citation || toggleCP.publition) &&
            <ResponsesItem
                key={offer.id}
                offer={offer}
                perfomerId={userId}
                multi={toggleCP.citation || toggleCP.publition ? true : false}
                selected={selected}
                setSelected={setSelected}
                disabled={supportArr.filter(support =>
                    support.offer?.id === offer.id &&
                    (support.type_support.name.toLowerCase() === 'спор' ||
                        support.type_support.name.toLowerCase() === 'отказ')
                ).length ? true : false}
                inProgress={offer.status_customer?.name === t("citation") ||
                    offer.status_customer?.name === t("publication")}
                resetFilter={resetFilter}
                cardPrice={price_citation}
            />
    )

    return (
        <div className={cn('container', style.responsesList__container)}>
            <div className={style.responsesList__top}>
                {
                    !isMobile ?
                        (toggleCP.citation ?
                            <p className={style.responsesList__workWithCardsText}>
                                {t("choose_cards_for_multi", {name: t("multi_citation.1")})}
                            </p> :
                            toggleCP.publition ?
                                <p className={style.responsesList__workWithCardsText}>
                                     {t("choose_cards_for_multi", {name: t("multi_publication.1")})}
                                </p> :
                                <div
                                    className={style.responsesList__filterWrapper}
                                    onMouseOver={() => setShowModals(old => ({ ...old, filter: true }))}
                                    onMouseOut={() => setShowModals(old => ({ ...old, filter: false }))}
                                >
                                    <button className={cn('btn-reset', style.responsesList__btnFilter)}
                                    >
                                        <span>{t("filters")}</span>
                                        <SvgIcon name="arrowRight" />
                                    </button>
                                    <ResponsesFilter
                                        view={showModals}
                                        setView={setShowModals}
                                        currentFilter={currentFilter}
                                        setCurrentFilter={setCurrentFilter}
                                    />
                                </div>) : showModals.filter && createPortal(
                                    <ResponsesFilter
                                        setView={setShowModals}
                                        view={showModals}
                                        isMobile={isMobile}
                                        currentFilter={currentFilter}
                                        setCurrentFilter={setCurrentFilter}
                                    />,
                                    document.body)
                }
                <div className={style.responsesList__workWithCards}
                    style={isMobile && (toggleCP.citation || toggleCP.publition) ? { width: '100%' } : {}}>
                    <div
                        className={style.responsesList__workWithCardsBlock}
                        style={
                            toggleCP.publition ?
                                { display: 'none' } :
                                isMobile && toggleCP.citation ?
                                    { width: '100%' } : {}
                        }
                    >
                        {
                            toggleCP.citation ?
                                <div className={style.responsesList__workWithCards}>
                                    <button className={cn('btn-reset', styleBtns.btnAstral,
                                        style.responsesList__btnAction)}
                                        onClick={() => setShowModals(old => ({ ...old, multi: true }))}
                                    >{t("create")}</button>
                                    <button className={cn('btn-reset', styleBtns.btnAstral,
                                        style.responsesList__btnAction)}
                                        onClick={resetFilter}
                                    >{t("cancel")}</button>
                                </div> : ''
                        }
                        <button className={cn('btn-reset', styleBtns.btnAstral,
                            style.responsesList__btnAction,
                            toggleCP.citation ? styleBtns.btnAstral_active : '')}
                            onClick={citation}
                        >{t("offers_status.citation")} +</button>
                    </div>
                    <div
                        className={style.responsesList__workWithCardsBlock}
                        style={
                            toggleCP.citation ?
                                { display: 'none' } :
                                isMobile && toggleCP.publition ?
                                    { width: '100%' } : {}
                        }
                    >
                        {
                            toggleCP.publition ?
                                <div className={style.responsesList__workWithCards}>
                                    <button className={cn('btn-reset', styleBtns.btnAstral,
                                        style.responsesList__btnAction)}
                                        onClick={() => setShowModals(old => ({ ...old, multi: true }))}
                                    >{t("create")}</button>
                                    <button className={cn('btn-reset', styleBtns.btnAstral,
                                        style.responsesList__btnAction)}
                                        onClick={resetFilter}
                                    >{t("cancel")}</button>
                                </div> : ''
                        }
                        <button className={cn('btn-reset', styleBtns.btnAstral,
                            style.responsesList__btnAction,
                            toggleCP.publition ? styleBtns.btnAstral_active : '')}
                            onClick={publication}
                        >{t("offers_status.publication")} +</button>
                    </div>
                </div>
                {
                    isMobile ?
                        <div className={style.responsesList__mobileFilters}>
                            <button
                                className={cn('btn-reset', styleBtns.btnAstral, style.responsesList__btnFilterMob)}
                                onClick={() => setShowModals(old => ({ ...old, filter: true }))}
                            >{t("filters")}</button>
                        </div> : ''
                }
            </div>
            <div className={style.cardsList}>
                {ResponsesItems}
            </div>
            {
                toggleCP.citation && selected.length && showModals.multi ?
                    <ModalUpCitation
                        view={showModals}
                        setView={setShowModals}
                        offers={offers.filter(offer => selected.includes(offer.id) && offer)}
                        resetFilter={resetFilter}
                        multi={t("multi_citation")}
                    /> :
                    toggleCP.publition && selected.length && showModals.multi ?
                        <ModalPublition
                            view={showModals}
                            setView={setShowModals}
                            offers={offers.filter(offer => selected.includes(offer.id) && offer)}
                            resetFilter={resetFilter}
                            multi={t("multi_publication")}
                        /> : ''
            }
        </div>
    )
}