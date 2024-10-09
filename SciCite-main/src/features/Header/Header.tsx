import cn from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useWindow from "shared/CustomHooks";
import { TToggleOBj } from "shared/Functions";
import style from "./Header.module.scss";
import styleBtns from "assets/scss/btns.module.scss";
import navStyle from "assets/scss/nav.module.scss";
import { Burger } from "components/Modals/Burger/Burger";
import { ModalExit } from "components/Modals/authorization/ModalExit/ModalExit";
import { ModalForgot } from "components/Modals/authorization/ModalForgot/ModalForgot";
import { ModalLogin } from "components/Modals/authorization/ModalLogin/ModalLogin";
import { ModalNotifications } from "components/Modals/Notification/ModalNotifications";
import { ModalRegistration } from "components/Modals/authorization/ModalRegistration/ModalRegistration";
import { useDispatch, useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authSelector";
import {
  getBalance,
  getCurrentAchievement,
  getIsStaff,
  getLevel,
  getLogin,
  getNotifications,
  getRole,
  getUserId,
} from "store/user/userSelector";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { AppDispatch } from "store/store";
import {
  getCategory,
  getRequiredbase,
  requestTariff,
} from "store/cards/cardsSlice";
import { getSupportStatus, getSupportTypes } from "store/support/supportSlice";
import { requestOffersStatus } from "store/offers/offersSlice";
import { getSearchCards, getUserCards } from "store/cards/cardsSelector";
import { fetchNotifications, getUserData } from "store/user/usersSlice";
import { getOffers } from "store/offers/offersSelector";
import { Achieve } from "components/Modals/Achivements/Achieve/Achieve";
import { checkVerifyEmail } from "store/auth/authSlice";
import { ModalResetPassword } from "components/Modals/authorization/ModalResetPassword/ModalResetPassword";
import { requestSettings } from "store/admin/adminSlice";
import { useTranslation } from "react-i18next";

export const Header: FC = () => {
  const { t, i18n } = useTranslation();

  const isMobile = useWindow();

  const navigation = useNavigate();
  const location = useLocation();

  const headerRef = useRef<null | HTMLDivElement>(null);
  const langRef = useRef<null | HTMLButtonElement>(null);

  const [currentPage, setCurrentPage] = useState(location.pathname);
  const [notifyPos, setNotifyPos] = useState<number[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const searchCards = useSelector(getSearchCards);
  const userCards = useSelector(getUserCards);
  const offers = useSelector(getOffers);
  const notifications = useSelector(getNotifications);
  const currentAchieve = useSelector(getCurrentAchievement);

  const user = {
    id: useSelector(getUserId),
    is_staff: useSelector(getIsStaff),
    role: useSelector(getRole),
    isAuth: useSelector(getIsAuth),
    login: useSelector(getLogin),
    balance: useSelector(getBalance),
    level: useSelector(getLevel),
  };

  const [showModals, setShowModals] = useState<TToggleOBj>({
    burger: false,
    notification: false,
    login: false,
    auth: false,
    forgot: false,
    exit: false,
    achieve: false,
    reset: false,
  });

  useEffect(() => {
    const showModalBySearch = () => {
      if (location.pathname === "/main") {
        if (location.search.includes("reset_password")) {
          const startPos = location.search.indexOf("&") + 1;
          localStorage.setItem("reset", location.search.substring(startPos));
          setShowModals((old) => ({ ...old, reset: true }));
        } else if (location.search) {
          dispatch(checkVerifyEmail(location.search));
        }
      }
    };

    setCurrentPage(location.pathname);
    showModalBySearch();
  }, [dispatch, location]);

  useEffect(() => {
    const showAchieveModal = () => {
      if (currentAchieve !== null && !showModals.login) {
        setShowModals((old) => ({ ...old, achieve: true }));
      }
    };

    showAchieveModal();
  }, [currentAchieve, showModals.login]);

  useEffect(() => {
    const getInitialInfo = () => {
      if (user.isAuth) {
        if (location.pathname === "/adminkit" && !user.is_staff) {
          navigation("/main", {
            replace: true,
          });
        }
        if (user.is_staff) {
          navigation("/adminkit", {
            replace: true,
          });
        }
        dispatch(requestTariff());
        dispatch(getCategory());
        dispatch(getRequiredbase());
        dispatch(getSupportTypes());
        dispatch(getSupportStatus());
        dispatch(requestOffersStatus());
        dispatch(fetchNotifications());
        dispatch(requestSettings());
      }
    };

    getInitialInfo();
  }, [dispatch, user.isAuth]);

  useEffect(() => {
    const getUserInfo = () => {
      if (user.id) {
        dispatch(getUserData(user.id));
        dispatch(fetchNotifications());
      }
    };

    getUserInfo();
  }, [dispatch, searchCards, userCards, offers, user.id]);

  useEffect(() => {
    const gettingPos = () => {
      const headerPos = headerRef.current?.getBoundingClientRect();
      const langPos = langRef.current?.getBoundingClientRect();
      if (langPos && headerPos) {
        setNotifyPos([headerPos?.bottom, window.innerWidth - langPos?.right]);
      }
    };

    gettingPos();
    window.addEventListener("resize", gettingPos);

    return () => {
      window.removeEventListener("resize", gettingPos);
    };
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    navigation(0);
  };

  return (
    <header className={style.header} ref={headerRef}>
      <div className={cn("container", style.header__container)}>
        <button
          className={cn("btn-reset", style.header__burger)}
          onClick={() => setShowModals((old) => ({ ...old, burger: true }))}
        >
          <SvgIcon name={"burger"} />
        </button>
        {isMobile ? (
          showModals.burger &&
          createPortal(
            <Burger
              view={showModals}
              setView={setShowModals}
              currentPage={currentPage}
            />,
            document.body
          )
        ) : (
          <nav className={navStyle.nav}>
            <ul className={cn("list-reset", navStyle.nav__list)}>
              <li className={navStyle.nav__item}>
                <NavLink
                  to={"/"}
                  title={!user.isAuth ? t("signIn") : t("main")}
                  className={cn(
                    "a",
                    navStyle.nav__link,
                    currentPage === "/main" && navStyle.currentLink
                  )}
                >
                  {!user.isAuth ? t("signIn") : t("main")}
                </NavLink>
              </li>
              {user.isAuth && (
                <>
                  <li className={navStyle.nav__item}>
                    <NavLink
                      to={!user.isAuth ? "/" : "/search"}
                      title={t("search")}
                      className={cn(
                        "a",
                        navStyle.nav__link,
                        currentPage === "/search" && navStyle.currentLink
                      )}
                    >
                      {t("search")}
                    </NavLink>
                  </li>
                  <li className={navStyle.nav__item}>
                    <NavLink
                      to={!user.isAuth ? "/" : "/mycards"}
                      title={t("my_cards")}
                      className={cn(
                        "a",
                        navStyle.nav__link,
                        currentPage === "/mycards" && navStyle.currentLink
                      )}
                    >
                      {t("my_cards")}
                    </NavLink>
                  </li>
                  <li className={navStyle.nav__item}>
                    <NavLink
                      to={!user.isAuth ? "/" : "/responses"}
                      title={t("responses")}
                      className={cn(
                        "a",
                        navStyle.nav__link,
                        currentPage === "/responses" && navStyle.currentLink
                      )}
                    >
                      {t("responses")}
                    </NavLink>
                  </li>
                </>
              )}
              <li className={navStyle.nav__item}>
                <NavLink
                  to={"/howuse"}
                  title={t("how_use")}
                  className={cn(
                    "a",
                    navStyle.nav__link,
                    currentPage === "/howuse" && navStyle.currentLink
                  )}
                >
                  {t("how_use")}
                </NavLink>
              </li>
            </ul>
          </nav>
        )}
        <div className={style.header__content}>
          {user.role !== "admin" ? (
            user.isAuth ? (
              <>
                <div className={style.header__coinsCounterWrapper}>
                  <span className={style.header__coinsCounter}>
                    {user.balance}
                  </span>
                </div>
                <div className={style.header__personBlock}>
                  <SvgIcon
                    name={user.level ? user.level : ""}
                    addStyles={style.header__lvlImg}
                  />
                  <NavLink
                    to={"/profile"}
                    className={cn("a", style.header__name)}
                  >
                    {user.login.length > 15
                      ? `${user.login.slice(0, 15)}...`
                      : user.login}
                  </NavLink>
                  <button
                    className={cn("btn-reset", style.header__btnLogout)}
                    onClick={() =>
                      setShowModals((old) => ({ ...old, exit: true }))
                    }
                  >
                    <SvgIcon name={"logout"} />
                  </button>
                </div>
                <div className={style.header__notificationWrapper}>
                  <button
                    className={cn(
                      "btn-reset",
                      style.header__btnNotifications,
                      notifications.length ? style.btnActiveNotifications : ""
                    )}
                    onClick={() =>
                      setShowModals((old) => ({ ...old, notification: true }))
                    }
                  >
                    <SvgIcon name={"notifications"} />
                  </button>
                  {showModals.notification
                    ? createPortal(
                        <ModalNotifications
                          view={showModals}
                          setView={setShowModals}
                          notifyPos={notifyPos}
                          notifications={notifications}
                        />,
                        document.body
                      )
                    : ""}
                </div>
              </>
            ) : (
              <button
                className={cn(
                  "btn-reset",
                  styleBtns.btnWhite,
                  style.header__btnLogin
                )}
                onClick={() =>
                  setShowModals((old) => ({ ...old, login: true }))
                }
              >
                {t("signIn")}
              </button>
            )
          ) : (
            <>
              <button className={cn("btn-reset", style.header__btnAdmin)}>
                admin kit
              </button>
              <div className={style.header__notificationWrapper}>
                <button
                  className={cn("btn-reset", style.header__btnNotifications)}
                  onClick={() =>
                    setShowModals((old) => ({ ...old, notification: true }))
                  }
                >
                  <SvgIcon name={"notifications"} />
                </button>
              </div>
            </>
          )}
          <button
            className={cn("btn-reset", style.header__langChange)}
            ref={langRef}
            onClick={() => changeLanguage(i18n.language === "ru" ? "en" : "ru")}
          >
            {t("lang")}
          </button>
        </div>
      </div>
      {showModals.login && (
        <ModalLogin
          view={showModals}
          setView={setShowModals}
          isAuth={user.isAuth}
        />
      )}
      {showModals.auth && (
        <ModalRegistration view={showModals} setView={setShowModals} />
      )}
      {showModals.forgot && (
        <ModalForgot view={showModals} setView={setShowModals} />
      )}
      {showModals.exit && (
        <ModalExit
          view={showModals}
          setView={setShowModals}
          isAuth={user.isAuth}
        />
      )}
      {showModals.achieve && currentAchieve && (
        <Achieve
          view={showModals}
          setView={setShowModals}
          achieve={currentAchieve}
        />
      )}
      {showModals.reset && (
        <ModalResetPassword view={showModals} setView={setShowModals} />
      )}
    </header>
  );
};
