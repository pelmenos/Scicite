import { FC, MutableRefObject, useState } from "react";
import cn from "classnames";
import style from "./ModalHowUse.module.scss";
import { removeModal } from "shared/Functions";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type TProps = {
  setShow: (toggle: boolean) => void;
  scroll: (ref: MutableRefObject<HTMLDivElement | null>) => void;
  citationRef: MutableRefObject<HTMLDivElement | null>;
  createRef: MutableRefObject<HTMLDivElement | null>;
  barterRef: MutableRefObject<HTMLDivElement | null>;
  scicoinsRef: MutableRefObject<HTMLDivElement | null>;
};

export const ModalHowUse: FC<TProps> = ({
  citationRef,
  barterRef,
  createRef,
  scicoinsRef,
  setShow,
  scroll,
}) => {
    const { t } = useTranslation()
  const [addClass, setAddClass] = useState(true);

  const deleteModal = (ref?: MutableRefObject<HTMLDivElement | null>) => {
    removeModal(setAddClass, setShow);
    if (ref) {
      scroll(ref);
    }
  };

  return (
    <div className={cn(style.substrate, addClass ? style.view : style.hidden)}>
      <div className={style.overlay} onClick={() => deleteModal()} />
      <div className={style.modal}>
        <p className={style.title}>{t("response_status")}</p>
        <ul className={cn("list-reset", style.list)}>
          <li className={style.item}>
            <Link
              to="#citation"
              className={cn("a", style.link)}
              onClick={() => deleteModal(citationRef)}
            >
              {t("citation")}
            </Link>
          </li>
          <li className={style.item}>
            <Link
              to="#create"
              className={cn("a", style.link)}
              onClick={() => deleteModal(createRef)}
            >
              {t("creating_card")}
            </Link>
          </li>
          <li className={style.item}>
            <Link
              to="#barter"
              className={cn("a", style.link)}
              onClick={() => deleteModal(barterRef)}
            >
              {t("barter")}
            </Link>
          </li>
          <li className={style.item}>
            <Link
              to="#scicoins"
              className={cn("a", style.link)}
              onClick={() => deleteModal(scicoinsRef)}
            >
              scicoins
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
