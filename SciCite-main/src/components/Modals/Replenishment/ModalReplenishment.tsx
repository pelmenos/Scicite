import { FC, useState } from "react";
import cn from "classnames";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalReplenishment.module.scss";
import { useTranslation } from "react-i18next";

type TStyles = {
  top: string;
  transform: string;
};

type TProps = {
  styles?: TStyles;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalReplenishment: FC<TProps> = ({ styles, view, setView }) => {
  const { t } = useTranslation();
  const [addClass, setAddClass] = useState(true);

  return (
    <div className={cn(style.substrate, addClass ? style.view : style.hidden)}>
      <div
        className={style.overlay}
        onClick={() =>
          removeModals(setAddClass, setView, view, "replenishment")
        }
      />
      <form className={style.modalReplenishment} style={styles ? styles : {}}>
        <p className={style.modalReplenishment__title}>{t("replenishment")}</p>
        <input
          type={"text"}
          placeholder={`${t("count")} scicoins`}
          className={cn("input-reset", style.modalReplenishment__field)}
        />
        <button
          className={cn(
            "btn-reset",
            styleBtns.btnAstral,
            style.modalReplenishment__btnSub
          )}
        >
          {t("replenish")}
        </button>
      </form>
    </div>
  );
};
