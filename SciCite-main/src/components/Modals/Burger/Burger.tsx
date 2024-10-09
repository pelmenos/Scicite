import cn from "classnames";
import { FC, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { TToggleOBj, removeModals } from "shared/Functions";
import style from "./Burger.module.scss";
import navStyle from "assets/scss/nav.module.scss";
import { ModalSupport } from "../Support/ModalSupport";
import { useTranslation } from "react-i18next";

type TProps = {
  currentPage: string;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const Burger: FC<TProps> = ({ view, currentPage, setView }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigate();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    navigation(0);
  };

  const [addClass, setAddClass] = useState(true);
  const [toggleLang, setToggleLang] = useState(false);
  const [showModals, setShowModals] = useState<TToggleOBj>({
    support: false,
  });

  return (
    <div className={cn(style.substrate, addClass ? style.view : style.hidden)}>
      <div
        className={style.overlay}
        onClick={() => removeModals(setAddClass, setView, view, "burger")}
      />
      <div className={style.burger}>
        <nav className={cn(navStyle.nav, style.burger__nav)}>
          <ul
            className={cn(
              "list-reset",
              navStyle.nav__list,
              style.burger__navList
            )}
            title={t("burger_page")}
          >
            <li className={navStyle.nav__item}>
              <NavLink
                to={"/"}
                title={t("main")}
                className={cn(
                  "a",
                  navStyle.nav__link,
                  currentPage === "/main" ? style.currentLink : "",
                  style.burger__link
                )}
                onClick={() =>
                  removeModals(setAddClass, setView, view, "burger")
                }
              >
                {t("main")}
              </NavLink>
            </li>
            <li className={navStyle.nav__item}>
              <NavLink
                to={"/search"}
                title={t("search")}
                className={cn(
                  "a",
                  navStyle.nav__link,
                  currentPage === "/search" ? style.currentLink : "",
                  style.burger__link
                )}
                onClick={() =>
                  removeModals(setAddClass, setView, view, "burger")
                }
              >
                {t("search")}
              </NavLink>
            </li>
            <li className={navStyle.nav__item}>
              <NavLink
                to={"/mycards"}
                title={t("my_cards")}
                className={cn(
                  "a",
                  navStyle.nav__link,
                  currentPage === "/mycards" ? style.currentLink : "",
                  style.burger__link
                )}
                onClick={() =>
                  removeModals(setAddClass, setView, view, "burger")
                }
              >
                {t("my_cards")}
              </NavLink>
            </li>
            <li className={navStyle.nav__item}>
              <NavLink
                to={"/responses"}
                title={t("responses")}
                className={cn(
                  "a",
                  navStyle.nav__link,
                  currentPage === "/responses" ? style.currentLink : "",
                  style.burger__link
                )}
                onClick={() =>
                  removeModals(setAddClass, setView, view, "burger")
                }
              >
                {t("responses")}
              </NavLink>
            </li>
            <li className={navStyle.nav__item}>
              <NavLink
                to={"/howuse"}
                title={t("how_use")}
                className={cn(
                  "a",
                  navStyle.nav__link,
                  currentPage === "/howuse" ? style.currentLink : "",
                  style.burger__link
                )}
                onClick={() =>
                  removeModals(setAddClass, setView, view, "burger")
                }
              >
                {t("how_use")}
              </NavLink>
            </li>
          </ul>
        </nav>
        <ul className={cn("list-reset", style.burger__langList)}>
          <li className={style.burger__langItem}>
            <button
              className={cn(
                "btn-reset",
                style.burger__langLink,
                i18n.language === "ru" && style.currentLink
              )}
              onClick={() => changeLanguage("ru")}
            >
              русский
            </button>
          </li>
          <li className={style.burger__langItem}>
            <button
              className={cn(
                "btn-reset",
                style.burger__langLink,
                i18n.language === "en" && style.currentLink
              )}
              onClick={() => changeLanguage("en")}
            >
              english
            </button>
          </li>
        </ul>
        <button
          className={cn("btn-reset", style.burger__btnHelp)}
          onClick={() => setShowModals((old) => ({ ...old, support: true }))}
        >
          {t("support")}
        </button>
        <div className={style.burger__bottom} />
      </div>
      {showModals.support && (
        <ModalSupport view={showModals} setView={setShowModals} />
      )}
    </div>
  );
};
