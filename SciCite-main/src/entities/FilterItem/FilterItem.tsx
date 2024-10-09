import { CSSProperties, FC } from "react";
import cn from "classnames";
import style from "./FilterItem.module.scss";

type TProps = {
  name: string;
  label: string;
  value: string;
  addStyles?: CSSProperties;
  filterValues: string[] | string;
  setOnceFilterValue?: (arr: string) => void;
  setMultiFilterValue?: (arr: string[]) => void;
  setFilterLabels?: (arr: string[]) => void;
  filterLabels?: string[];
  ishiddenCheckBox?: boolean;
};

export const FilterItem: FC<TProps> = ({
  value,
  label,
  name,
  addStyles,
  filterValues,
  setMultiFilterValue,
  setOnceFilterValue,
  ishiddenCheckBox,
  setFilterLabels,
  filterLabels,
}) => {
  const handleChange = () => {
    if (typeof filterValues === "string") {
      if (setOnceFilterValue) {
        setOnceFilterValue(value);
      }
    } else {
      if (setMultiFilterValue) {
        if (filterValues.includes(value)) {
          setMultiFilterValue([
            ...filterValues.filter((item) => item !== value),
          ]);
          if (setFilterLabels && filterLabels) {
            setFilterLabels([...filterLabels.filter((item) => item !== label)]);
          }
        } else {
          setMultiFilterValue([...filterValues, value]);
          if (setFilterLabels && filterLabels) {
            setFilterLabels([...filterLabels, label]);
          }
        }
      }
    }
  };

  return (
    <label
      className={cn(
        style.itemWrapper,
        ishiddenCheckBox && filterValues.includes(value) && style.active
      )}
    >
      <input
        name={name}
        className={cn(
          "input-reset",
          style.item,
          ishiddenCheckBox ? "is-hidden" : ""
        )}
        type="checkbox"
        checked={filterValues.includes(value)}
        value={value}
        onChange={handleChange}
      />
      {label}
    </label>
  );
};
