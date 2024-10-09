import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, removeModals } from "shared/Functions"
import styleBtns from 'assets/scss/btns.module.scss'
import style from './ModalDeleteCard.module.scss'
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { AppDispatch } from "store/store"
import { useDispatch } from "react-redux"
import { deleteCard } from "store/cards/cardsSlice"
import { deleteTransaction } from "store/admin/adminSlice"

type TProps = {
    transaction?: boolean
    isDelete?: () => void
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    itemId: string
}

export const ModalDeleteCard: FC<TProps> = (
    {
        transaction,
        view,
        setView,
        isDelete,
        itemId
    }
) => {
    const dispatch: AppDispatch = useDispatch()
    const [addClass, setAddClass] = useState(true)

    const DeleteCard = () => {
        if (!transaction) {
            dispatch(deleteCard(itemId))
            removeModals(setAddClass, setView, view, 'delete')
        } else {
            dispatch(deleteTransaction(itemId))
            removeModals(setAddClass, setView, view, 'delete')
        }
        if (isDelete) {
            isDelete()
        }
    }

    return (
        <ModalWrapper view={view} setView={setView} changeEl={'delete'} addClass={addClass} setAddClass={setAddClass}>
            <div className={cn(style.modalDeleteCard)} style={transaction ?
                { paddingLeft: '3.625rem', paddingRight: '3.625rem' } : {}}>
                <p className={style.title}>{!transaction ? 'удалить карточку?' : 'удалить транзакцию?'}</p>
                <div className={style.btnsBlock}>
                    <button className={cn('btn-reset', styleBtns.btnAstral,
                        style.btn)} onClick={DeleteCard}>да</button>
                    <button className={cn('btn-reset', styleBtns.btnAstral,
                        style.btn)} onClick={() => removeModals(setAddClass, setView, view, 'delete')}>нет</button>
                </div>
            </div>
        </ModalWrapper>
    )
}