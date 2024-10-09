import cn from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import previewImg from "assets/img/cardItemPreview.png";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./MobileDetaild.module.scss";
import { ModalAddCardInResponses } from "../../AddCardInResponses/ModalAddCardInResponses";
import { ModalChoiceBarter } from "../../ChoiceBarter/ModalChoiceBarter";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { TCard } from "types/cards.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { Link } from "react-router-dom";
import { setErrors } from "store/cards/cardsSlice";
import { accessExchangeOffer, createOffer } from "store/offers/offersSlice";
import { AppDispatch } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "store/user/userSelector";
import { getOffersStatus } from "store/offers/offersSelector";
import { getErrors } from "store/cards/cardsSelector";
import { TStatistic } from "types/user.types";
import { userAPI } from "api/user.api";
import { ModalMessage } from "components/Modals/Message/ModalMessage";
import { useTranslation } from "react-i18next";

type TProps = {
  offerId?: string;
  barterId?: string;
  barter?: boolean;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  card: TCard;
};

export const MobileDetail: FC<TProps> = ({
  barter,
  view,
  setView,
  card,
  barterId,
  offerId,
}) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const perfomerId = useSelector(getUserId);
  const statusArr = useSelector(getOffersStatus);
  const err = useSelector(getErrors);

  const [addClass, setAddClass] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
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

    getBarterStatistic();
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
      smooth
    >
      <div
        className={style.detailMobile}
        style={
          showModals.addCard || showModals.barter
            ? { visibility: "hidden" }
            : {}
        }
      >
        <div className={style.top} />
        <div className={style.info}>
          <div className={style.infoTop}>
            <div className={style.preview}>
              <img src={previewImg} alt={"preview"} />
              <div className={style.iconsBlock}>
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
            <ul className={cn("list-reset", style.infoList)}>
              <li className={style.infoItem}>
                {card.article.authors.map((a) => a.name).join(", ")}
              </li>
              <li className={style.infoItem}>{card.base.name}</li>
              <li className={style.infoItem}>{card.article.doi}</li>
              <div>
                <div
                  className={cn("input-reset", style.infoItemBig)}
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
            </ul>
          </div>
          <div className={style.infoBottom}>
            <label className={style.label}>{t("annotation_text")}</label>
            <textarea
              readOnly
              className={cn("input-reset", style.text)}
              value={card.article.abstract ? card.article.abstract : ""}
            />
            <label className={style.label}>{t("keywords")}</label>
            <textarea
              readOnly
              className={cn("input-reset", style.textKeyWords)}
              value={card.article.keywords.map((word) => word.name).join(", ")}
            />
            <p className={style.fieldScienceTitle}>{t("field_of_science")}</p>
            <ul className={cn("list-reset", style.scienceList)}>
              {card.category.map((c) => (
                <li key={c.id} className={style.scienceItem}>
                  <SvgIcon name={c.name} />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={style.btnsBlock}>
          <button
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
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
            onClick={barter ? accessBarter : citationCard}
          >
            {barter ? t("barter") : t("respond")}
          </button>
          {!barter && (
            <button
              className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
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
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
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
          isAddCard={addClass}
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
