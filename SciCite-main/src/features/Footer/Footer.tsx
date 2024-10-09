import { FC, useState } from "react";
import cn from "classnames";
import navStyle from "assets/scss/nav.module.scss";
import style from "./Footer.module.scss";
import { NavLink } from "react-router-dom";
import logo from "assets/img/svg/logo.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { TToggleOBj } from "shared/Functions";
import { ModalSupport } from "components/Modals/Support/ModalSupport";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { emailSubscriber } from "store/user/usersSlice";
import { emailPattern } from "shared/Patterns";

import termsUse from "./termsUse.pdf";
import privatePolicy from "./termsUse.pdf";
import { useTranslation } from "react-i18next";

export interface FooterFormInput {
  email: string;
}

export const Footer: FC = () => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const [showModals, setShowModals] = useState<TToggleOBj>({
    support: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FooterFormInput>();
  const onSubmit: SubmitHandler<FooterFormInput> = (data) => {
    dispatch(emailSubscriber(data.email));
  };

  return (
    <footer className={style.footer}>
      <div className={cn("container", style.footer__container)}>
        <div className={style.footer__left}>
          <NavLink to={"/"} className={style.footer__logo}>
            <img src={logo} alt={"logo"} />
          </NavLink>
          <ul className={cn("list-reset", style.footer__socialList)}>
            <li className={style.footer__socialItem}>
              <NavLink
                to={"https://habr.com/ru/users/d_bratskikh/posts/"}
                className={style.footer__link}
              >
                <SvgIcon name="habr" addStyles={style.footer__linkIcon} />
              </NavLink>
            </li>
            <li className={style.footer__socialItem}>
              <NavLink
                to={"https://t.me/SciArticleChannel"}
                className={style.footer__link}
              >
                <SvgIcon name="telegram" addStyles={style.footer__linkIcon} />
              </NavLink>
            </li>
          </ul>
        </div>
        <nav className={cn(navStyle.nav, style.footer__nav)}>
          <ul
            className={cn(
              "list-reset",
              navStyle.nav__list,
              style.footer__navList
            )}
          >
            <li className={cn(navStyle.nav__item, style.footer__navItem)}>
              <a
                href={termsUse}
                rel="noreferrer"
                target="_blank"
                className={cn("a", navStyle.nav__link, style.footer__navLink)}
              >
                {t("footer_user_policy")}
              </a>
            </li>
            <li className={cn(navStyle.nav__item, style.footer__navItem)}>
              <a
                href={privatePolicy}
                target="_blank"
                className={cn("a", navStyle.nav__link, style.footer__navLink)}
                rel="noreferrer"
              >
                {t("footer_policy")}
              </a>
            </li>
            <li className={cn(navStyle.nav__item, style.footer__navItem)}>
              <button
                title="служба  поддержки"
                className={cn(
                  "btn-reset",
                  navStyle.nav__link,
                  style.footer__navLink
                )}
                onClick={() =>
                  setShowModals((old) => ({ ...old, support: true }))
                }
              >
                {t("support")}
              </button>
            </li>
          </ul>
        </nav>
        <div className={style.footer__right}>
          <p className={style.footer__news}>{t("newsletter")}</p>
          <form
            className={style.footer__form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                className={cn("input-reset", style.footer__field)}
                placeholder={t("enter_email")}
                {...register("email", {
                  required: {
                    value: true,
                    message: t("enter_email"),
                  },
                  pattern: emailPattern,
                })}
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <button
              className={cn("btn-reset", style.footer__btnSub)}
              type="submit"
            >
              {t("subscription")}
            </button>
          </form>
        </div>
      </div>
      {showModals.support && (
        <ModalSupport view={showModals} setView={setShowModals} />
      )}
    </footer>
  );
};
