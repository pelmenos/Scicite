import { FC, useEffect, useMemo } from "react";
import style from "./InteractionArgument.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store/store";
import { requestHelpList } from "store/admin/adminSlice";
import { ArgumentRow } from "entities/rows/ArgumentRow/ArgumentRow";
import { requestSupport, resetSupport } from "store/support/supportSlice";
import {
  getIsFetching,
  getSupportStatus,
  getSupportTypes,
  getSupports,
  getSupportsCurrentPage,
  getSupportsNextPage,
} from "store/support/supportSelector";

type TProps = {
  setCurrentSubSection: (num: number) => void;
  setCurrentMainSection: (num: number) => void;
  currentSearchValue: string;
};

export const InteractionArgument: FC<TProps> = ({
  currentSearchValue,
  setCurrentMainSection,
  setCurrentSubSection,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const isFetching = useSelector(getIsFetching);
  const currentPage = useSelector(getSupportsCurrentPage);
  const nextPage = useSelector(getSupportsNextPage);
  const supportList = useSelector(getSupports);
  const supportStatus = useSelector(getSupportStatus);
  const supportType = useSelector(getSupportTypes);

  const status = useMemo(() => {
    const currentStatusArr = [];
    if (supportStatus) {
      for (let i = 0; i < supportStatus?.length; i++) {
        if (
          supportStatus[i].name === "open" ||
          supportStatus[i].name === "in_progress"
        )
          currentStatusArr.push(supportStatus[i].id);
      }
    }
    return currentStatusArr;
  }, [supportStatus]);

  const type = useMemo(() => {
    const currentTypesArr = [];

    if (supportType) {
      for (let i = 0; i < supportType?.length; i++) {
        if (
          supportType[i].name.toLowerCase() === "спор" ||
          supportType[i].name.toLowerCase() === "отказ"
        )
          currentTypesArr.push(supportType[i].id);
      }
    }
    return currentTypesArr;
  }, [supportType]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(resetSupport());
      dispatch(
        requestSupport({
          page: 1,
          declarer__id: "",
          offer__id: "",
          reporter__id: "",
          search: currentSearchValue,
          status__id__in: [...status],
          type_support__id: [...type],
        })
      );
    }, 300);

    return () => clearTimeout(debounce);
  }, [currentSearchValue, dispatch, status, type]);

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
            requestSupport({
              page: 1,
              declarer__id: "",
              offer__id: "",
              reporter__id: "",
              search: currentSearchValue,
              status__id__in: [...status],
              type_support__id: [...type],
            })
          );
    }
  };

  const ArgumentsRows = supportList.map((support) => (
    <ArgumentRow
      key={support.id}
      setCurrentSubSection={setCurrentSubSection}
      setCurrentMainSection={setCurrentMainSection}
      support={support}
    />
  ));

  return (
    <>
      <div className={style.table}>
        <div className={style.mainRow}>
          <span className={style.colTitle}>открыл спор</span>
          <span className={style.colTitle}>дата спора</span>
          <span className={style.colTitle}>исполнитель</span>
          <span className={style.colTitle}>заказчик</span>
          <span className={style.colTitle}>предмет спора</span>
          <span className={style.colTitle}>текст спора</span>
        </div>
        <div className={style.list} onScroll={scrollHandler}>
          {ArgumentsRows}
        </div>
      </div>
    </>
  );
};
