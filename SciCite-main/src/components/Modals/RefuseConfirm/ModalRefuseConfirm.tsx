import cn from "classnames";
import { FC, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalRefuseConfirm.module.scss";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalRefuseConfirm: FC<TProps> = ({ view, setView }) => {
  const { t } = useTranslation();
  const [addClass, setAddClass] = useState(true);

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={"refuseConfirm"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div className={style.modalRefuseConfirm}>
        <p className={style.title}>{t("attention")}</p>
        <ul className={cn("list-reset", style.attentionList)}>
          <li className={style.attentionItem}>{t("refuse_confirm_modal.1")}</li>
          <li className={style.attentionItem}>{t("refuse_confirm_modal.2")}</li>
          <li className={style.attentionItem}>{t("refuse_confirm_modal.3")}</li>
        </ul>
        <p className={style.subtitle}>{t("refuse_confirm_modal.4")}</p>
        <div className={style.btnsBlock}>
          <button
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={() =>
              removeModals(
                setAddClass,
                setView,
                view,
                "refuseConfirm",
                "refuse"
              )
            }
          >
            {t("confirm")}
          </button>
          <button
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={() =>
              removeModals(setAddClass, setView, view, "refuseConfirm")
            }
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
