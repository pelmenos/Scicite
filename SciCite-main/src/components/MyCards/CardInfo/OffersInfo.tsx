import { FC, useState } from "react";
import cn from "classnames";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./OffersInfo.module.scss";
import { createPortal } from "react-dom";
import { ModalProlong } from "../../Modals/Prolong/ModalProlong";
import { TToggleOBj, parseDate } from "shared/Functions";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import useWindow from "shared/CustomHooks";
import { OffersList } from "./OffersList/OffersList";
import { TPublicationDeadline } from "../Order/MyCardsOrder";
import { TCard } from "types/cards.types";
import { useTranslation } from "react-i18next";

type TProps = {
  view?: TToggleOBj;
  setView?: (toggle: TToggleOBj) => void;
  currentCard: TCard | undefined;
  toggleStatus: string;
  setToggleStatus: (status: string) => void;
  publicationDeadline: TPublicationDeadline;
};

export const OffersInfo: FC<TProps> = ({
  view,
  setView,
  currentCard,
  toggleStatus,
  setToggleStatus,
  publicationDeadline,
}) => {
  const { t, i18n } = useTranslation();

  const createdCard = publicationDeadline.created
    ? parseDate(publicationDeadline.created, false)
    : null;
  const deadlineCard = publicationDeadline.deadline
    ? parseDate(publicationDeadline.deadline, false)
    : null;
  const [showModals, setShowModals] = useState<TToggleOBj>({
    prolong: false,
  });

  const [addClass, setAddClass] = useState(true);
  const isMobile = useWindow();

  const RemoveModal = () => {
    setAddClass(false);
    if (setView) {
      setTimeout(() => {
        setView({ ...view, cardInfo: false });
      }, 900);
    }
  };

  return (
    <>
      {isMobile && view && setView ? (
        <>
          <ModalWrapper
            view={view}
            setView={setView}
            changeEl={"cardInfo"}
            addClass={addClass}
            setAddClass={setAddClass}
            smooth={isMobile ? true : false}
          >
            <div className={cn(style.cardInfo)}>
              <div className={style.cardInfo__top} />
              <p className={style.cardInfo__title}>{t("visibility_period")}</p>
              {showModals.prolong ? (
                <ModalProlong
                  view={showModals}
                  setView={setShowModals}
                  card={currentCard}
                />
              ) : (
                <>
                  <div className={style.cardInfo__progressBarBlock}>
                    <div className={style.cardInfo__progressBarTop}>
                      <time className={style.cardInfo__proggressBarTime}>
                        {createdCard}
                      </time>
                      <time className={style.cardInfo__proggressBarTime}>
                        {deadlineCard}
                      </time>
                    </div>
                    <div className={style.cardInfo__progressBar}>
                      <div
                        className={style.cardInfo__progressBarFill}
                        style={{
                          width: `${
                            publicationDeadline.created &&
                            publicationDeadline.deadline &&
                            +publicationDeadline.created !==
                              +publicationDeadline.deadline
                              ? ((+new Date() -
                                  +new Date(publicationDeadline.created)) /
                                  (+new Date(publicationDeadline.deadline) -
                                    +new Date(publicationDeadline.created))) *
                                100
                              : 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    className={cn(
                      "btn-reset",
                      styleBtns.btnAstral,
                      style.cardInfo__btnProlong
                    )}
                    onClick={() =>
                      setShowModals((old) => ({ ...old, prolong: true }))
                    }
                  >
                    {t("prolong")}
                  </button>
                </>
              )}
              <OffersList
                currentCard={currentCard}
                toggleStatus={toggleStatus}
                setToggleStatus={setToggleStatus}
              />
              <div className={style.cardInfo__bottom} />
            </div>
          </ModalWrapper>
        </>
      ) : (
        <>
          <div className={style.cardInfo}>
            <p className={style.cardInfo__title}>{t("visibility_period")}</p>
            <div className={style.cardInfo__progressBarBlock}>
              <div className={style.cardInfo__progressBarTop}>
                <time className={style.cardInfo__proggressBarTime}>
                  {createdCard}
                </time>
                <time className={style.cardInfo__proggressBarTime}>
                  {deadlineCard}
                </time>
              </div>
              <div className={style.cardInfo__progressBar}>
                <div
                  className={style.cardInfo__progressBarFill}
                  style={{
                    width: `${
                      publicationDeadline.created &&
                      publicationDeadline.deadline &&
                      +publicationDeadline.created !==
                        +publicationDeadline.deadline
                        ? ((+new Date() -
                            +new Date(publicationDeadline.created)) /
                            (+new Date(publicationDeadline.deadline) -
                              +new Date(publicationDeadline.created))) *
                            100 +
                          1
                        : 101
                    }%`,
                  }}
                />
              </div>
            </div>
            <button
              className={cn(
                "btn-reset",
                styleBtns.btnAstral,
                style.cardInfo__btnProlong
              )}
              onClick={() =>
                setShowModals((old) => ({ ...old, prolong: true }))
              }
            >
              {t("prolong")}
            </button>
            <OffersList
              currentCard={currentCard}
              toggleStatus={toggleStatus}
              setToggleStatus={setToggleStatus}
            />
            {showModals.prolong &&
              createPortal(
                <ModalProlong
                  view={showModals}
                  setView={setShowModals}
                  card={currentCard}
                />,
                document.body
              )}
          </div>
        </>
      )}
    </>
  );
};
