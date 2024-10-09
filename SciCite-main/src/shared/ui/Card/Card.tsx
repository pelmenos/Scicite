import { FC, ReactNode } from "react";
import style from "./Card.module.scss";
import cn from "classnames";
import { Image } from "../Image/Image";
import { useTranslation } from "react-i18next";

type TProps = {
  children: ReactNode[];
  cardTitle: string;
  isShowTitle?: boolean;
  isCurrent?: boolean;
  isAdmin?: boolean;
  bcgImg: string;
  selectedCards?: string[];
  setSelectedCard?: (selectedCards: string[]) => void;
  cardId?: string;
};

export const Card: FC<TProps> = ({
  children,
  isShowTitle,
  isCurrent,
  isAdmin,
  bcgImg,
  selectedCards,
  setSelectedCard,
  cardId,
  ...props
}) => {

  return (
    <div
      className={cn(
        style.card,
        isShowTitle ? style.hoverShow : "",
        isCurrent ? style.currentCard : ""
      )}
      onClick={() =>
        selectedCards && setSelectedCard && cardId
          ? !selectedCards.includes(cardId)
            ? setSelectedCard([...selectedCards, cardId])
            : setSelectedCard([
                ...selectedCards.filter((card) => card !== cardId),
              ])
          : ""
      }
    >
      <div className={isAdmin ? style.topAdmin : style.top}>
        {children[0]}
        <p className={isAdmin ? style.adminTitle : style.cardTitle}>
          {props.cardTitle}
        </p>
        <Image name={bcgImg} />
      </div>
      <div className={style.bottom}>{children[1]}</div>
    </div>
  );
};
