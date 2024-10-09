import cn from "classnames";
import { FC, memo, useMemo, useState } from "react";
import itemPreview from "assets/img/cardItemPreview.png";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./OfferItem.module.scss";
import { ModalDetail } from "components/Modals/Detail/ModalDetail";
import { ModalRefuse } from "components/Modals/Refuse/ModalRefuse";
import { MobileDetail } from "components/Modals/mobile/Details/MobileDetails";
import useWindow from "shared/CustomHooks";
import { TToggleOBj, parseDate } from "shared/Functions";
import { TOffer } from "types/offers.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { Link } from "react-router-dom";
import { AppDispatch } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  changeStatusOffer,
  requestOffers,
  resetOffers,
} from "store/offers/offersSlice";
import { getOffersStatus } from "store/offers/offersSelector";
import { ModalMessage } from "components/Modals/Message/ModalMessage";
import { useTranslation } from "react-i18next";

type TProps = {
  offer: TOffer;
  toggleStatus: string;
  disabled?: boolean;
};

export const OfferItem: FC<TProps> = memo(
  ({ offer, toggleStatus, disabled }) => {
    const { t } = useTranslation();
    const dispatch: AppDispatch = useDispatch();
    const isMobile = useWindow();
    const statusArr = useSelector(getOffersStatus);
    const [showModals, setShowModals] = useState<TToggleOBj>({
      message: false,
      barter: false,
      refuse: false,
      contact: false,
    });

    const deadlineDate = parseDate(new Date(offer.deadline_at), false);

    const getCitationStatuses = useMemo(() => {
      let statusCustomerId = "";
      let statusExecutorId = "";
      for (let i = 0; i < statusArr.length; i++) {
        if (statusArr[i].name === t("offers_status.expectation")) {
          statusCustomerId = statusArr[i].id;
        } else if (statusArr[i].name === t("offers_status.publication")) {
          statusExecutorId = statusArr[i].id;
        }
      }

      return [statusCustomerId, statusExecutorId];
    }, [statusArr]);

    const getPublicationStatuses = useMemo(() => {
      let statusCustomerId = "";
      let statusExecutorId = "";
      let currentStatus = "";
      for (let i = 0; i < statusArr.length; i++) {
        if (statusArr[i].name === t("offers_status.accepted")) {
          statusCustomerId = statusArr[i].id;
          statusExecutorId = statusArr[i].id;
        }
        if (statusArr[i].name === toggleStatus) {
          currentStatus = statusArr[i].id;
        }
      }

      return [statusCustomerId, statusExecutorId, currentStatus];
    }, [statusArr, toggleStatus]);

    const getDeclineStatuses = useMemo(() => {
      let statusCustomerId = "";
      let statusExecutorId = "";
      let currentStatus = "";
      for (let i = 0; i < statusArr.length; i++) {
        if (statusArr[i].name === t("offers_status.rejection")) {
          statusCustomerId = statusArr[i].id;
          statusExecutorId = statusArr[i].id;
        }
        if (statusArr[i].name === toggleStatus) {
          currentStatus = statusArr[i].id;
        }
      }

      return [statusCustomerId, statusExecutorId, currentStatus];
    }, [statusArr, toggleStatus]);

    const acceptCitation = async () => {
      const [statusCustomerId, statusExecutorId] = [...getCitationStatuses];
      await dispatch(
        changeStatusOffer(offer.id, {
          status_customer: statusCustomerId,
          status_executor: statusExecutorId,
        })
      );
      setShowModals((old) => ({ ...old, message: true }));
    };

    const acceptPublication = async () => {
      const [statusCustomerId, statusExecutorId, currentStatus] = [
        ...getPublicationStatuses,
      ];

      await dispatch(
        changeStatusOffer(offer.id, {
          status_customer: statusCustomerId,
          status_executor: statusExecutorId,
        })
      );
      dispatch(resetOffers());
      dispatch(
        requestOffers({
          card_id: offer.card.id,
          is_evidence: true,
          page: 1,
          perfomer_id: "",
          search: "",
          status_customer__id: currentStatus,
          status_executor__id: "",
        })
      );
    };

    const declineCitation = async () => {
      const [statusCustomerId, statusExecutorId, currentStatus] = [
        ...getDeclineStatuses,
      ];

      await dispatch(
        changeStatusOffer(offer.id, {
          status_customer: statusCustomerId,
          status_executor: statusExecutorId,
        })
      );
      dispatch(resetOffers());
      dispatch(
        requestOffers({
          card_id: offer.card.id,
          is_evidence: true,
          page: 1,
          perfomer_id: "",
          search: "",
          status_customer__id: currentStatus,
          status_executor__id: "",
        })
      );
    };

    return (
      <div className={style.cardItem}>
        <div className={style.cardItem__left}>
          <div
            className={style.cardItem__progressBar}
            style={
              toggleStatus === t("offers_status.expectation")
                ? { backgroundColor: "#000" }
                : toggleStatus === t("offers_status.publication")
                ? { backgroundColor: "#2F7EB8" }
                : {}
            }
          >
            <div
              className={style.cardItem__progressFill}
              style={
                toggleStatus === t("offers_status.expectation")
                  ? { display: "none" }
                  : toggleStatus === t("offers_status.citation") &&
                    offer.barter_is
                  ? { width: "50%" }
                  : { display: "none" }
              }
            />
          </div>
          <div className={style.cardItem__imgWrapper}>
            <img src={itemPreview} alt={"preview"} />
            <Link
              to={
                toggleStatus !== t("offers_status.publication")
                  ? offer.evidence?.article.file
                  : offer.evidence?.article.file_publication
              }
              target="_blank"
              className={cn("a", style.cardItem__btnDownload)}
            >
              <SvgIcon name="download" />
            </Link>
          </div>
        </div>
        <div className={style.cardItem__right}>
          <div className={style.cardItem__rightTop}>
            <span className={style.cardItem__rightLabel}>
              <SvgIcon name={offer.card.user.level.name} />
              {offer.perfomer.login}
            </span>
            <time
              dateTime={deadlineDate}
              className={style.cardItem__rightLabel}
            >
              <SvgIcon name={"watch"} />
              {t("before")} {deadlineDate}
            </time>
          </div>
          <p className={style.cardItem__rightDescr}>
            {offer.evidence?.article.title}
          </p>
          <div
            className={style.cardItem__rightBtnsBlock}
            style={{
              width:
                toggleStatus === t("offers_status.expectation")
                  ? "auto"
                  : "80%",
            }}
          >
            {toggleStatus === t("offers_status.citation") ? (
              offer.barter_is ? (
                <button
                  className={cn(
                    "btn-reset",
                    styleBtns.btnAstral,
                    style.cardItem__btn
                  )}
                  onClick={() =>
                    setShowModals((old) => ({ ...old, barter: true }))
                  }
                >
                  {t("view")}
                </button>
              ) : (
                <button
                  className={cn(
                    "btn-reset",
                    styleBtns.btnAstral,
                    style.cardItem__btn
                  )}
                  onClick={acceptCitation}
                >
                  {t("accept")}
                </button>
              )
            ) : toggleStatus === t("offers_status.publication") ? (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnAstral,
                  style.cardItem__btn
                )}
                onClick={acceptPublication}
              >
                {t("accept")}
              </button>
            ) : (
              ""
            )}
            {toggleStatus !== t("offers_status.citation") ? (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnAstral,
                  style.cardItem__btn
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
                  setShowModals((old) => ({ ...old, contact: true }))
                }
              >
                {t("contact")}
              </button>
            ) : (
              ""
            )}
            {toggleStatus === t("offers_status.citation") ? (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnAstral,
                  style.cardItem__btn
                )}
                onClick={declineCitation}
              >
                {t("decline")}
              </button>
            ) : (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnAstral,
                  style.cardItem__btn
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
            )}
          </div>
        </div>
        {showModals.barter ? (
          isMobile ? (
            <MobileDetail
              view={showModals}
              setView={setShowModals}
              barter={offer.barter_is}
              card={offer.barter}
            />
          ) : (
            <ModalDetail
              view={showModals}
              setView={setShowModals}
              offerId={offer.id}
              barterId={offer.card.id}
              barter={offer.barter_is}
              card={offer.barter}
            />
          )
        ) : (
          ""
        )}
        {showModals.refuse && (
          <ModalRefuse
            view={showModals}
            setView={setShowModals}
            offer={offer}
            toggleStatus={toggleStatus}
          />
        )}
        {showModals.contact && (
          <ModalRefuse
            view={showModals}
            setView={setShowModals}
            offer={offer}
            contact={showModals.contact ? true : false}
            toggleStatus={toggleStatus}
          />
        )}
        {showModals.message && (
          <ModalMessage
            view={showModals}
            setView={setShowModals}
            textContent={t("waiting_deal")}
            cardId={offer.card.id}
            statusId={
              statusArr.find((status) => status.name === toggleStatus)?.id
            }
          />
        )}
      </div>
    );
  }
);
