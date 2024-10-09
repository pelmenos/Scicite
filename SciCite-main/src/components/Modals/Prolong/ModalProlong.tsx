import cn from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalProlong.module.scss";
import { RangeSlider } from "shared/ui/rangeSlider/RangeSlider";
import { useDispatch, useSelector } from "react-redux";
import { getErrors, getTariff } from "store/cards/cardsSelector";
import { useForm } from "react-hook-form";
import { AppDispatch } from "store/store";
import {
  prolongCard,
  requestUserCards,
  resetUserCards,
  setErrors,
} from "store/cards/cardsSlice";
import { getUserId } from "store/user/userSelector";
import { TCard, TTariff } from "types/cards.types";
import { getSettings } from "store/admin/adminSelector";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  card: TCard | undefined;
};

export const ModalProlong: FC<TProps> = ({ view, setView, card }) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const userId = useSelector(getUserId);
  const err = useSelector(getErrors);
  const [touchTariff, setTouchTariff] = useState<boolean>(false);
  const tariff = useSelector(getTariff);
  const settings = useSelector(getSettings);

  const [rangeValue, setRangeValue] = useState({
    min: card && settings ? settings.minimal_duration_card : 0,
    max: 13,
  });

  const sortTariffArr: TTariff[] = useMemo(() => {
    const arr = tariff
      ? structuredClone([...tariff].sort((a, b) => a.period - b.period))
      : [];
    if (settings) {
      for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        if (arr[i].period === 0) {
          arr[i].scicoins = 0;
        } else if (arr[i].period < settings.minimal_duration_card) {
          continue;
        } else if (arr[i].period < settings.discount.month) {
          if (
            card?.base.name.toLowerCase() === t("other") ||
            card?.base.name.toLowerCase() === t("vak")
          ) {
            sum =
              (settings.price_publication["вак"] /
                settings.minimal_duration_card) *
              arr[i].period;
            arr[i].scicoins = sum - (sum % 10);
          } else if (
            card?.base.name.toLowerCase() === "web of science" ||
            card?.base.name.toLowerCase() === "scopus"
          ) {
            sum =
              (settings.price_publication["scopus/wos"] /
                settings.minimal_duration_card) *
              arr[i].period;
            arr[i].scicoins = sum - (sum % 10);
          } else {
            sum =
              (settings.price_publication["ринц"] /
                settings.minimal_duration_card) *
              arr[i].period;
          }
        } else if (arr[i].period >= settings.discount.month) {
          if (
            card?.base.name.toLowerCase() === t("other") ||
            card?.base.name.toLowerCase() === t("vak")
          ) {
            sum =
              ((settings.price_publication["вак"] *
                ((100 - settings.discount.percent) / 100)) /
                settings.minimal_duration_card) *
                (arr[i].period - settings.discount.month) +
              (settings.price_publication["вак"] /
                settings.minimal_duration_card) *
                settings.discount.month;
          } else if (
            card?.base.name.toLowerCase() === "web of science" ||
            card?.base.name.toLowerCase() === "scopus"
          ) {
            sum =
              ((settings.price_publication["scopus/wos"] *
                ((100 - settings.discount.percent) / 100)) /
                settings.minimal_duration_card) *
                (arr[i].period - settings.discount.month) +
              (settings.price_publication["scopus/wos"] /
                settings.minimal_duration_card) *
                settings.discount.month;
          } else {
            sum =
              ((settings.price_publication["ринц"] *
                ((100 - settings.discount.percent) / 100)) /
                settings.minimal_duration_card) *
                (arr[i].period - settings.discount.month) +
              (settings.price_publication["ринц"] /
                settings.minimal_duration_card) *
                settings.discount.month;
          }
        }
        arr[i].scicoins = sum - (sum % 10);
      }
    }
    const newArr = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].period !== arr[i - 1].period) {
        newArr.push(arr[i]);
      }
    }
    if (settings) {
      newArr.splice(1, settings.minimal_duration_card - 1);
    }
    newArr.splice(11);
    return newArr;
  }, [tariff, card?.base.name]);

  const step = useMemo(() => {
    return settings?.minimal_duration_card &&
      rangeValue.min <= settings?.minimal_duration_card
      ? settings.minimal_duration_card
      : 1;
  }, [settings, rangeValue.min]);

  const [addClass, setAddClass] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ tariff: string }>();

  const onSubmit = handleSubmit(async (data) => {
    if (card && sortTariffArr) {
      if (err !== null) {
        dispatch(setErrors(null));
      }
      const currentTariff = sortTariffArr.find(
        (tariff) => tariff.period === +data.tariff
      )?.period;
      const period =
        (currentTariff ? currentTariff : 0) + card?.tariff.period ||
        sortTariffArr[0].period;
      await dispatch(prolongCard(card ? card.id : "", period));
      setIsSubmit(true);
    }
  });

  useEffect(() => {
    if (touchTariff) {
      const value = `${
        sortTariffArr.find((tariff) => tariff.period === rangeValue.min)?.period
      }`;
      setValue("tariff", value);
    }
  }, [rangeValue.min, setValue, sortTariffArr, touchTariff]);

  useEffect(() => {
    const closeModal = () => {
      if (err === null && isSubmit) {
        removeModals(setAddClass, setView, view, "prolong");
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
        dispatch(setErrors(null));
      }
    };

    closeModal();
    setIsSubmit(false);
  }, [dispatch, err, isSubmit]);

  const removeModal = () => {
    removeModals(setAddClass, setView, view, "prolong");
    dispatch(setErrors(null));
  };

  return (
    <div className={cn(style.substrate, addClass ? style.view : style.hidden)}>
      <div className={style.overlay} onClick={removeModal}/>
      <form className={style.modalProlong} onSubmit={onSubmit}>
        <div>
          <RangeSlider
            {...register("tariff", { required: true })}
            name={"tariff"}
            tariffValue={sortTariffArr}
            value={rangeValue}
            setValue={setValue}
            min={settings ? settings.minimal_duration_card : 0}
            max={13}
            step={step}
            onChange={setRangeValue}
            setTouchTariff={setTouchTariff}
          />
          {err?.message ? (
            <span className={style.errorText}>{err?.message}</span>
          ) : errors.tariff ? (
            <span className={style.errorText}>{errors.tariff.message}</span>
          ) : (
            ""
          )}
        </div>
        <button
          type="submit"
          className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
        >
          {t("prolong")}
        </button>
      </form>
    </div>
  );
};
