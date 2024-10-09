import cn from "classnames";
import { FC, useEffect, useState } from "react";
import style from "./Search.module.scss";
import styleBtns from "assets/scss/btns.module.scss";
import icons from "assets/img/sprite.svg";
import { SearchList } from "components/Search/List/SearchList";
import { SearchCards } from "components/Search/Cards/SearchCards";
import { SearchFilter } from "features/filters/SearchFilter/SearchFilter";
import { BtnsHelp } from "shared/ui/BtnsHelp/BtnsHelp";
import { createPortal } from "react-dom";
import useWindow from "shared/CustomHooks";
import { AppDispatch } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import { requestSearchCards, resetSearchCards } from "store/cards/cardsSlice";
import {
  getSearchCards,
  getSearchCurrentPage,
  getIsFetching,
  getSearchNextPage,
  getTariff,
} from "store/cards/cardsSelector";
import { getIsAuth } from "store/auth/authSelector";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { getSettings } from "store/admin/adminSelector";
import { useTranslation } from "react-i18next";

const Search: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({
  setFooterVisible,
}) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const isAuth = useSelector(getIsAuth);
  const cards = useSelector(getSearchCards);
  const tariff = useSelector(getTariff);
  const isFetching = useSelector(getIsFetching);
  const nextPage = useSelector(getSearchNextPage);
  const currentPage = useSelector(getSearchCurrentPage);
  const { price_citation } = { ...useSelector(getSettings) };

  const isMobile = useWindow();
  const [currentFilterCategory, setCurrentFilterCategory] = useState<string[]>(
    []
  );
  const [currentFilterBase, setCurrentFilterBase] = useState<string[]>([]);
  const [currentSearchValue, setCurrentSearchValue] = useState<string>("");
  const [filterLabels, setFilterLabels] = useState<string[]>([]);

  const [listView, setListView] = useState(false);
  const [searchFilterView, setSearchFilterView] = useState(false);

  useEffect(() => {
    setFooterVisible(true);
  }, [setFooterVisible]);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (isAuth && tariff) {
        dispatch(resetSearchCards());
        await dispatch(
          requestSearchCards({
            user: "",
            base: currentFilterBase,
            tariff: [
              ...tariff
                ?.filter((tariff) => tariff.period !== 0)
                .map((tariff) => tariff.id),
            ],
            category: currentFilterCategory,
            theme: "",
            is_active: true,
            is_exchangable: null,
            article: "",
            search: currentSearchValue,
            page: 1,
            ordering: "",
          })
        );
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [
    dispatch,
    currentFilterBase,
    currentFilterCategory,
    currentSearchValue,
    isAuth,
    tariff,
  ]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const containerHeight = e.currentTarget.clientHeight;
    const scrollHeight = e.currentTarget.scrollHeight;

    const scrollTop = e.currentTarget.scrollTop;
    if (
      scrollHeight - (scrollTop + containerHeight) < 100 &&
      nextPage &&
      tariff &&
      !isFetching
    ) {
      dispatch(
        requestSearchCards({
          user: "",
          base: currentFilterBase,
          tariff: [
            ...tariff
              ?.filter((tariff) => tariff.period !== 0)
              .map((tariff) => tariff.id),
          ],
          category: currentFilterCategory,
          theme: "",
          is_active: true,
          is_exchangable: null,
          article: "",
          search: currentSearchValue,
          page: currentPage + 1,
          ordering: "",
        })
      );
    }
  };

  return (
    <main className={style.search}>
      <div className={cn("container", style.search__container)}>
        <div className={style.search__top}>
          {!isMobile ? (
            <div className={style.search__filterWrapper}>
              <button
                style={listView ? { opacity: "0", pointerEvents: "none" } : {}}
                className={cn(
                  "btn-reset",
                  style.search__btnFilter,
                  searchFilterView ? style.filterView : ""
                )}
                onClick={() => setSearchFilterView(true)}
              >
                <span>{t("filters")}</span>
                <SvgIcon name={"arrowRight"} />
              </button>
              <div
                className={style.search__filterOverlay}
                style={searchFilterView ? {} : { display: "none" }}
                onClick={() => setSearchFilterView(false)}
              ></div>
              <SearchFilter
                searchFilterView={searchFilterView}
                setSearchFilterView={setSearchFilterView}
                currentFilterCategory={currentFilterCategory}
                setCurrentFilterCategory={setCurrentFilterCategory}
                currentFilterBase={currentFilterBase}
                setCurrentFilterBase={setCurrentFilterBase}
                setFilterLabels={setFilterLabels}
                filterLabels={filterLabels}
              />
            </div>
          ) : (
            searchFilterView &&
            createPortal(
              <SearchFilter
                isMobile={isMobile}
                setSearchFilterView={setSearchFilterView}
                searchFilterView={searchFilterView}
                currentFilterCategory={currentFilterCategory}
                setCurrentFilterCategory={setCurrentFilterCategory}
                currentFilterBase={currentFilterBase}
                setCurrentFilterBase={setCurrentFilterBase}
                setFilterLabels={setFilterLabels}
                filterLabels={filterLabels}
              />,
              document.body
            )
          )}
          <form className={style.search__form}>
            <input
              className={cn("input-reset", style.search__field)}
              placeholder={t("search")}
              onChange={(e) => setCurrentSearchValue(e.target.value)}
            />
            <button
              className={cn("btn-reset", style.search__btnSub)}
              type="button"
            >
              <SvgIcon name={"search"} />
            </button>
          </form>
          {!isMobile ? (
            <div className={style.search__switchBlock}>
              <button
                onClick={() => setListView(false)}
                className={cn("btn-reset", style.search__btnToggle)}
              >
                <svg style={listView ? { color: "#D9D9D9" } : {}}>
                  <use href={`${icons}#toggleCard`}></use>
                </svg>
              </button>
              <button
                onClick={() => setListView(true)}
                className={cn("btn-reset", style.search__btnToggle)}
              >
                <svg style={!listView ? { color: "#D9D9D9" } : {}}>
                  <use href={`${icons}#toggleList`}></use>
                </svg>
              </button>
            </div>
          ) : (
            <button className={cn("btn-reset", style.search__btnToggle)}>
              <SvgIcon name={"voice"} />
            </button>
          )}
        </div>
        {isMobile && (
          <div className={style.search__mobileFilters}>
            <button
              className={cn(
                "btn-reset",
                styleBtns.btnAstral,
                style.search__btnFilterMob
              )}
              onClick={() => setSearchFilterView(true)}
            >
              {t("filters")}
            </button>
            {filterLabels.map((label) => (
              <span className={style.search__filterLabelMob}>
                {label}
                {/* <SvgIcon name={'cross'} /> */}
              </span>
            ))}
          </div>
        )}
        {!isMobile ? (
          listView ? (
            <SearchList
              cards={cards}
              scrollHandler={scrollHandler}
              currentFilterCategory={currentFilterCategory}
              setCurrentFilterCategory={setCurrentFilterCategory}
              currentFilterBase={currentFilterBase}
              setCurrentFilterBase={setCurrentFilterBase}
              cardPrice={price_citation}
            />
          ) : (
            <SearchCards
              cards={cards}
              scrollHandler={scrollHandler}
              cardPrice={price_citation}
            />
          )
        ) : (
          <SearchCards
            cards={cards}
            scrollHandler={scrollHandler}
            cardPrice={price_citation}
          />
        )}
      </div>
      <BtnsHelp />
    </main>
  );
};

export default Search;
