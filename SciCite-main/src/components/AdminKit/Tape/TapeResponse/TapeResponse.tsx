import { FC, useEffect, useState } from "react";
import style from "./TapeResponse.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store/store";
import { SearchFilter } from "features/filters/SearchFilter/SearchFilter";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import cn from "classnames";
import { ResponsesRow } from "entities/rows/ResponsesRow/ResponsesRow";
import { requestOffers, resetOffers } from "store/offers/offersSlice";
import {
    getIsFetching,
    getOffers,
    getOffersCurrentPage,
    getOffersNextPage,
} from "store/offers/offersSelector";


type TProps = {
  currentParam: string;
};

export const TapeResponse: FC<TProps> = ({ currentParam }) => {
  const dispatch: AppDispatch = useDispatch();
  const isFetching = useSelector(getIsFetching);
  const currentPage = useSelector(getOffersCurrentPage);
  const nextPage = useSelector(getOffersNextPage);
  const offers = useSelector(getOffers);

  const [currentFilterCategory, setCurrentFilterCategory] = useState<string[]>(
    []
  );
  const [currentFilterBase, setCurrentFilterBase] = useState<string[]>([]);
  const [currentSearchValue, setCurrentSearchValue] = useState<string>("");

  const [filterView, setFilterView] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(async () => {
        dispatch(resetOffers());
        dispatch(
          requestOffers({
            card_id: "",
            is_evidence: null,
            page: 1,
            perfomer_id: currentParam,
            search: currentSearchValue,
            status_executor__id: "",
            status_customer__id: "",
          })
        );
      }, 300)
  
      return () => clearTimeout(debounce)
  }, [currentParam, currentSearchValue, dispatch]);

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
        requestOffers({
          card_id: "",
          is_evidence: null,
          page: currentPage + 1,
          perfomer_id: currentParam,
          search: "",
          status_executor__id: "",
          status_customer__id: "",
        })
      );
    }
  };

  const ResponsesRows = offers.map((offer) => (
    <ResponsesRow key={offer.id} offer={offer} />
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
            placeholder={"КЛЮЧЕВЫЕ СЛОВА / НОМЕР КАРТОЧКИ"}
            onChange={(e) => setCurrentSearchValue(e.target.value)}
          />
          <button className={cn("btn-reset", style.searchBtn)} type="button">
            <SvgIcon name="search" />
          </button>
        </form>
      </div>
      <div className={style.table}>
        <div className={style.mainRow}>
          <span className={style.colTitle}>номер</span>
          <span className={style.colTitle}>исполнитель</span>
          <span className={style.colTitle}>заказчик</span>
          <span className={style.colTitle}>статус</span>
          <span className={style.colTitle}>время выполнения</span>
          <span className={style.colTitle}>номер карточки</span>
          <span className={style.colTitle}></span>
        </div>
        <div className={style.list} onScroll={scrollHandler}>
          {ResponsesRows}
        </div>
      </div>
    </>
  );
};
