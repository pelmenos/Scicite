import { FC, memo, useMemo, useState } from "react";
import cn from "classnames";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./MyCardsArchiveItem.module.scss";
import { ModalDeleteCard } from "components/Modals/DeleteCard/ModalDeleteCard";
import { TToggleOBj } from "shared/Functions";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { TCard } from "types/cards.types";
import { CategoryList } from "entities/CategoryList/CategoryList";
import { activeToggleCard } from "store/cards/cardsSlice";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { Card } from "shared/ui/Card/Card";
import { useTranslation } from "react-i18next";

type TProps = {
  card: TCard;
  cardPrice: { [k: string]: number } | undefined;
};

export const MyCardsArchiveItem: FC<TProps> = memo(({ card, cardPrice }) => {
  const { t, i18n } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const [showModals, setShowModals] = useState<TToggleOBj>({
    delete: false,
  });

  const activeCard = () => {
    dispatch(activeToggleCard(card.user.id, card.id, true));
  };

  return (
    <Card
      cardTitle={card.theme}
      bcgImg={
        i18n.language === "ru"
          ? card.category[0]?.name
          : t(`cards_bcg.${card.category[0]?.name}`)
      }
    >
      <>
        <div className={style.myCardsOrderListItem__iconsBlock}>
          <span className={style.myCardsOrderListItem__citationCounter}>
            <SvgIcon name={"quo"} />
            {card.offers_count}
          </span>
          <CategoryList categorys={[...card.category]} />
        </div>
      </>
      <>
        <div className={style.myCardsOrderListItem__priceBlock}>
          <span className={style.myCardsOrderListItem__indexTitle}>
            {card.base.name}
          </span>
          <span className={style.myCardsOrderListItem__price}>
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
          </span>
        </div>
        <div className={style.myCardsOrderListItem__btnsBlock}>
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.myCardsOrderListItem__btnDetail
            )}
            onClick={activeCard}
          >
            {t("restore")}
          </button>
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.myCardsOrderListItem__btnDetail
            )}
            onClick={() => setShowModals((old) => ({ ...old, delete: true }))}
          >
            {t("delete")}
          </button>
        </div>
        {showModals.delete && (
          <ModalDeleteCard
            view={showModals}
            setView={setShowModals}
            inArchive={true}
            userId={card.user.id}
            itemId={card.id}
          />
        )}
      </>
    </Card>
  );
});
