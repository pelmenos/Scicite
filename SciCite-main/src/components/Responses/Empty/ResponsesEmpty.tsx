import { FC } from "react";
import { NavLink } from "react-router-dom";
import cn from "classnames";
import style from './ResponsesEmpty.module.scss';
import { SvgIcon } from "entities/SvgIcon/SvgIcon";

export const ResponsesEmpty: FC = () => {
    return (
        <div className={cn('container', style.responsesEmpty__container)}>
            <h2 className={style.responsesEmpty__title}>у вас нет активных откликов</h2>
            <NavLink to={'/search'} className={cn('a', style.responsesEmpty__btn)}>
                <SvgIcon name="bigMagnifier" />
            </NavLink>
            <p className={style.responsesEmpty__text}>перейти в поиск</p>
        </div>
    )
}