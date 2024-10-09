import { CSSProperties, FC, memo } from "react";
import cn from "classnames";
import style from "./CategoryList.module.scss";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { TCardInfo } from "types/cards.types";
import { useTranslation } from "react-i18next";

type TProps = {
  addStyles?: CSSProperties;
  categorys: TCardInfo[];
};

export const CategoryList: FC<TProps> = memo(({ addStyles, categorys }) => {
  const { t, i18n } = useTranslation();

  const CategoryItems = categorys.map((category) => (
    <li key={category.id} className={cn(style.categoryItem)}>
      <SvgIcon
        name={
          i18n.language === "ru"
            ? category?.name
            : t(`cards_bcg.${category?.name}`)
        }
      />
    </li>
  ));

  return (
    <ul className={cn("list-reset", style.categoryList, addStyles)}>
      {CategoryItems}
    </ul>
  );
});
