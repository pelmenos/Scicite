import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { FC, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import style from "./Achieve.module.scss";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import cn from "classnames";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { getCurrentAcievement } from "store/user/usersSlice";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  achieve: string;
};

export const Achieve: FC<TProps> = ({ view, setView, achieve }) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const [addClass, setAddClass] = useState(true);
  const [isStartBonus, setIsStartBonus] = useState(false);

  const closeAchive = () => {
    if (localStorage.getItem("registerAchieve")) {
      localStorage.removeItem("registerAchieve");
      setIsStartBonus(true);
    } else if (
      !localStorage.getItem("registerAchieve") &&
      localStorage.getItem("start_bonus")
    ) {
      localStorage.removeItem("start_bonus");
      setIsStartBonus(false);
      dispatch(getCurrentAcievement(null));
      removeModals(setAddClass, setView, view, "achieve");
    } else {
      removeModals(setAddClass, setView, view, "achieve");
      dispatch(getCurrentAcievement(null));
    }
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl="achieve"
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div className={style.modal}>
        <p className={style.title}>
          {(isStartBonus && `“${t("welcome_bonus")}”`) ||
            `${t("achievement")} “` +
              ((achieve === "registration" && t("registration")) ||
                (achieve === "first_card" && t("first_card")) ||
                (achieve === "first_offer" && t("first_offer")) ||
                (achieve === "first_quote" && t("first_quote")) ||
                (achieve === "first_publication" && t("first_publication"))) +
              "”"}
        </p>
        <div className={style.achive}>
          <span className={style.sum}>
            {isStartBonus
              ? "+" + localStorage.getItem("start_bonus")
              : "+" + 50}
          </span>
          <SvgIcon name={"achiveCoins"} />
        </div>
        <button className={cn("btn-reset", style.btn)} onClick={closeAchive}>
          {t("get")}
        </button>
      </div>
    </ModalWrapper>
  );
};
