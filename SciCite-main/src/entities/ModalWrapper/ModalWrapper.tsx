import { FC, ReactNode } from "react";
import cn from "classnames";
import { Portal } from "entities/Portal/Portal";
import { TToggleOBj, removeModals } from "shared/Functions";
import style from "./ModalWrapper.module.scss";

type TModalProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  addClass: boolean;
  setAddClass: (toggle: boolean) => void;
  changeEl: string;
  children: ReactNode;
  smooth?: boolean;
};

export const ModalWrapper: FC<TModalProps> = ({
  view,
  setView,
  changeEl,
  children,
  addClass,
  setAddClass,
  smooth,
}) => {
  if (!view[changeEl]) return null;

  return (
    <Portal>
      <div
        className={cn(
          style.substrate,
          addClass
            ? !smooth
              ? style.view
              : style.viewModal
            : !smooth
            ? style.hidden
            : style.hiddenModal
        )}
      >
        <div
          className={style.overlay}
          onClick={() => removeModals(setAddClass, setView, view, changeEl)}
        />
        {children}
      </div>
    </Portal>
  );
};
