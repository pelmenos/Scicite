import { FC } from "react";
import style from "./mainBg.module.scss";
import useWindow from "shared/CustomHooks";
import { useTranslation } from "react-i18next";
import cn from "classnames";

export const MainBg: FC = () => {
  const {i18n} = useTranslation()

  const isMobile = useWindow();

  return (
    <>
      {!isMobile ? (
        <>
          <div className={cn(style.bg, i18n.language === "en" && style.bcEn)}></div>
          <div className={cn(style.bg, i18n.language === "en" && style.bcEn)}></div>
        </>
      ) : (
        <div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={cn(style.bgMob, i18n.language === "en" && style.bgMobEn)}></div>
          <div className={style.overlay}></div>
        </div>
      )}
    </>
  );
};
