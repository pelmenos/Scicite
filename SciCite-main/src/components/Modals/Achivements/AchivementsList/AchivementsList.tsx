import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { FC, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import style from "./AchivementsList.module.scss";
import cn from "classnames";
import { TAchivement } from "types/user.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  achievements: TAchivement[];
};

export const AchivementsList: FC<TProps> = ({
  view,
  setView,
  achievements,
}) => {
  const { t } = useTranslation();
  const [addClass, setAddClass] = useState(true);

  const AchieveItem: FC<{ title: string; achieveName: string }> = ({
    title,
    achieveName,
  }) => {
    return (
      <li className={cn(style.item)}>
        <span className={style.itemTitle}>{title}</span>
        <div
          className={
            achievements.findIndex(
              (achieve) => achieve.achievement === achieveName
            ) > -1
              ? style.achive
              : ""
          }
        >
          <SvgIcon
            name={
              achievements.findIndex(
                (achieve) => achieve.achievement === achieveName
              ) > -1
                ? "achiveCoins"
                : "gift"
            }
          />
        </div>
      </li>
    );
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={"achievements"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div className={style.modal}>
        <p className={style.title}>{t("achievement_list")}</p>
        <ul className={cn("list-reset", style.list)}>
          <AchieveItem title={t("registration")} achieveName={"registration"} />
          <AchieveItem title={t("first_card")} achieveName={"first_card"} />
          <AchieveItem title={t("first_offer")} achieveName={"first_offer"} />
          <AchieveItem title={t("first_quote")} achieveName={"first_quote"} />
          <AchieveItem
            title={t("first_publication")}
            achieveName={"first_publication"}
          />
        </ul>
        <button
          className={cn("btn-reset", style.btn)}
          onClick={() =>
            removeModals(setAddClass, setView, view, "achievements")
          }
        >
          {t("close")}
        </button>
      </div>
    </ModalWrapper>
  );
};
