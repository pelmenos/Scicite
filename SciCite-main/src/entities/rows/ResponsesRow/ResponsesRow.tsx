import cn from "classnames";
import { FC, useState } from "react";
import { TToggleOBj } from "shared/Functions";
import style from "components/AdminKit/modals/ModalCitation/ModalCitation.module.scss";
import { ModalResponseInfo } from "components/AdminKit/modals/ModalResponseInfo/ModalResponseInfo";
import { TOffer } from "types/offers.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";

type TProps = {
  offer: TOffer;
};

export const ResponsesRow: FC<TProps> = ({ offer }) => {
  const [showModals, setShowModals] = useState<TToggleOBj>({
    responsesInfo: false,
  });

  const deadline = Math.round(
    (+new Date(offer.deadline_at) - +new Date()) / 2592000000
  );

  return (
    <div className={cn(style.row, style.rowSb)}>
      <span className={style.cell}>№ {offer.offer_number}</span>
      <span className={style.userCell}>
        <SvgIcon name={offer.perfomer.level.name} />
        <span>
          {offer.perfomer.login.length > 15
            ? `${offer.perfomer.login.substring(0, 15)}...`
            : offer.perfomer.login}
        </span>
      </span>
      <span className={style.userCell}>
        <SvgIcon name={offer.card.user.level.name} />
        <span>{offer.card.user.login}</span>
      </span>
      <span className={style.cell}>
        {(offer.status_executor?.name === "публикация" &&
          "загрузка публикации") ||
          (offer.status_executor?.name === "цитирование" &&
            "загрузка цитирования") ||
          offer.status_executor?.name}
      </span>
      <span className={style.cell}>
        {deadline >= 0
          ? (deadline === 1 && `${deadline} месяц`) ||
            (deadline < 5 && `${deadline} месяца`) ||
            (deadline >= 5 && `${deadline} месяцев`)
          : ""}
      </span>
      <span className={style.cell}>№ {offer.card.cart_number}</span>
      <button
        className={cn("btn-reset", style.cell, style.cellBtn)}
        onClick={() =>
          setShowModals((old) => ({ ...old, responsesInfo: true }))
        }
      >
        <span className={style.under}>информация</span>
      </button>
      {showModals.responsesInfo && (
        <ModalResponseInfo
          view={showModals}
          setView={setShowModals}
          offer={offer}
        />
      )}
    </div>
  );
};
