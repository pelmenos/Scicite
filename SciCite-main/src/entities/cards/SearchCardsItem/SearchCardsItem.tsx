import cn from "classnames";
import { FC, memo, useMemo, useState } from "react";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./SearchCardsItem.module.scss";
import { ModalDetail } from "components/Modals/Detail/ModalDetail";
import { MobileDetail } from "components/Modals/mobile/Details/MobileDetails";
import useWindow from "shared/CustomHooks";
import { TToggleOBj } from "shared/Functions";
import { CategoryList } from "entities/CategoryList/CategoryList";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { TCard } from "types/cards.types";
import { Card } from "shared/ui/Card/Card";
import { useTranslation } from "react-i18next";

type TProps = {
  card: TCard;
  cardPrice: { [k: string]: number } | undefined;
};

export const SearchCardsItem: FC<TProps> = memo(({ card, cardPrice }) => {
  const { t, i18n } = useTranslation();

  const isMobile = useWindow();

  const [showModals, setShowModals] = useState<TToggleOBj>({
    detail: false,
  });

  return (
    <Card
      cardTitle={card.theme}
      bcgImg={
        i18n.language === "ru"
          ? card.category[0]?.name
          : t(`cards_bcg.${card.category[0]?.name}`)
      }
      isShowTitle
    >
      <>
        <div className={style.searchCard__iconsBlock}>
          <SvgIcon name={card.user.level.name} />
          <CategoryList categorys={[...card.category]} />
        </div>
      </>
      <>
        <div className={style.searchCard__priceBlock}>
          <span className={style.searchCard__indexTitle}>{card.base.name}</span>
          <span className={style.searchCard__price}>
            {((card.base.name.toLowerCase() === t("other") ||
              card.base.name.toLowerCase() === t("vak")) &&
              cardPrice &&
              cardPrice["вак"]) ||
              ((card.base.name.toLowerCase() === "web of science" || card.base.name.toLowerCase() === "scopus") &&
                cardPrice &&
                cardPrice["scopus/wos"]) ||
              (cardPrice && cardPrice["ринц"])}
            <SvgIcon name={"coins"} />
          </span>
        </div>
        <button
          className={cn(
            "btn-reset",
            styleBtns.btnAstral,
            style.searchCard__btnDetail
          )}
          onClick={() => setShowModals((old) => ({ ...old, detail: true }))}
        >
          {t("more")}
        </button>
        {showModals.detail ? (
          isMobile ? (
            <MobileDetail
              view={showModals}
              setView={setShowModals}
              card={card}
            />
          ) : (
            <ModalDetail
              view={showModals}
              setView={setShowModals}
              card={card}
            />
          )
        ) : (
          ""
        )}
      </>
    </Card>
  );
});
