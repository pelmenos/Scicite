import { FC, memo, useMemo } from "react";
import cn from "classnames";
import style from "./ModalBarterItem.module.scss";
import cardBg from "assets/img/инженерияматериалы.png";
import { TCard } from "types/cards.types";
import { CategoryList } from "entities/CategoryList/CategoryList";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { useTranslation } from "react-i18next";

type TProps = {
  card: TCard;
  selectedCard: string;
  setSelectedCard: (id: string) => void;
  cardPrice: { [k: string]: number } | undefined;
  hidden: boolean;
};

export const ModalBarterItem: FC<TProps> = memo(
  ({ card, selectedCard, setSelectedCard, cardPrice, hidden }) => {
    const { t } = useTranslation();

    return (
      <div
        className={cn(style.modalBarterItem, hidden && "is-hidden")}
        onClick={() => setSelectedCard(card.id)}
      >
        <div className={style.modalBarterItem__top}>
          <div className={style.modalBarterItem__iconsBlock}>
            <input
              className={cn("input-reset", style.modalBarterItem__checkBox)}
              type="checkbox"
              name="multiCheckBox"
              readOnly
              checked={selectedCard === card.id}
            />
            <CategoryList categorys={card.category} />
            <span className={style.modalBarterItem__citationCounter}>
              {card.tariff.period !== 0 ? (
                <>
                  <SvgIcon name={"quo"} />
                  {card.offers_count}
                </>
              ) : (
                <SvgIcon name={"lock"} />
              )}
            </span>
          </div>
          <p className={style.modalBarterItem__title}>{card.theme}</p>
          <img src={cardBg} alt={"card-bg"} />
        </div>
        <div className={style.modalBarterItem__bottom}>
          <div className={style.modalBarterItem__priceBlock}>
            <span className={style.modalBarterItem__indexTitle}>
              {card.base.name}
            </span>
            <span className={style.modalBarterItem__price}>
              {card.tariff.period === 0 ? (
                "barter card"
              ) : (
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
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
