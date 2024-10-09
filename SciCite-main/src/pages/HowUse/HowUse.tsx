import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./HowUse.module.scss";
import cn from "classnames";
import { ModalHowUse } from "../../components/Modals/NavHowUse/ModalHowUse";
import useWindow from "../../shared/CustomHooks";
import { BtnsHelp } from "shared/ui/BtnsHelp/BtnsHelp";
import { useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authSelector";
import { Image } from "shared/ui/Image/Image";
import { useTranslation } from "react-i18next";

const HowUse: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({
  setFooterVisible,
}) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setFooterVisible(true);
  }, [setFooterVisible]);

  const isMobile = useWindow();
  const isAuth = useSelector(getIsAuth);

  const [currentBlock, setCurrentBlock] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const listRef = useRef<null | HTMLDivElement>(null);
  const citationRef = useRef<null | HTMLDivElement>(null);
  const createRef = useRef<null | HTMLDivElement>(null);
  const barterRef = useRef<null | HTMLDivElement>(null);
  const scicoinsRef = useRef<null | HTMLDivElement>(null);

  const scrollToSection = (ref: MutableRefObject<HTMLDivElement | null>) => {
    let heightNav = 106;
    if (window.innerWidth > 1860) {
      heightNav = 169;
    } else if (window.innerWidth > 1640) {
      heightNav = 157;
    } else if (window.innerWidth > 1430) {
      heightNav = 152;
    } else if (window.innerWidth > 1205) {
      heightNav = 125;
    } else if (window.innerWidth > 950) {
      heightNav = 94;
    }
    const topPos = ref.current?.offsetTop;
    if (topPos && listRef.current) {
      listRef.current.scrollTo({
        top: topPos - heightNav,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className={style.howUse}>
      <div className={style.howUse__top}>
        {showModal && (
          <ModalHowUse
            setShow={setShowModal}
            scroll={scrollToSection}
            citationRef={citationRef}
            createRef={createRef}
            barterRef={barterRef}
            scicoinsRef={scicoinsRef}
          />
        )}
        {isMobile ? (
          <button
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.howUse__btnModal
            )}
            onClick={() => setShowModal(true)}
          >
            {t("block")}
          </button>
        ) : (
          <>
            <button
              className={cn(
                "btn-reset",
                style.howUse__btnToogle,
                currentBlock === 1 ? style.btn_active : ""
              )}
              onClick={() => {
                setCurrentBlock(1);
                scrollToSection(citationRef);
              }}
            >
              {t("citation")}
            </button>
            <button
              className={cn(
                "btn-reset",
                style.howUse__btnToogle,
                currentBlock === 2 ? style.btn_active : ""
              )}
              onClick={() => {
                setCurrentBlock(2);
                scrollToSection(createRef);
              }}
            >
              {t("creating_card")}
            </button>
            <button
              className={cn(
                "btn-reset",
                style.howUse__btnToogle,
                currentBlock === 3 ? style.btn_active : ""
              )}
              onClick={() => {
                setCurrentBlock(3);
                scrollToSection(barterRef);
              }}
            >
              {t("barter")}
            </button>
            <button
              className={cn(
                "btn-reset",
                style.howUse__btnToogle,
                currentBlock === 4 ? style.btn_active : ""
              )}
              onClick={() => {
                setCurrentBlock(4);
                scrollToSection(scicoinsRef);
              }}
            >
              scicoins
            </button>
          </>
        )}
      </div>
      <div className={cn("container", style.howUse__container)}>
        <div ref={listRef} className={style.howUse__infoList}>
          <div ref={citationRef} className={style.howUse__infoItem}>
            <p className={style.howUse__itemTitle}>{t("citation")}</p>
            {isMobile ? (
              <>
                <Image name={`howUseMob-1`} />
                <Image name={`howUseMob-2`} />
                <Image name={`howUseMob-3`} />
                <Image name={`howUseMob-4`} />
                <Image name={`howUseMob-5`} />
                <Image name={`howUseMob-6`} />
                <div className={style.howUse__itemBottom} />
              </>
            ) : (
              <>
                <Image
                  name={`howUse-1${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-2${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-3${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-4${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-5${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-6${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-7${i18n.language === "en" ? "_en" : ""}`}
                />
              </>
            )}
          </div>
          <div ref={createRef} className={style.howUse__infoItem}>
            <p className={style.howUse__itemTitle}>{t("creating_card")}</p>
            {isMobile ? (
              <>
                <Image name="howUseMob-7" />
                <Image name="howUseMob-8" />
                <Image name="howUseMob-9" />
                <div className={style.howUse__itemBottom} />
              </>
            ) : (
              <>
                <Image
                  name={`howUse-8${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-9${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-10${i18n.language === "en" ? "_en" : ""}`}
                />
              </>
            )}
          </div>
          <div ref={barterRef} className={style.howUse__infoItem}>
            <p className={style.howUse__itemTitle}>{t("barter")}</p>
            {isMobile ? (
              <>
                <Image name="howUseMob-10" />
                <Image name="howUseMob-11" />
                <Image name="howUseMob-12" />
                <Image name="howUseMob-13" />
                <Image name="howUseMob-14" />
                <Image name="howUseMob-15" />
                <Image name="howUseMob-16" />
                <Image name="howUseMob-17" />
                <div className={style.howUse__itemBottom} />
              </>
            ) : (
              <>
                <Image
                  name={`howUse-11${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-12${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-13${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-14${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-15${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-16${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-17${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-18${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-19${i18n.language === "en" ? "_en" : ""}`}
                />
              </>
            )}
          </div>
          <div ref={scicoinsRef} className={style.howUse__infoItem}>
            <p className={style.howUse__itemTitle}>scicoins</p>
            {isMobile ? (
              <>
                <Image name="howUseMob-18" />
                <Image name="howUseMob-19" />
                {/* <Image name="howUseMob-20" /> */}
              </>
            ) : (
              <>
                <Image
                  name={`howUse-20${i18n.language === "en" ? "_en" : ""}`}
                />
                <Image
                  name={`howUse-21${i18n.language === "en" ? "_en" : ""}`}
                />
                {/* <Image name="howUse-22" /> */}
              </>
            )}
          </div>
        </div>
      </div>
      {isAuth ? <BtnsHelp /> : ""}
    </main>
  );
};

export default HowUse;
