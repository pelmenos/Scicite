import { AdminCard } from "entities/cards/AdminCard/AdminCard";
import { FC, useEffect, useState } from "react";
import style from "./TapeCards.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsFetching,
  getSearchCards,
  getSearchCurrentPage,
  getSearchNextPage,
} from "store/cards/cardsSelector";
import { AppDispatch } from "store/store";
import { requestSearchCards, resetSearchCards } from "store/cards/cardsSlice";
import cn from "classnames";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { SearchFilter } from "features/filters/SearchFilter/SearchFilter";
import { SubmitHandler, useForm } from "react-hook-form";
import { getUserId } from "store/user/userSelector";
import { getSettings } from "store/admin/adminSelector";

type TProps = {
  currentParam: string;
};

interface SearchFormInput {
  search: string;
}

export const TapeCards: FC<TProps> = ({ currentParam }) => {
  const dispatch: AppDispatch = useDispatch();
  const cards = useSelector(getSearchCards);
  const userId = useSelector(getUserId);
  const isFetching = useSelector(getIsFetching);
  const nextPage = useSelector(getSearchNextPage);
  const currentPage = useSelector(getSearchCurrentPage);
  const { price_publication } = { ...useSelector(getSettings) };

  const [currentFilterCategory, setCurrentFilterCategory] = useState<string[]>(
    []
  );
  const [currentFilterBase, setCurrentFilterBase] = useState<string[]>([]);
  const [currentSearchValue, setCurrentSearchValue] = useState<string>("");

  const [filterView, setFilterView] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (userId) {
        dispatch(resetSearchCards());
        dispatch(
          requestSearchCards({
            user: currentParam,
            base: currentFilterBase,
            tariff: null,
            theme: "",
            is_active: null,
            is_exchangable: null,
            article: "",
            category: currentFilterCategory,
            ordering: "",
            search: currentSearchValue,
            page: 1,
          })
        );
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [
    currentFilterBase,
    currentFilterCategory,
    currentParam,
    currentSearchValue,
    dispatch,
    userId,
  ]);

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
        requestSearchCards({
          user: currentParam,
          base: currentFilterBase,
          tariff: null,
          theme: "",
          is_active: null,
          is_exchangable: null,
          article: "",
          category: currentFilterCategory,
          ordering: "",
          search: currentSearchValue,
          page: currentPage + 1,
        })
      );
    }
  };

  const { register, handleSubmit } = useForm<SearchFormInput>();

  const onSubmit: SubmitHandler<SearchFormInput> = (data) => {
    setCurrentSearchValue(data.search);
  };

  const CardsArray = cards.map((card) => (
    <AdminCard key={card.id} card={card} cardPrice={price_publication} />
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
        <form className={style.search} onSubmit={handleSubmit(onSubmit)}>
          <input
            className={cn("input-reset", style.searchField)}
            placeholder={"КЛЮЧЕВЫЕ СЛОВА / НОМЕР КАРТОЧКИ"}
            onChange={(e) => setCurrentSearchValue(e.target.value)}
          />
          <button className={cn("btn-reset", style.searchBtn)} type="button">
            <SvgIcon name="search" />
          </button>
        </form>
      </div>
      <div className={style.list} onScroll={scrollHandler}>
        {CardsArray}
      </div>
    </>
  );
};
