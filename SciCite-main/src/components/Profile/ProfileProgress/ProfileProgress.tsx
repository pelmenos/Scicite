import { FC } from "react";
import cn from "classnames";
import style from "./ProfileProgress.module.scss";
import styleMain from "pages/Profile/Profile.module.scss";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { useSelector } from "react-redux";
import {
  getCountPublication,
  getLevel,
  getNextLevel,
} from "store/user/userSelector";
import { useTranslation } from "react-i18next";

export const ProfileProgress: FC = () => {
  const { t } = useTranslation();

  const currentLevel = useSelector(getLevel);
  const nextLevel = useSelector(getNextLevel);
  const publicationCount = useSelector(getCountPublication);

  const processedPublicationCount = (count: number | null | undefined) => {
    return count !== undefined && count !== null
      ? (count % 10 === 1 && `${count} ${t("publication.one")}`) || count < 5
        ? (count === 0 && `${count} ${t("publication.zero")}`) || `${count} ${t("publication.few")}`
        : `${count} ${t("publication.many")}`
      : "";
  };

  const ProgressItem: FC<{
    icon: string;
    title: string;
    responseLimit: string;
  }> = ({ icon, responseLimit, title }) => {
    return (
      <li className={style.profileProgress__progressItem}>
        <p className={style.profileProgress__progressTitle}>
          <SvgIcon name={icon} />
          {title}
        </p>
        <span className={style.profileProgress__progressText}>
          {responseLimit} {t("responses_in_month")}
        </span>
      </li>
    );
  };

  return (
    <div className={style.profileProgress}>
      <p className={cn(styleMain.main__title, style.profileProgress__title)}>
        {t("my_progress")}
      </p>
      <div className={style.profileProgress__progressBarBlock}>
        <div className={style.profileProgress__progressBarTop}>
          <SvgIcon name={`${currentLevel}`} />
          <SvgIcon name={`${nextLevel?.name}`} />
        </div>
        <div className={style.profileProgress__progressBar}>
          <div
            className={style.profileProgress__progressBarFill}
            style={{
              width: `${
                nextLevel && publicationCount !== null
                  ? (publicationCount / nextLevel.count_offers) * 100
                  : 101
              }%`,
            }}
          ></div>
        </div>
        <div className={style.profileProgress__progressBarBottom}>
          <span>{processedPublicationCount(publicationCount)}</span>
          <span>{processedPublicationCount(nextLevel?.count_offers)}</span>
        </div>
      </div>
      <ul className={cn("list-reset", style.profileProgress__progressList)}>
        <ProgressItem
          icon={"beginner"}
          title={t("level", {name: t("beginner"), count: 1})}
          responseLimit={"5"}
        />
        <ProgressItem
          icon={"advanced"}
          title={t("level", {name: t("advanced"), count: 2})}
          responseLimit={"10"}
        />
        <ProgressItem
          icon={"experienced"}
          title={t("level", {name: t("experienced"), count: 3})}
          responseLimit={"15"}
        />
        <ProgressItem
          icon={"professional"}
          title={t("level", {name: t("professional"), count: 4})}
          responseLimit={"∞"}
        />
      </ul>
    </div>
  );
};
