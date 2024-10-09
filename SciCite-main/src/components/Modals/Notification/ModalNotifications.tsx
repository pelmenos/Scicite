import { FC, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import style from "./ModalNotifications.module.scss";
import cn from "classnames";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";
import useWindow from "shared/CustomHooks";
import { Link } from "react-router-dom";
import { deleteNotifications } from "store/user/usersSlice";
type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  notifyPos: number[] | [];
  notifications: any[];
};

export const ModalNotifications: FC<TProps> = ({
  view,
  setView,
  notifyPos,
  notifications,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const isMobile = useWindow();
  const [addClass, setAddClass] = useState(true);

  const handleClearNotifications = () => {
    dispatch(deleteNotifications());
    removeModals(setAddClass, setView, view, "notification");
  };

  return (
    <div
      className={cn(
        style.substrate,
        isMobile ? (addClass ? style.view : style.hidden) : ""
      )}
    >
      <div
        className={style.overlay}
        onClick={() => removeModals(setAddClass, setView, view, "notification")}
      />
      <div className={style.wrapper}>
        <div
          className={cn(
            style.modalNotifications,
            !isMobile ? (addClass ? style.view : style.hidden) : ""
          )}
          style={{ top: `${notifyPos[0]}px`, right: `${notifyPos[1]}px` }}
        >
          <button
            className={cn("btn-reset", style.btn)}
            onClick={handleClearNotifications}
          >
            очистить
          </button>
          <ul className={cn("list-reset", style.list)}>
            {notifications?.map((notification) =>
              notification.link ? (
                <Link
                  key={notification.id}
                  to={notification.link}
                  className={cn("a", style.item)}
                  onClick={() =>
                    removeModals(setAddClass, setView, view, "notification")
                  }
                >
                  {notification?.message}
                </Link>
              ) : (
                <li key={notification.id} className={style.item}>
                  {notification?.message}
                </li>
              )
            )}
          </ul>
        </div>
        <div className={style.line} />
      </div>
    </div>
  );
};
