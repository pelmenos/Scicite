import cn from "classnames";
import { FC, useEffect, useState } from "react";
import useWindow from "shared/CustomHooks";
import { TToggleOBj } from "shared/Functions";
import style from "./BtnsHelp.module.scss";
import { MobileCreateCard } from "components/Modals/mobile/CreateCard/MobileCreateCard";
import { ModalCreateCard } from "components/Modals/CreateCard/ModalCreateCard";
import { ModalSupport } from "components/Modals/Support/ModalSupport";
import { useLocation } from "react-router-dom";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { useTranslation } from "react-i18next";

type TProps = {
  onlyHelp?: boolean;
};

export const BtnsHelp: FC<TProps> = ({ onlyHelp }) => {
  const { t } = useTranslation();

  const isMobile = useWindow();
  const [showModals, setShowModals] = useState<TToggleOBj>({
    create: false,
    support: false,
  });
  const location = useLocation();
  const [isHowUse, setIsHowUse] = useState(false);
  const [pos, setPos] = useState<number>();
  useEffect(() => {
    if (location.pathname === "/howuse") {
      setIsHowUse(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight -
          (window.innerWidth > 1860
            ? 135
            : window.innerWidth > 1640
            ? 118
            : window.innerWidth > 1430
            ? 109
            : window.innerWidth > 1205
            ? 92
            : window.innerWidth > 950
            ? 75
            : 135)
      ) {
        setPos(
          window.innerHeight +
            window.scrollY -
            document.body.offsetHeight +
            (window.innerWidth > 1860
              ? 135
              : window.innerWidth > 1640
              ? 118
              : window.innerWidth > 1430
              ? 109
              : window.innerWidth > 1205
              ? 92
              : window.innerWidth > 950
              ? 75
              : 135)
        );
      } else {
        setPos(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pos]);

  return (
    <>
      <button
        className={cn(
          "btn-reset",
          style.btnAddCard,
          isHowUse ? style.howUsePosBtnAdd : ""
        )}
        style={{
          display: onlyHelp ? "none" : "",
          bottom: `${pos}px`,
        }}
        onClick={() => setShowModals((old) => ({ ...old, create: true }))}
      >
        <SvgIcon name="plus" />
        <span>{t("create_card")}</span>
      </button>
      <button
        className={cn(
          "btn-reset",
          style.btnHelp,
          isHowUse ? style.howUsePosBtnHelp : ""
        )}
        style={{ bottom: `${pos}px` }}
        onClick={() => setShowModals((old) => ({ ...old, support: true }))}
      >
        <span>{t("support")}</span>
        <SvgIcon name="help" />
      </button>
      {showModals.create ? (
        isMobile ? (
          <MobileCreateCard view={showModals} setView={setShowModals} />
        ) : (
          <ModalCreateCard view={showModals} setView={setShowModals} />
        )
      ) : (
        ""
      )}
      {showModals.support && (
        <ModalSupport view={showModals} setView={setShowModals} />
      )}
    </>
  );
};
