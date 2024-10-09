import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { FC, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import cn from "classnames";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalMessage.module.scss";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { requestOffers, resetOffers } from "store/offers/offersSlice";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  textContent: string;
  cardId?: string;
  statusId?: string;
};

export const ModalMessage: FC<TProps> = ({
  view,
  setView,
  textContent,
  cardId,
  statusId,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [addClass, setAddClass] = useState(true);

  const deleteModal = () => {
    removeModals(setAddClass, setView, view, "message");
    if (cardId && statusId) {
      dispatch(resetOffers());
      dispatch(
        requestOffers({
          card_id: cardId,
          is_evidence: true,
          page: 1,
          perfomer_id: "",
          search: "",
          status_customer__id: statusId,
          status_executor__id: "",
        })
      );
    }
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={"message"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div
        className={cn(
          style.modalInsuff,
          addClass ? style.viewModal : style.hiddenModal
        )}
      >
        <p className={style.modalInsuff__title}>{textContent}</p>
        <button
          className={cn(
            "btn-reset",
            styleBtns.btnAstral,
            style.modalInsuff__btnClose
          )}
          onClick={deleteModal}
        >
          OK
        </button>
      </div>
    </ModalWrapper>
  );
};
