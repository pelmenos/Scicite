import { FC, useEffect } from "react";
import style from "./InteractionHelp.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store/store";
import { HelpRow } from "entities/rows/HelpRow/HelpRow";
import { requestHelpList, resetHelpList } from "store/admin/adminSlice";
import {
  getHelpList,
  getHelpListCurrentPage,
  getHelpListNextPage,
  getIsFetching,
} from "store/admin/adminSelector";

type TProps = {
  currentSearchValue: string;
  setCurrentSubSection: (num: number) => void;
  setCurrentMainSection: (num: number) => void;
};

export const InteractionHelp: FC<TProps> = ({
  currentSearchValue,
  setCurrentMainSection,
  setCurrentSubSection,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const isFetching = useSelector(getIsFetching);
  const currentPage = useSelector(getHelpListCurrentPage);
  const nextPage = useSelector(getHelpListNextPage);
  const helpList = useSelector(getHelpList);

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(resetHelpList());
      dispatch(
        requestHelpList({
          page: 1,
          filter_login: currentSearchValue,
        })
      );
    });

    return () => clearTimeout(debounce);
  }, [currentSearchValue, dispatch]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const containerHeight = e.currentTarget.clientHeight;
    const scrollHeight = e.currentTarget.scrollHeight;

    const scrollTop = e.currentTarget.scrollTop;
    if (
      scrollHeight - (scrollTop + containerHeight) < 100 &&
      nextPage &&
      !isFetching
    ) {
      dispatch(
        requestHelpList({
          page: currentPage + 1,
          filter_login: currentSearchValue,
        })
      );
    }
  };

  const HelpRows = helpList.map((help) => (
    <HelpRow
      key={help.id}
      help={help}
      setCurrentSubSection={setCurrentSubSection}
      setCurrentMainSection={setCurrentMainSection}
    />
  ));

  return (
    <>
      <div className={style.table}>
        <div className={style.mainRow}>
          <span className={style.colTitle}>имя пользователя</span>
          <span className={style.colTitle}>Дата регистрации</span>
          <span className={style.colTitle}>время сообщения</span>
          <span className={style.colTitle}>карточек выставлено</span>
          <span className={style.colTitle}>откликов выполнено</span>
          <span className={style.colTitle}>чат</span>
        </div>
        <div className={style.list} onScroll={scrollHandler}>
          {HelpRows}
        </div>
      </div>
    </>
  );
};
