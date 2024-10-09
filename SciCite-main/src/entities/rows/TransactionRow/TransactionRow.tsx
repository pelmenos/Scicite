import cn from "classnames";
import { FC, useState } from "react";
import { TToggleOBj, parseDate } from "shared/Functions";
import style from "components/AdminKit/modals/ModalCitation/ModalCitation.module.scss";
import { ModalAdminDetail } from "components/AdminKit/modals/ModalDetail/ModalAdminDetail";
import { ModalProfile } from "components/AdminKit/modals/ModalProfile/ModalProfile";
import { ModalResponseInfo } from "components/AdminKit/modals/ModalResponseInfo/ModalResponseInfo";
import { ModalDeleteCard } from "components/AdminKit/modals/ModalDeleteCard/ModalDeleteCard";
import { TTransaction } from "types/admin.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";

type TProps = {
  transaction: TTransaction;
};

export const TransactionRow: FC<TProps> = ({ transaction }) => {
  const [showModals, setShowModals] = useState<TToggleOBj>({
    profile: false,
    delete: false,
    detail: false,
    responsesInfo: false,
  });

  const parseTransactionDate = parseDate(
    new Date(transaction.created_at),
    true,
    true
  );

  return (
    <div className={cn(style.row, style.rowSb)}>
      <span className={style.cellBig}>{parseTransactionDate}</span>
      <button
        className={cn("btn-reset", style.userCell, style.cellBig)}
        onClick={() => setShowModals((old) => ({ ...old, profile: true }))}
      >
        <SvgIcon name={transaction.user.level.name} />
        <span>{transaction.user.login}</span>
      </button>
      <span className={style.cellBig}>
        <span className={style.under}>
          {(transaction.type_transaction === "plus" ? "+" : "-") +
            transaction.sum}
        </span>
      </span>
      <button
        className={cn("btn-reset", style.userCell, style.cellBig)}
        onClick={() => setShowModals((old) => ({ ...old, detail: true }))}
      >
        <span>
          {(transaction.basis_creation === "CREATED_CARD" &&
            "создание карточки") ||
            (transaction.basis_creation === "citation_format" &&
              "оформление цитирования") ||
            (transaction.basis_creation === "publication_format" &&
              "оформление публикации") ||
            (transaction.basis_creation === "enrollment_admin" &&
              "зачисление admin") ||
            (transaction.basis_creation === "achievement" && "достижение")}
        </span>
      </button>
      <span className={style.cellBig}>
        <span className={style.under}>{transaction.user.balance}</span>
      </span>
      <button
        className={cn("btn-reset", style.cellBig, style.cellBtn)}
        onClick={() => setShowModals((old) => ({ ...old, delete: true }))}
      >
        <span className={style.under}>отменить</span>
      </button>
      {showModals.profile && (
        <ModalProfile
          view={showModals}
          setView={setShowModals}
          user={{ ...transaction.user, ...transaction.statistic }}
        />
      )}
      {/* {
                showModals.responsesInfo &&
                    <ModalResponseInfo view={showModals} setView={setShowModals} />
            } */}
      {showModals.detail && transaction?.source_object?.length && (
        <ModalAdminDetail
          view={showModals}
          setView={setShowModals}
          card={transaction?.source_object[0]}
        />
      )}
      {showModals.delete && (
        <ModalDeleteCard
          view={showModals}
          setView={setShowModals}
          transaction={true}
          itemId={transaction.id}
        />
      )}
    </div>
  );
};
