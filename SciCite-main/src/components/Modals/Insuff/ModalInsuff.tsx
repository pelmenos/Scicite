import cn from "classnames";
import { FC, useState } from "react";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalInsuff.module.scss";
import { ModalReplenishment } from "../Replenishment/ModalReplenishment";
import { TToggleOBj } from "shared/Functions";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalInsuff: FC<TProps> = ({ view, setView }) => {
  const { t } = useTranslation();
  const [addClass, setAddClass] = useState(true);
  const [showModals, setShowModals] = useState<TToggleOBj>({
    replenishment: false,
  });

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={"noMoney"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div
        className={cn(
          style.modalInsuff,
          addClass ? style.viewModal : style.hiddenModal
        )}
        style={showModals.replenishment ? { visibility: "hidden" } : {}}
      >
        <p className={style.modalInsuff__title}>{t("insuff_modal")}</p>
        <button
          className={cn(
            "btn-reset",
            styleBtns.btnAstral,
            style.modalInsuff__btnClose
          )}
          onClick={() =>
            setShowModals((old) => ({ ...old, replenishment: true }))
          }
        >
          {t("replenish")}
        </button>
      </div>
      {showModals.replenishment && (
        <ModalReplenishment
          view={showModals}
          setView={setShowModals}
          styles={{ top: "50%", transform: "translate(-50%, -50%)" }}
        />
      )}
    </ModalWrapper>
  );
};
