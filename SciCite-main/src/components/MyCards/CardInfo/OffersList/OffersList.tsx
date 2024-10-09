import { FC, useEffect, useMemo } from "react";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./OffersList.module.scss";
import cn from "classnames";
import { OfferItem } from "entities/OfferInfo/OfferItem";
import useWindow from "shared/CustomHooks";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsFetching,
  getOffers,
  getOffersCurrentPage,
  getOffersNextPage,
  getOffersStatus,
} from "store/offers/offersSelector";
import { AppDispatch } from "store/store";
import { requestOffers, resetOffers } from "store/offers/offersSlice";
import { requestSupport } from "store/support/supportSlice";
import { getSupportTypes, getSupports } from "store/support/supportSelector";
import { TCard } from "types/cards.types";
import { useTranslation } from "react-i18next";

type TProps = {
  currentCard: TCard | undefined;
  toggleStatus: string;
  setToggleStatus: (status: string) => void;
};

export const OffersList: FC<TProps> = ({
  currentCard,
  toggleStatus,
  setToggleStatus,
}) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const isMobile = useWindow();
  const offers = useSelector(getOffers);
  const nextPage = useSelector(getOffersNextPage);
  const currentPage = useSelector(getOffersCurrentPage);
  const statusArr = useSelector(getOffersStatus);
  const supportArr = useSelector(getSupports);
  const isFetching = useSelector(getIsFetching);
  const supportTypes = useSelector(getSupportTypes);

  const offerStatusId = useMemo(() => {
    let statusId = "";
    for (let i = 0; i < statusArr.length; i++) {
      if (statusArr[i].name === toggleStatus) {
        statusId = statusArr[i].id;
      }
    }

    return statusId;
  }, [statusArr, toggleStatus]);

  const supportTypesId = useMemo(() => {
    let types = [];
    if (supportTypes) {
      for (let i = 0; i < supportTypes.length; i++) {
        if (supportTypes[i].name === "спор") {
          types.push(supportTypes[i].id);
        }
      }
    }

    return types;
  }, [supportTypes]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const containerHeight = e.currentTarget.clientHeight;
    const scrollHeight = e.currentTarget.scrollHeight;

    const scrollTop = e.currentTarget.scrollTop;
    if (
      scrollHeight - (scrollTop + containerHeight) < 100 &&
      nextPage &&
      !isFetching
    ) {
      dispatch(
        requestOffers({
          card_id: currentCard ? currentCard.id : "",
          is_evidence: true,
          page: currentPage + 1,
          perfomer_id: "",
          search: "",
          status_executor__id: "",
          status_customer__id: offerStatusId,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(resetOffers());
    dispatch(
      requestOffers({
        card_id: currentCard ? currentCard.id : "",
        is_evidence: true,
        page: 1,
        perfomer_id: "",
        search: "",
        status_executor__id: "",
        status_customer__id: offerStatusId,
      })
    );
  }, [currentCard, dispatch, offerStatusId]);

  useEffect(() => {
    dispatch(
      requestSupport({
        type_support__id: supportTypesId,
      })
    );
  }, [dispatch, supportTypesId]);

  const Offers = offers.map((offer) => (
    <OfferItem
      key={offer.id}
      offer={offer}
      toggleStatus={toggleStatus}
      disabled={
        supportArr.filter(
          (support) =>
            support.offer?.id === offer.id &&
            (support.type_support.name.toLowerCase() === "спор" ||
              support.type_support.name.toLowerCase() === "отказ")
        ).length
          ? true
          : false
      }
    />
  ));

  return (
    <>
      {isMobile ? (
        <div className={style.cardsList__toggleBlock}>
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.cardsList__btnToggle,
              toggleStatus === t("offers_status.citation")
                ? styleBtns.btnAstral_active
                : ""
            )}
            onClick={() => setToggleStatus(t("offers_status.citation"))}
          >
            {t("offers_status.citation")}
          </button>
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.cardsList__btnToggle,
              toggleStatus === t("offers_status.expectation")
                ? styleBtns.btnAstral_active
                : ""
            )}
            onClick={() => setToggleStatus(t("offers_status.expectation"))}
          >
            {t("offers_status.expectation")}
          </button>
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.cardsList__btnToggle,
              toggleStatus === t("offers_status.publication")
                ? styleBtns.btnAstral_active
                : ""
            )}
            onClick={() => setToggleStatus(t("offers_status.publication"))}
          >
            {t("offers_status.publication")}
          </button>
        </div>
      ) : (
        <div className={style.cardsList__toggleBlock}>
          <button
            className={cn(
              "btn-reset",
              style.cardsList__btnToggle,
              toggleStatus === t("offers_status.citation")
                ? style.cardsList__btnToggle_done
                : ""
            )}
            style={
              toggleStatus === t("offers_status.citation") ? { fontWeight: 700 } : {}
            }
            onClick={() => setToggleStatus(t("offers_status.citation"))}
          >
            {t("offers_status.citation")}
            <span></span>
          </button>
          <button
            className={cn(
              "btn-reset",
              style.cardsList__btnToggle,
              toggleStatus === t("offers_status.expectation")
                ? style.cardsList__btnToggle_done
                : ""
            )}
            style={
              toggleStatus === t("offers_status.expectation")
                ? { fontWeight: 700 }
                : {}
            }
            onClick={() => setToggleStatus(t("offers_status.expectation"))}
          >
            {t("offers_status.expectation")}
            <span></span>
          </button>
          <button
            className={cn(
              "btn-reset",
              style.cardsList__btnToggle,
              toggleStatus === t("status.publication")
                ? style.cardsList__btnToggle_done
                : ""
            )}
            style={
              toggleStatus === t("offers_status.publication")
                ? { fontWeight: 700 }
                : {}
            }
            onClick={() => setToggleStatus(t("offers_status.publication"))}
          >
            {t("offers_status.publication")}
            <span></span>
          </button>
          <hr />
        </div>
      )}
      <div className={style.cardsList} onScroll={scrollHandler}>
        {Offers}
      </div>
    </>
  );
};
