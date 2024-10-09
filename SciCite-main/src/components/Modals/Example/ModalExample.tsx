import { FC, useState } from "react";
import cn from "classnames";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalExample.module.scss";
import example1 from "assets/img/example-1.png";
import example2 from "assets/img/example-2.png";
import example3 from "assets/img/example-3.png";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalExample: FC<TProps> = ({ view, setView }) => {
  const { t } = useTranslation();
  const [addClass, setAddClass] = useState(true);

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={"example"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <div className={style.modalExample}>
        <div className={style.info}>
          <p className={style.title}>{t("example_modal.1")}</p>
          <ul className={cn("list-reset", style.exampleList)}>
            <li className={style.exampleItem}>
              <img src={example1} alt={"example"} />
              <p className={style.titleImg}>{t("example_modal.2")}</p>
            </li>
            <li className={style.exampleItem}>
              <img src={example2} alt={"example"} />
              <p className={style.titleImg}>{t("example_modal.3")}</p>
            </li>
            <li className={style.exampleItem}>
              <img src={example3} alt={"example"} />
              <p className={style.titleImg}>{t("example_modal.4")}</p>
            </li>
          </ul>
        </div>
        <button
          className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
          onClick={() => removeModals(setAddClass, setView, view, "example")}
        >
          {t("close")}
        </button>
      </div>
    </ModalWrapper>
  );
};
