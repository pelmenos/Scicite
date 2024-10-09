import { FC, useState } from "react";
import cn from "classnames";
import style from './MyCardsEmpty.module.scss';
import useWindow from "shared/CustomHooks";
import { TToggleOBj } from "shared/Functions";
import { ModalCreateCard } from "components/Modals/CreateCard/ModalCreateCard";
import { MobileCreateCard } from "components/Modals/mobile/CreateCard/MobileCreateCard";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";


export const MyCardsEmpty: FC = () => {
    const isMobile = useWindow()
    const [showModals, setShowModals] = useState<TToggleOBj>({
        create: false
    })
    return (
        <div className={cn('container', style.myCardsEmpty__container)}>
            <h2 className={style.myCardsEmpty__title}>у вас нет доступных карточек</h2>
            <button className={cn('btn-reset', style.myCardsEmpty__btn)}
                onClick={() => setShowModals(old => ({ ...old, create: true }))}>
                    <SvgIcon name={'bigPlus'} />
            </button>
            <p className={style.myCardsEmpty__text}>создайте карточку</p>
            {
                showModals.create ?
                    isMobile ?
                        <MobileCreateCard view={showModals} setView={setShowModals} /> :
                        <ModalCreateCard view={showModals} setView={setShowModals} /> : ''
            }
        </div>
    )
}