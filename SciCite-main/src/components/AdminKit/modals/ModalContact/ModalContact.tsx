import cn from "classnames"
import { FC, useState } from "react"
import { TToggleOBj, removeModals } from "shared/Functions"
import style from './ModalContact.module.scss'
import styleBtns from 'assets/scss/btns.module.scss'
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { AppDispatch } from "store/store"
import { useDispatch, useSelector } from "react-redux"
import { deleteOffer } from "store/offers/offersSlice"
import { deleteSupport, requestSupport, resetSupport } from "store/support/supportSlice"
import { getSupportStatus, getSupportTypes } from "store/support/supportSelector"

type TProps = {
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    isArgument?: boolean
    login: string
    fullName: string
    phoneNumber: string
    email: string
    narrative: string
    createdDate: string
    offerNumber?: number
    offerId?: string
    suppId?: string
    refuse?: boolean
}

export const ModalContact: FC<TProps> = (
    {
        view,
        setView,
        isArgument,
        email,
        fullName,
        login,
        phoneNumber,
        narrative,
        createdDate,
        offerNumber,
        offerId,
        suppId,
        refuse
    }
) => {
    const [addClass, setAddClass] = useState(true)

    const dispatch: AppDispatch = useDispatch()
    const supportStatus = useSelector(getSupportStatus)
    const supportType = useSelector(getSupportTypes)

    const confirmArgument = async () => {
        if (offerId && supportStatus && supportType) {
            await dispatch(deleteOffer(offerId))
            const currentStatusArr = []
            const currentTypesArr = []
            for (let i = 0; i < supportStatus?.length; i++) {
                if (supportStatus[i].name === 'open' || supportStatus[i].name === 'in_progress')
                    currentStatusArr.push(supportStatus[i].id)
            }
            for (let i = 0; i < supportType?.length; i++) {
                if (supportType[i].name === 'спор')
                    currentTypesArr.push(supportType[i].id)
            }
            dispatch(resetSupport())
            dispatch(requestSupport({
                page: 1,
                declarer__id: '',
                offer__id: '',
                reporter__id: '',
                search: '',
                status__id__in: [...currentStatusArr],
                type_support__id: [...currentTypesArr],
            }))
            removeModals(setAddClass, setView, view, 'contact')
        }
    }

    const dismissArgument = async () => {
        if (suppId && supportStatus && supportType) {
            await dispatch(deleteSupport(suppId))
            const currentStatusArr = []
            const currentTypesArr = []
            for (let i = 0; i < supportStatus?.length; i++) {
                if (supportStatus[i].name === 'open' || supportStatus[i].name === 'in_progress')
                    currentStatusArr.push(supportStatus[i].id)
            }
            for (let i = 0; i < supportType?.length; i++) {
                if (supportType[i].name === 'спор')
                    currentTypesArr.push(supportType[i].id)
            }
            dispatch(resetSupport())
            dispatch(requestSupport({
                page: 1,
                declarer__id: '',
                offer__id: '',
                reporter__id: '',
                search: '',
                status__id__in: [...currentStatusArr],
                type_support__id: [...currentTypesArr],
            }))
            removeModals(setAddClass, setView, view, 'contact')
        }
    }

    return (
        <ModalWrapper
            view={view}
            setView={setView}
            changeEl={'contact'}
            addClass={addClass}
            setAddClass={setAddClass}
        >
            <div className={style.modal}>
                <div className={style.top}>
                    <div className={style.topBlock}>
                        <div className={style.topLeft}>
                            <span className={style.nick}>{login}</span>
                        </div>
                        <span className={style.text}>регистрация {createdDate}</span>
                    </div>
                    <span className={style.text}>{fullName}</span>
                    <div className={style.botBlock}>
                        <span className={style.text}>{phoneNumber}</span>
                        <span className={style.text}>{email}</span>
                    </div>
                </div>
                <div className={style.middle}>
                    {
                        isArgument ?
                            <p className={style.descr}>
                                {
                                    refuse ? `Отказ со стороны исполнителя по отклику № ${offerNumber}` : `Спор со стороны заказчика по отклику № ${offerNumber}`
                                }
                                
                            </p> : ''
                    }
                    <textarea
                        className={cn('input-reset', style.textarea)}
                        value={narrative}
                        readOnly
                    />
                </div>
                {
                    isArgument ?
                        <div className={style.btnsWrapper}>
                            <button
                                className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                                onClick={confirmArgument}
                            >подтвердить</button>
                            <button
                                className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                                onClick={dismissArgument}
                            >отклонить</button>
                            <button
                                className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                                onClick={() => removeModals(setAddClass, setView, view, 'contact')}
                            >закрыть</button>
                        </div> :
                        <button
                            style={{margin: '0 auto'}}
                            className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                            onClick={() => removeModals(setAddClass, setView, view, 'contact')}
                        >закрыть</button>
                }
            </div>
        </ModalWrapper>
    )
}