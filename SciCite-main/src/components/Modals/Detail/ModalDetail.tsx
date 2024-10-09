import cn from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalDetail.module.scss";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { ModalAddCardInResponses } from "../AddCardInResponses/ModalAddCardInResponses";
import { ModalChoiceBarter } from "../ChoiceBarter/ModalChoiceBarter";
import { TCard } from "types/cards.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store/store";
import { getErrors, getOffersStatus } from "store/offers/offersSelector";
import {
  accessExchangeOffer,
  createOffer,
  setErrors,
} from "store/offers/offersSlice";
import { getUserId } from "store/user/userSelector";
import { TStatistic } from "types/user.types";
import { userAPI } from "api/user.api";
import { Image } from "shared/ui/Image/Image";
import { ModalMessage } from "../Message/ModalMessage";
import { offersAPI } from "api/offers.api";
import { useTranslation } from "react-i18next";

type TProps = {
  offerId?: string;
  barterId?: string;
  barter?: boolean;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  card: TCard;
};

export const ModalDetail: FC<TProps> = ({
  offerId,
  barterId,
  barter,
  view,
  setView,
  card,
}) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const perfomerId = useSelector(getUserId);
  const statusArr = useSelector(getOffersStatus);
  const err = useSelector(getErrors);

  const [addClass, setAddClass] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isResponsed, setIsResponsed] = useState(false);
  const [showModals, setShowModals] = useState<TToggleOBj>({
    addCard: false,
    barter: false,
    message: false,
  });
  const [barterStatistic, setBarterStatistic] = useState<TStatistic>();
  const [isCopy, setIsCopy] = useState<boolean>(false);

  const offerStatusId = useMemo(() => {
    let statusId = "";
    for (let i = 0; i < statusArr.length; i++) {
      if (statusArr[i].name === t("offers_status.citation")) {
        statusId = statusArr[i].id;
      }
    }

    return statusId;
  }, [statusArr]);

  useEffect(() => {
    const getBarterStatistic = async () => {
      if (barter) {
        const data = await userAPI.getUserStatistic(card.user.id);
        setBarterStatistic(data.data);
      }
    };
    const checkResponsedCard = async () => {
      if (!barter) {
        const data = await offersAPI.getOffers({
          page: 1,
          card_id: card.id,
          status_executor__id: "",
          status_customer__id: "",
          perfomer_id: perfomerId,
          search: "",
          is_evidence: null,
        });
        if (
          data.results.filter(
            (offer) =>
              !offer.barter_is &&
              offer.status_executor.name.toLowerCase() !== t("offers_status.accepted")
          ).length
        ) {
          setIsResponsed(true);
        }
      }
    };

    getBarterStatistic();
    checkResponsedCard();
  }, [barter, card.user.id]);

  const formationOffer = async (barter: boolean | undefined) => {
    if (err !== null) {
      dispatch(setErrors(null));
    }
    if (barter) {
      await dispatch(
        createOffer({
          card: card.id,
          perfomer: perfomerId,
          status_executor: offerStatusId,
          barter_is: false,
          barter: barterId,
        })
      );
    } else {
      await dispatch(
        createOffer({
          card: card.id,
          perfomer: perfomerId,
          status_executor: offerStatusId,
          barter_is: false,
        })
      );
    }
    setIsSubmit(true);
  };

  const citationCard = () => {
    formationOffer(barter);
  };

  const accessBarter = () => {
    formationOffer(barter);
    if (offerId) {
      dispatch(accessExchangeOffer(offerId, { barter_is: false }));
    }
  };

  useEffect(() => {
    const afterSubmit = () => {
      if (err === null && isSubmit) {
        setShowModals((old) => ({ ...old, addCard: true }));
      } else if (err !== null && isSubmit) {
        setShowModals((old) => ({ ...old, message: true }));
      }
    };

    afterSubmit();
    setIsSubmit(false);
  }, [err, isSubmit]);

  const copyCitationLink = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.currentTarget.textContent) {
      navigator.clipboard.writeText(e.currentTarget.textContent);
      setIsCopy(true);
    }
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={barter ? "barter" : "detail"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div
        className={style.detailModal}
        style={
          showModals.addCard || showModals.barter
            ? { visibility: "hidden" }
            : {}
        }
      >
        <div className={style.detailModal__top}>
          <p className={style.detailModal__number}>
            {t("card")} № {card.cart_number}
          </p>
          <p className={style.detailModal__title}>{card.theme}</p>
        </div>
        <div className={style.detailModal__info}>
          <div className={style.detailModal__infoLeft}>
            <div className={style.detailModal__preview}>
              <Image name={"cardItemPreview"} />
              <div className={style.detailModal__iconsBlock}>
                {card.article.file ? (
                  <Link
                    to={card.article.file}
                    target="_blank"
                    className={cn("a")}
                  >
                    <SvgIcon name={"download"} />
                  </Link>
                ) : (
                  ""
                )}
                <button className={cn("btn-reset")}>
                  <SvgIcon name={card.user.level.name} />
                </button>
              </div>
            </div>
            <ul className={cn("list-reset", style.detailModal__tagList)}>
              {card.article.keywords.map((k, index) =>
                index < 5 ? (
                  <li key={k.id} className={style.detailModal__tagItem}>
                    {k.name}
                  </li>
                ) : (
                  ""
                )
              )}
            </ul>
          </div>
          <div className={style.detailModal__infoMiddle}>
            <ul className={cn("list-reset", style.detailModal__infoList)}>
              <li className={style.detailModal__infoItem_top}>
                {card.article.authors.map((a) => a.name).join(", ")}
              </li>
              <li className={style.detailModal__infoItem}>{card.user.email}</li>
              <li className={style.detailModal__infoItem}>{card.base.name}</li>
              <li className={style.detailModal__infoItem}>
                {card.article.doi}
              </li>
              {barter ? (
                <>
                  <li className={style.detailModal__infoItem}>
                    {barterStatistic?.card_create} {t("card_create")}
                  </li>
                  <li className={style.detailModal__infoItem}>
                    {barterStatistic?.citations_received}{" "}
                    {t("citations_received")}
                  </li>
                  <li className={style.detailModal__infoItem}>
                    {barterStatistic?.citations_formatted}{" "}
                    {t("citations_formated")}
                  </li>
                </>
              ) : (
                ""
              )}
            </ul>
            {barter ? (
              ""
            ) : (
              <>
                <p className={style.detailModal__fieldScienceTitle}>
                  {t("field_of_science")}
                </p>
                <ul className={cn("list-reset", style.detailModal__infoList)}>
                  {card.category.map((c) => (
                    <li key={c.id} className={style.detailModal__infoItem}>
                      <SvgIcon name={c.name} />
                      {c.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div>
              <div
                className={cn(
                  "input-reset",
                  style.detailModal__citationLink,
                  barter && style.detailModal__citationLinkBig
                )}
                onClick={(e) => copyCitationLink(e)}
              >
                {typeof card.article.citation_url === "string"
                  ? card.article.citation_url
                  : ""}
              </div>
              {isCopy ? (
                <span className={style.isCopyLabel}>
                  {t("citation_link_copied")}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={style.detailModal__infoRight}>
            <label
              htmlFor={"abstractText"}
              className={style.detailModal__label}
            >
              {t("annotation_text")}
            </label>
            <textarea
              name={"abstractText"}
              readOnly
              value={card.article.abstract ? card.article.abstract : ""}
              className={cn("input-reset", style.detailModal__text)}
            />
          </div>
        </div>
        <div className={style.detailModal__bottom}>
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.detailModal__btn
            )}
            style={
              perfomerId === card.user.id || isResponsed
                ? {
                    backgroundColor: "#d9d9d9",
                    borderColor: "#d9d9d9",
                    pointerEvents: "none",
                    userSelect: "none",
                  }
                : {}
            }
            onClick={barter ? accessBarter : citationCard}
          >
            {barter ? t("barter") : t("respond")}
          </button>
          {card.is_exchangable && !barter && (
            <button
              className={cn(
                "btn-reset",
                styleBtns.btnAstral,
                style.detailModal__btn
              )}
              style={
                perfomerId === card.user.id
                  ? {
                      backgroundColor: "#d9d9d9",
                      borderColor: "#d9d9d9",
                      pointerEvents: "none",
                      userSelect: "none",
                    }
                  : {}
              }
              onClick={() => setShowModals((old) => ({ ...old, barter: true }))}
            >
              {t("barter")}
            </button>
          )}
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.detailModal__btn
            )}
            onClick={() =>
              removeModals(
                setAddClass,
                setView,
                view,
                barter ? "barter" : "detail"
              )
            }
          >
            {t("cancel")}
          </button>
        </div>
      </div>
      {showModals.addCard && (
        <ModalAddCardInResponses
          setClass={setAddClass}
          view={view}
          setView={setView}
          barter={barter}
        />
      )}
      {showModals.message && (
        <ModalMessage
          view={showModals}
          setView={setShowModals}
          textContent={
            err?.message && typeof err?.message === "string" ? err.message : ""
          }
        />
      )}
      {showModals.barter && (
        <ModalChoiceBarter
          message={showModals}
          setMessage={setShowModals}
          setClass={setAddClass}
          view={view}
          setView={setView}
          searchCard={card}
          statusId={offerStatusId}
        />
      )}
    </ModalWrapper>
  );
};
