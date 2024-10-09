import cn from "classnames";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import useWindow from "shared/CustomHooks";
import { TToggleOBj } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./MyCardsOrderItem.module.scss";
import { MobileCreateCard } from "components/Modals/mobile/CreateCard/MobileCreateCard";
import { ModalCreateCard } from "components/Modals/CreateCard/ModalCreateCard";
import { ModalDeleteCard } from "components/Modals/DeleteCard/ModalDeleteCard";
import { OffersInfo } from "components/MyCards/CardInfo/OffersInfo";
import { TCard } from "types/cards.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { CategoryList } from "entities/CategoryList/CategoryList";
import { Card } from "shared/ui/Card/Card";
import { offersAPI } from "api/offers.api";
import { TPublicationDeadline } from "components/MyCards/Order/MyCardsOrder";
import { useTranslation } from "react-i18next";

type TProps = {
  card: TCard;
  current: boolean;
  responses?: boolean;
  barter?: boolean;
  setCurrentCard: (card: TCard | undefined) => void;
  toggleStatus: string;
  setToggleStatus: (status: string) => void;
  publicationDeadline: TPublicationDeadline;
  setPublicationDeadline: (obj: TPublicationDeadline) => void;
  cardPrice: { [k: string]: number } | undefined;
};

export const MyCardsOrderItem: FC<TProps> = memo(
  ({
    card,
    responses,
    current,
    barter,
    setCurrentCard,
    toggleStatus,
    setToggleStatus,
    publicationDeadline,
    setPublicationDeadline,
    cardPrice,
  }) => {
    const { t, i18n } = useTranslation();

    const isMobile = useWindow();
    const [showModals, setShowModals] = useState<TToggleOBj>({
      delete: false,
      edit: false,
      cardInfo: false,
    });
    const [isDisabled, setIsDisabled] = useState<boolean>();

    useEffect(() => {
      const checkOffers = async () => {
        const data = await offersAPI.getOffers({
          card_id: card.id,
          is_evidence: true,
          page: 1,
          perfomer_id: "",
          search: "",
          status_executor__id: "",
          status_customer__id: "",
        });

        if (data.results.length) {
          setIsDisabled(true);
        }
      };

      checkOffers();
    }, [card.id]);

    const getOffers = useCallback(() => {
      let createdCard = new Date(card.created_at);
      let deadlineCard = new Date(card.created_at);
      deadlineCard.setMonth(deadlineCard.getMonth() + card.tariff.period);
      setCurrentCard(card);
      setPublicationDeadline({
        created: createdCard,
        deadline: deadlineCard,
      });
      setToggleStatus(t("offers_status.citation"));
      setShowModals((old) => ({ ...old, cardInfo: true }));
    }, [card, setCurrentCard, setPublicationDeadline, setToggleStatus]);

    return (
      <Card
        cardTitle={card.theme}
        isCurrent={current}
        bcgImg={
          i18n.language === "ru"
            ? card.category[0]?.name
            : t(`cards_bcg.${card.category[0]?.name}`)
        }
      >
        <>
          <div className={style.myCardsOrderListItem__iconsBlock}>
            <button
              className={cn("btn-reset", style.myCardsOrderListItem__btnSett)}
              onClick={() => setShowModals((old) => ({ ...old, edit: true }))}
            >
              <SvgIcon name={"sett"} />
            </button>
            <CategoryList categorys={[...card.category]} />
            <span className={style.myCardsOrderListItem__citationCounter}>
              <SvgIcon name={"quo"} />
              {card.offers_count}
            </span>
          </div>
        </>
        <>
          <div className={style.myCardsOrderListItem__priceBlock}>
            <span className={style.myCardsOrderListItem__indexTitle}>
              {card.base.name === "web of science" && card.tariff.period === 0
                ? "wos"
                : card.base.name}
            </span>
            <span className={style.myCardsOrderListItem__price}>
              {card.tariff.period !== 0 ? (
                <>
                  {((card.base.name.toLowerCase() === t("other") ||
                    card.base.name.toLowerCase() === t("vak")) &&
                    cardPrice &&
                    cardPrice["вак"]) ||
                    ((card.base.name.toLowerCase() === "web of science" ||
                      card.base.name.toLowerCase() === "scopus") &&
                      cardPrice &&
                      cardPrice["scopus/wos"]) ||
                    (cardPrice && cardPrice["ринц"])}
                  <SvgIcon name={"coins"} />
                </>
              ) : (
                <>{t("not_exposed")}</>
              )}
            </span>
          </div>
          <div className={style.myCardsOrderListItem__btnsBlock}>
            {barter ? (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnAstral,
                  style.myCardsOrderListItem__btnDetail,
                  responses ? style.btnResponse : ""
                )}
              >
                {t("barter")}
              </button>
            ) : (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnAstral,
                  style.myCardsOrderListItem__btnDetail,
                  responses ? style.btnResponse : ""
                )}
                onClick={getOffers}
              >
                {t("replies")}
              </button>
            )}
            <button
              className={cn(
                "btn-reset",
                styleBtns.btnAstral,
                style.myCardsOrderListItem__btnDetail
              )}
              style={
                isDisabled
                  ? {
                      backgroundColor: "#d9d9d9",
                      borderColor: "#d9d9d9",
                      pointerEvents: "none",
                      userSelect: "none",
                    }
                  : {}
              }
              onClick={() => setShowModals((old) => ({ ...old, delete: true }))}
            >
              {t("delete")}
            </button>
          </div>
          {showModals.delete && (
            <ModalDeleteCard
              view={showModals}
              setView={setShowModals}
              inArchive={false}
              userId={card.user.id}
              itemId={card.id}
            />
          )}
          {showModals.edit ? (
            isMobile ? (
              <MobileCreateCard
                view={showModals}
                setView={setShowModals}
                isEdit={true}
              />
            ) : (
              <ModalCreateCard
                card={card}
                view={showModals}
                setView={setShowModals}
                isEdit={true}
              />
            )
          ) : (
            ""
          )}
          {isMobile && showModals.cardInfo && (
            <OffersInfo
              view={showModals}
              setView={setShowModals}
              currentCard={card}
              toggleStatus={toggleStatus}
              setToggleStatus={setToggleStatus}
              publicationDeadline={publicationDeadline}
            />
          )}
        </>
      </Card>
    );
  }
);
