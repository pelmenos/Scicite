import { FC, useEffect, useState } from "react";
import cn from "classnames";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalChoiceBarter.module.scss";
import { ModalBarterItem } from "../../../entities/cards/BarterItem/ModalBarterItem";
import { ModalCreateCard } from "../CreateCard/ModalCreateCard";
import { MobileCreateCard } from "../mobile/CreateCard/MobileCreateCard";
import { TToggleOBj, removeModals } from "shared/Functions";
import useWindow from "shared/CustomHooks";
import { useDispatch, useSelector } from "react-redux";
import { getUserCards } from "store/cards/cardsSelector";
import { AppDispatch } from "store/store";
import { requestUserCards, resetUserCards } from "store/cards/cardsSlice";
import { getUserId } from "store/user/userSelector";
import {
    createOffer,
    requestOffers,
    resetOffers,
    setErrors,
} from "store/offers/offersSlice";
import { TCard } from "types/cards.types";
import { getErrors, getOffers } from "store/offers/offersSelector";
import { getSettings } from "store/admin/adminSelector";
import { t } from "i18next";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";

type TProps = {
  message: TToggleOBj;
  setMessage: (toggle: TToggleOBj) => void;
  setClass: (toggle: boolean) => void;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  searchCard: TCard;
  statusId: string;
};

export const ModalChoiceBarter: FC<TProps> = ({
  message,
  setMessage,
  setClass,
  view,
  setView,
  searchCard,
  statusId,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const cards = useSelector(getUserCards);
  const userId = useSelector(getUserId);
  const err = useSelector(getErrors);
  const offers = useSelector(getOffers);
  const { price_publication } = { ...useSelector(getSettings) };

  const isMobile = useWindow();
  const [selectedCard, setSelectedCard] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [showModals, setShowModals] = useState<TToggleOBj>({
    create: false,
  });

  useEffect(() => {
    const requestData = () => {
      dispatch(resetOffers());
      dispatch(
        requestOffers({
          page: 1,
          card_id: searchCard.id,
          perfomer_id: userId,
          is_evidence: null,
          search: "",
          status_customer__id: "",
          status_executor__id: "",
        })
      );
      dispatch(resetUserCards());
      dispatch(
        requestUserCards({
          user: userId,
          base: null,
          tariff: null,
          category: null,
          theme: "",
          is_exchangable: null,
          is_active: true,
          article: "",
          search: "",
          page: 1,
          ordering: "",
        })
      );
    };

    requestData();
  }, [dispatch, searchCard.id, userId]);

  const createBarter = async () => {
    if (selectedCard) {
      if (err !== null) {
        dispatch(setErrors(null));
      }
      await dispatch(
        createOffer({
          card: searchCard.id,
          perfomer: userId,
          status_executor: statusId,
          barter_is: true,
          barter: selectedCard,
        })
      );
      setIsSubmit(true);
    }
  };

  useEffect(() => {
    const afterSubmit = () => {
      if (err === null && isSubmit) {
        setMessage({ ...message, addCard: true });
      } else if (err !== null && isSubmit) {
        setMessage({ ...message, message: true });
      }
    };

    afterSubmit();
    setIsSubmit(false);
  }, [err, isSubmit, message, setMessage]);

  const BarterItems = cards.map((card) => (
    <ModalBarterItem
      key={card.id}
      card={card}
      selectedCard={selectedCard}
      setSelectedCard={setSelectedCard}
      cardPrice={price_publication}
      hidden={
        offers.find((offer) => offer.barter?.id === card.id) ? true : false
      }
    />
  ));

  return (
    <div
      className={cn(
        style.modalChoiceBarter,
        !message.addCard ? style.viewModal : style.hiddenModal
      )}
      style={message.addCard ? { visibility: "hidden" } : {}}
    >
      <div className={style.modalChoiceBarter__top}>
        <p className={style.modalChoiceBarter__title}>{t("barter_title")}</p>
      </div>
      <p className={style.modalChoiceBarter__titleMob}>
        {t("barter_subtitle")}
      </p>
      <div className={style.modalChoiceBarter__barterList}>{BarterItems}</div>
      <div className={style.modalChoiceBarter__btnsBlock}>
        <button
          className={cn(
            "btn-reset",
            styleBtns.btnAstral,
            style.modalChoiceBarter__btnCreateCard
          )}
          onClick={() => setShowModals((old) => ({ ...old, create: true }))}
        >
          <SvgIcon name="plus" />
          {t("create_card")}
        </button>
        <button
          className={cn(
            "btn-reset",
            styleBtns.btnAstral,
            style.modalChoiceBarter__btn
          )}
          onClick={createBarter}
        >
          {t("confirm")}
        </button>
        <button
          className={cn(
            "btn-reset",
            styleBtns.btnAstral,
            style.modalChoiceBarter__btn
          )}
          onClick={() => removeModals(setClass, setView, view, "detail")}
        >
          {t("cancel")}
        </button>
      </div>
      {showModals.create ? (
        isMobile ? (
          <MobileCreateCard view={showModals} setView={setShowModals} />
        ) : (
          <ModalCreateCard view={showModals} setView={setShowModals} barter />
        )
      ) : (
        ""
      )}
    </div>
  );
};
