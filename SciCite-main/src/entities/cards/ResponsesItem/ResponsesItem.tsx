import cn from "classnames";
import { FC, memo, useMemo, useState } from "react";
import { TToggleOBj, parseDate } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ResponsesItem.module.scss";
import { ModalUpCitation } from "components/Modals/UpCitation/ModalUpCitation";
import { ModalPublition } from "components/Modals/Publition/ModalPublition";
import { ModalRefuseConfirm } from "components/Modals/RefuseConfirm/ModalRefuseConfirm";
import { ModalRefuse } from "components/Modals/Refuse/ModalRefuse";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { TOffer } from "types/offers.types";
import { Card } from "shared/ui/Card/Card";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import {
  deleteOffer,
  requestOffers,
  resetOffers,
} from "store/offers/offersSlice";
import { useTranslation } from "react-i18next";

type TProps = {
  offer: TOffer;
  multi: boolean;
  perfomerId: string;
  selected: string[];
  setSelected: (selected: string[]) => void;
  disabled?: boolean;
  inProgress: boolean;
  resetFilter: () => void;
  cardPrice: { [k: string]: number } | undefined;
};

export const ResponsesItem: FC<TProps> = memo(
  ({
    offer,
    multi,
    perfomerId,
    selected,
    setSelected,
    disabled,
    inProgress,
    resetFilter,
    cardPrice,
  }) => {
    const { t, i18n } = useTranslation();
    const dispatch: AppDispatch = useDispatch();

    const deadlineDate = parseDate(new Date(offer.deadline_at), false);

    const [showModals, setShowModals] = useState<TToggleOBj>({
      citation: false,
      publition: false,
      refuse: false,
      refuseConfirm: false,
    });

    const deleteOfferHandler = async () => {
      await dispatch(deleteOffer(offer.id));
      dispatch(resetOffers());
      dispatch(
        requestOffers({
          page: 1,
          card_id: "",
          perfomer_id: perfomerId,
          search: "",
          status_executor__id: "",
          status_customer__id: "",
          is_evidence: null,
        })
      );
    };

    return (
      <Card
        cardTitle={offer.card.theme}
        bcgImg={
          i18n.language === "ru"
            ? offer.card.category[0].name
            : t(`cards_bcg.${offer.card.category[0].name}`)
        }
        selectedCards={selected}
        setSelectedCard={setSelected}
        cardId={offer.id}
      >
        <>
          <div className={style.responsesCard__iconsBlock}>
            <SvgIcon
              name={offer.barter ? "exchange" : `${offer.card.user.level.name}`}
            />
            {multi ? (
              <input
                className={cn("input-reset", style.responsesCard__checkBox)}
                type="checkbox"
                name="multiCheckBox"
                readOnly
                checked={selected.includes(offer.id)}
              />
            ) : (
              <span
                className={style.responsesCard__status}
                style={
                  offer.status_executor?.name === t("offers_status.accepted")
                    ? { backgroundColor: "#2f7eb8", color: "#fff" }
                    : offer.status_executor?.name ===
                        t("offers_status.citation") ||
                      offer.status_executor?.name ===
                        t("offers_status.publication")
                    ? { backgroundColor: "#d9d9d9", color: "#000" }
                    : offer.status_executor?.name ===
                      t("offers_status.rejection")
                    ? { backgroundColor: "#000", color: "#fff" }
                    : {}
                }
              >
                {offer.status_executor?.name}
              </span>
            )}
          </div>
        </>
        <>
          <div
            className={style.responsesCard__priceBlock}
            style={{ marginBottom: multi ? 0 : "" }}
          >
            <span className={style.responsesCard__indexTitle}>
              {offer.card.base.name === "web of science"
                ? "wos"
                : offer.card.base.name}
            </span>
            <span className={style.responsesCard__date}>
              {offer.deadline_at ? (
                <>
                  <time dateTime={deadlineDate}>{deadlineDate}</time>
                  <SvgIcon name={"watch"} />
                </>
              ) : (
                ""
              )}
            </span>
            <span className={style.responsesCard__price}>
              {offer.barter ? (
                t("barter")
              ) : (
                <>
                  {((offer.card.base.name.toLowerCase() === t("other") ||
                    offer.card.base.name.toLowerCase() === t("vak")) &&
                    cardPrice &&
                    cardPrice["вак"]) ||
                    ((offer.card.base.name.toLowerCase() === "web of science" ||
                      offer.card.base.name.toLowerCase() === "scopus") &&
                      cardPrice &&
                      cardPrice["scopus/wos"]) ||
                    (cardPrice && cardPrice["ринц"])}
                  <SvgIcon name="coins" />
                </>
              )}
            </span>
          </div>
          {!multi ? (
            <div
              className={style.responsesCard__btnsBlock}
              style={
                offer.status_executor?.name === t("offers_status.accepted")
                  ? { justifyContent: "right" }
                  : {}
              }
            >
              {offer.status_executor?.name === t("offers_status.rejection") ? (
                <>
                  <button
                    type={"button"}
                    className={cn(
                      "btn-reset",
                      styleBtns.btnAstral,
                      style.responsesCard__btnDetail
                    )}
                    style={
                      disabled
                        ? {
                            backgroundColor: "#d9d9d9",
                            borderColor: "#d9d9d9",
                            pointerEvents: "none",
                            userSelect: "none",
                          }
                        : {}
                    }
                    onClick={() =>
                      setShowModals((old) => ({ ...old, refuse: true }))
                    }
                  >
                    {t("support_types.dispute")}
                  </button>
                  <button
                    type={"button"}
                    className={cn(
                      "btn-reset",
                      styleBtns.btnAstral,
                      style.responsesCard__btnDetail
                    )}
                    onClick={deleteOfferHandler}
                  >
                    {t("delete")}
                  </button>
                </>
              ) : offer.status_executor?.name !==
                t("offers_status.accepted") ? (
                <>
                  {offer.status_executor?.name ===
                  t("offers_status.citation") ? (
                    <button
                      type={"button"}
                      className={cn(
                        "btn-reset",
                        styleBtns.btnAstral,
                        style.responsesCard__btnDetail
                      )}
                      style={
                        disabled || inProgress
                          ? {
                              backgroundColor: "#d9d9d9",
                              borderColor: "#d9d9d9",
                              pointerEvents: "none",
                              userSelect: "none",
                            }
                          : {}
                      }
                      onClick={() =>
                        setShowModals((old) => ({ ...old, citation: true }))
                      }
                    >
                      {t("submit")}
                    </button>
                  ) : offer.status_executor?.name ===
                    t("offers_status.publication") ? (
                    <button
                      type={"button"}
                      className={cn(
                        "btn-reset",
                        styleBtns.btnAstral,
                        style.responsesCard__btnDetail
                      )}
                      style={
                        disabled || inProgress
                          ? {
                              backgroundColor: "#d9d9d9",
                              borderColor: "#d9d9d9",
                              pointerEvents: "none",
                              userSelect: "none",
                            }
                          : {}
                      }
                      onClick={() =>
                        setShowModals((old) => ({ ...old, publition: true }))
                      }
                    >
                      {t("create")}
                    </button>
                  ) : (
                    ""
                  )}
                  <button
                    type={"button"}
                    className={cn(
                      "btn-reset",
                      styleBtns.btnAstral,
                      style.responsesCard__btnDetail
                    )}
                    style={
                      disabled
                        ? {
                            backgroundColor: "#d9d9d9",
                            borderColor: "#d9d9d9",
                            pointerEvents: "none",
                            userSelect: "none",
                          }
                        : {}
                    }
                    onClick={() =>
                      setShowModals((old) =>
                        offer.status_executor.name ===
                        t("offers_status.publication")
                          ? { ...old, refuseConfirm: true }
                          : { ...old, refuse: true }
                      )
                    }
                  >
                    {t("offers_status.rejection")}
                  </button>
                </>
              ) : (
                <button
                  type={"button"}
                  className={cn(
                    "btn-reset",
                    styleBtns.btnAstral,
                    style.responsesCard__btnDetail
                  )}
                  onClick={deleteOfferHandler}
                >
                  {t("delete")}
                </button>
              )}
            </div>
          ) : (
            ""
          )}
          {showModals.citation && (
            <ModalUpCitation
              view={showModals}
              setView={setShowModals}
              offers={[offer]}
              resetFilter={resetFilter}
            />
          )}
          {showModals.publition && (
            <ModalPublition
              view={showModals}
              setView={setShowModals}
              offers={[offer]}
              resetFilter={resetFilter}
            />
          )}
          {showModals.refuseConfirm && (
            <ModalRefuseConfirm view={showModals} setView={setShowModals} />
          )}
          {showModals.refuse && (
            <ModalRefuse
              view={showModals}
              setView={setShowModals}
              refuse={
                offer.status_executor?.name === t("offers_status.rejection")
                  ? false
                  : true
              }
              offer={offer}
            />
          )}
        </>
      </Card>
    );
  }
);
