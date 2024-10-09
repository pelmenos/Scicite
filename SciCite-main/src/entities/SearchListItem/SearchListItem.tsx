import cn from "classnames";
import { FC, memo, useMemo, useState } from "react";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./SearchListItem.module.scss";
import { ModalDetail } from "components/Modals/Detail/ModalDetail";
import { TToggleOBj } from "shared/Functions";
import { TCard } from "types/cards.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { CategoryList } from "entities/CategoryList/CategoryList";
import { useTranslation } from "react-i18next";

type TProps = {
  card: TCard;
  cardPrice: { [k: string]: number } | undefined;
};

export const SearchListItem: FC<TProps> = memo(({ card, cardPrice }) => {
  const { t } = useTranslation();

  const [showModals, setShowModals] = useState<TToggleOBj>({
    detail: false,
  });

  return (
    <div className={style.searchListItem}>
      <div className={style.searchListItem__top}>
        <div className={style.searchListItem__author}>
          <SvgIcon name={card.user.level.name} />
          <span>{card.user.login}</span>
        </div>
        <CategoryList
          categorys={[...card.category]}
          addStyles={style.searchListItem__categoryList}
        />
      </div>
      <div className={style.searchListItem__bottom}>
        <div className={style.searchListItem__info}>
          <p className={style.searchListItem__title}>{card.theme}</p>
          <div className={style.searchListItem__priceBlock}>
            <span className={style.searchListItem__indexTitle}>
              {card.base.name}
            </span>
            <span className={style.searchListItem__price}>
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
        </div>
        <div className={style.searchListItem__btnBlock}>
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.searchListItem__btnDetail
            )}
            onClick={() => setShowModals((old) => ({ ...old, detail: true }))}
          >
            {t("more")}
          </button>
        </div>
      </div>
      {showModals.detail && (
        <ModalDetail view={showModals} setView={setShowModals} card={card} />
      )}
    </div>
  );
});
