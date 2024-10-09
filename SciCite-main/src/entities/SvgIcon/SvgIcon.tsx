import { CSSProperties, FC, memo } from "react"
import icons from 'assets/img/sprite.svg'
import cn from "classnames"
import style from './SvgIcon.module.scss'

type TProps = {
    name: string
    addStyles?: CSSProperties
}

export const SvgIcon: FC<TProps> = memo(({ name, addStyles }) => {
    return (
        <svg className={cn(style.icon, addStyles)}>
            <use href={`${icons}#${name}`}></use>
        </svg>
    )
})