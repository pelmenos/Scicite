import { FC, useEffect } from "react";
import style from "./InteractionTransaction.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store/store";
import {
  requestTransactionList,
  resetTransactionList,
} from "store/admin/adminSlice";
import { TransactionRow } from "entities/rows/TransactionRow/TransactionRow";
import {
  getIsFetching,
  getTransactionList,
  getTransactionListCurrentPage,
  getTransactionListNextPage,
} from "store/admin/adminSelector";

type TProps = {
  setCurrentSubSection: (num: number) => void;
  setCurrentMainSection: (num: number) => void;
  currentSearchValue: string;
};

export const InteractionTransaction: FC<TProps> = ({
  currentSearchValue,
  setCurrentMainSection,
  setCurrentSubSection,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const isFetching = useSelector(getIsFetching);
  const currentPage = useSelector(getTransactionListCurrentPage);
  const nextPage = useSelector(getTransactionListNextPage);
  const transactiontList = useSelector(getTransactionList);

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(resetTransactionList());
      dispatch(
        requestTransactionList({
          page: 1,
          filter_login: currentSearchValue,
        })
      );
    }, 300);

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
        requestTransactionList({
          page: currentPage + 1,
          filter_login: currentSearchValue,
        })
      );
    }
  };

  const TransactionRows = transactiontList.map((transaction) => (
    <TransactionRow key={transaction.id} transaction={transaction} />
  ));

  return (
    <>
      <div className={style.table}>
        <div className={style.mainRow}>
          <span className={style.colTitleBig}>время</span>
          <span className={style.colTitleBig}>получатель</span>
          <span className={style.colTitleBig}>сумма</span>
          <span className={style.colTitleBig}>основание</span>
          <span className={style.colTitleBig}>доступно scicoins</span>
          <span className={style.colTitleBig}>отмена</span>
        </div>
        <div className={style.list} onScroll={scrollHandler}>
          {TransactionRows}
        </div>
      </div>
    </>
  );
};
