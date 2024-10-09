import {
  ChangeEvent,
  FC,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import style from "./RangeSlider.module.scss";
import { TTariff } from "types/cards.types";
import { useTranslation } from "react-i18next";

type ValueType = {
  min: number;
  max: number;
};

type TProps = {
  name: string;
  tariffValue: TTariff[];
  value: ValueType;
  setValue: any;
  min: number;
  max: number;
  step: number;
  onChange: (value: ValueType) => void;
  setTouchTariff: (touch: boolean) => void;
  disabled?: boolean;
};

export const RangeSlider: FC<TProps> = forwardRef<HTMLInputElement, TProps>(
  (
    {
      name,
      tariffValue,
      value,
      setValue,
      min,
      max,
      step,
      onChange,
      setTouchTariff,
      disabled,
    },
    ref
  ) => {
    const {t} = useTranslation()

		const [minValue, setMinValue] = useState(value ? value.min : min);
    const [maxValue, setMaxValue] = useState(value ? value.max : max);
		
    useEffect(() => {
      const changeRangeValue = () => {
        if (value) {
          setMinValue(value.min);
          setMaxValue(value.max);
          setValue("tariff", value.min);
        }
      };

      changeRangeValue();
    }, [setValue, value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const newMinVal = Math.min(+e.target.value, maxValue - step);
      if (!value) setMinValue(newMinVal);

      onChange({ min: newMinVal, max: maxValue });
      setTouchTariff(true);
    };

    const pos = useMemo(() => {
      if (minValue) {
        return ((minValue - min) / (max - min)) * 100;
      }
      return 0;
    }, [max, min, minValue]);

    return (
      <div
        className={style.rangeSlider__sliderWrapper}
        style={disabled ? { userSelect: "none", pointerEvents: "none" } : {}}
      >
        <span
          className={style.rangeSlider__textCoins}
          style={
            pos > 25
              ? {
                  left: `${pos}%`,
                  transform: `translate(calc(-40%/${step}), 0)`,
                }
              : { left: `${pos}%` }
          }
        >
          {`${
            tariffValue.find((tariff) => tariff.period === minValue)?.scicoins
          } `}
          SCICOIN
        </span>
        <div className={style.rangeSlider__inputWrapper}>
          <input
            name={name}
            ref={ref}
            type="range"
            value={minValue}
            min={min}
            max={max}
            step={step}
            className={style.rangeSlider__input}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        <span
          className={style.rangeSlider__textMonth}
          style={
            pos > 25
              ? {
                  left: `${pos}%`,
                  transform: `translate(calc(-40%/${step}), 0)`,
                }
              : { left: `${pos}%` }
          }
        >
          {minValue === 0
            ? t("exchange_card")
            : `${minValue} ${
                (minValue === 1 && t("month.1")) ||
                (minValue < 5 && t("month.2")) ||
                (minValue >= 5 && t("month.3"))
              }`}
        </span>
        <div
          className={style.rangeSlider__controlWrapper}
          style={disabled ? { opacity: "0.5" } : {}}
        >
          <div
            className={style.rangeSlider__control}
            style={
              pos > 50
                ? { left: `${pos}%`, backgroundColor: "#1A4666" }
                : { left: `${pos}%` }
            }
          />
          <div className={style.rangeSlider__rail} />
        </div>
      </div>
    );
  }
);
