import cn from "classnames";
import { FC, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalDeleteCard.module.scss";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { activeToggleCard, deleteCard } from "store/cards/cardsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";
import { useTranslation } from "react-i18next";

type TProps = {
  inArchive?: boolean;
  itemId: string;
  userId: string;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalDeleteCard: FC<TProps> = ({
  view,
  setView,
  inArchive,
  itemId,
  userId,
}) => {
  const { t } = useTranslation();
  const [addClass, setAddClass] = useState(true);
  const dispatch: AppDispatch = useDispatch();

  const removeHandler = () => {
    inArchive
      ? dispatch(deleteCard(itemId, userId))
      : dispatch(activeToggleCard(userId, itemId, false));
    removeModals(setAddClass, setView, view, "delete");
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={"delete"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div className={cn(style.modalDeleteCard, inArchive ? style.padd : "")}>
        <p className={style.title}>
          {inArchive
            ? t("delete_card")
            : t("move_archive")}
        </p>
        <div className={style.btnsBlock}>
          <button
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={removeHandler}
          >
            {t("confirm")}
          </button>
          <button
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={() => removeModals(setAddClass, setView, view, "delete")}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
