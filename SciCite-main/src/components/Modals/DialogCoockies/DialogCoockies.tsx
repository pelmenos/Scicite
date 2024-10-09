import React, { FC } from "react";
import { CookieSetOptions } from "universal-cookie";
import style from "./DialogCoockies.module.scss";
import cn from "classnames";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { TToggleOBj } from "shared/Functions";
import { useTranslation } from "react-i18next";

type TProps = {
  setCookie: (
    name: "acceptCoockies",
    value: any,
    options?: CookieSetOptions | undefined
  ) => void;
  setView: (toggle: TToggleOBj) => void;
  view: TToggleOBj;
};

export const DialogCoockies: FC<TProps> = ({ setCookie, view, setView }) => {
  const { t } = useTranslation();

  return (
    <div className={style.dialog}>
      <span>
        {t("coockie_text")}
      </span>
      <button
        className={cn("btn-reset", style.btnAccept)}
        onClick={() => setCookie("acceptCoockies", true)}
      >
        {t("accept")}
      </button>
      <button
        className={cn("btn-reset", style.btnClose)}
        onClick={() => setView({ ...view, cookies: false })}
      >
        <SvgIcon name="cross" />
      </button>
    </div>
  );
};
