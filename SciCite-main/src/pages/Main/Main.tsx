import { FC, useEffect, useState } from "react";
import style from "./Main.module.scss";
import styleBtns from "../../assets/scss/btns.module.scss";
import cn from "classnames";
import { MainBg } from "../../entities/MainBg/mainBg";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authSelector";
import { ModalLogin } from "components/Modals/authorization/ModalLogin/ModalLogin";
import { TToggleOBj } from "shared/Functions";
import { ModalRegistration } from "components/Modals/authorization/ModalRegistration/ModalRegistration";
import { ModalForgot } from "components/Modals/authorization/ModalForgot/ModalForgot";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { DialogCoockies } from "components/Modals/DialogCoockies/DialogCoockies";

const Main: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({
  setFooterVisible,
}) => {
  const { t } = useTranslation();
  const isAuth = useSelector(getIsAuth);

  const [cookies, setCookie] = useCookies(["acceptCoockies"]);

  const [showModals, setShowModals] = useState<TToggleOBj>({
    login: false,
    auth: false,
    forgot: false,
    cookies: true,
  });

  useEffect(() => {
    setFooterVisible(false);
  }, [setFooterVisible]);

  return (
    <main className={style.main}>
      <MainBg />
      <div className={cn("container", style.main__container)}>
        <div className={style.main__content}>
          <h1 className={style.main__title}>{t("main_title")}</h1>
          <h2 className={style.main__subtitle}>{t("main_subtitle")}</h2>
          <div className={style.main__btnsBlock}>
            {isAuth ? (
              <NavLink
                to={"/search"}
                className={cn("a", styleBtns.btnAstral, style.main__btn)}
              >
                {t("search")}
              </NavLink>
            ) : (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnAstral,
                  style.main__btn
                )}
                onClick={() =>
                  setShowModals((old) => ({ ...old, login: true }))
                }
              >
                {t("signIn")}
              </button>
            )}
            <NavLink
              to={"/howuse"}
              className={cn("a", styleBtns.btnTr, style.main__btn)}
            >
              {t("how_use")}
            </NavLink>
          </div>
        </div>
      </div>
      {showModals.login && (
        <ModalLogin view={showModals} setView={setShowModals} isAuth={isAuth} />
      )}
      {showModals.auth && (
        <ModalRegistration view={showModals} setView={setShowModals} />
      )}
      {showModals.forgot && (
        <ModalForgot view={showModals} setView={setShowModals} />
      )}
      {!cookies.acceptCoockies && showModals.cookies && (
        <DialogCoockies setCookie={setCookie} view={showModals} setView={setShowModals} />
      )}
    </main>
  );
};

export default Main;
