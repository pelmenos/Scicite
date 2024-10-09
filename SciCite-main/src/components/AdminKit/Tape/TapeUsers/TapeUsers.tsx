import { FC, useEffect, useState } from "react";
import style from "./TapeUsers.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store/store";
import { SearchFilter } from "features/filters/SearchFilter/SearchFilter";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import cn from "classnames";
import { UsersRow } from "entities/rows/UsersRow/UsersRow";
import { requestUsersList, resetUsersList } from "store/admin/adminSlice";
import {
    getIsFetching,
    getUsersList,
    getUsersListCurrentPage,
    getUsersListNextPage,
} from "store/admin/adminSelector";

type TProps = {
  setCurrentSubSection: (num: number) => void;
  setCurrentParam: (param: string) => void;
};

export const TapeUsers: FC<TProps> = ({
  setCurrentSubSection,
  setCurrentParam,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const isFetching = useSelector(getIsFetching);
  const currentPage = useSelector(getUsersListCurrentPage);
  const nextPage = useSelector(getUsersListNextPage);
  const users = useSelector(getUsersList);

  const [currentFilterCategory, setCurrentFilterCategory] = useState<string[]>(
    []
  );
  const [currentFilterBase, setCurrentFilterBase] = useState<string[]>([]);
  const [currentSearchValue, setCurrentSearchValue] = useState<string>("");

  const [filterView, setFilterView] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(resetUsersList());
      dispatch(
        requestUsersList({
          page: 1,
          filter_login: currentSearchValue,
        })
      );
    }, 300);
    return () => clearTimeout(debounce)
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
        requestUsersList({
          page: currentPage + 1,
          filter_login: currentSearchValue,
        })
      );
    }
  };

  const UsersRows = users?.map((user) => (
    <UsersRow
      key={user.id}
      user={user}
      setCurrentSubSection={setCurrentSubSection}
      setCurrentParam={setCurrentParam}
    />
  ));

  return (
    <>
      <div className={style.top}>
        <div className={style.filterWrapper}>
          <button
            className={cn("btn-reset", style.filterBtn)}
            onClick={() => setFilterView(true)}
          >
            <span>Фильтры</span>
            <SvgIcon name="arrowRight" />
          </button>
          <div
            className={style.filterOverlay}
            style={filterView ? {} : { display: "none" }}
            onClick={() => setFilterView(false)}
          ></div>
          <SearchFilter
            searchFilterView={filterView}
            setSearchFilterView={setFilterView}
            currentFilterCategory={currentFilterCategory}
            setCurrentFilterCategory={setCurrentFilterCategory}
            currentFilterBase={currentFilterBase}
            setCurrentFilterBase={setCurrentFilterBase}
            ishiddenCheckBox
          />
        </div>
        <form className={style.search}>
          <input
            className={cn("input-reset", style.searchField)}
            placeholder={"имя пользователя"}
            onChange={(e) => setCurrentSearchValue(e.target.value)}
          />
          <button className={cn("btn-reset", style.searchBtn)} type="button">
            <SvgIcon name="search" />
          </button>
        </form>
      </div>
      <div className={style.table}>
        <div className={style.mainRow}>
          <span className={style.colTitle}>имя пользователя</span>
          <span className={style.colTitle}>Дата регистрации</span>
          <span className={style.colTitle}>заработано scicoins</span>
          <span className={style.colTitle}>scicoins На счету</span>
          <span className={style.colTitle}>карточек выставлено</span>
          <span className={style.colTitle}>откликов выполнено</span>
        </div>
        <div className={style.list} onScroll={scrollHandler}>
          {UsersRows}
        </div>
      </div>
    </>
  );
};
