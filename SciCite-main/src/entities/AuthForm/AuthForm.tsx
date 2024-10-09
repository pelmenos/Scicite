import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper"
import { CSSProperties, FC, ReactNode } from "react"
import style from './AuthForm.module.scss'
import { TToggleOBj } from "shared/Functions"
import cn from "classnames"

type TAuthForm = {
    children: ReactNode
    view: TToggleOBj
    setView: (toggle: TToggleOBj) => void
    addClass: boolean
    setAddClass: (addClass: boolean) => void
    changeEl: string
    title: string
    addStyles?: CSSProperties
    onSubmit: (e?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>
}

export const AuthForm: FC<TAuthForm> = (
    {
        children,
        view,
        setView,
        addClass,
        setAddClass,
        changeEl,
        title,
        onSubmit,
        addStyles
    }
) => {
    return (
        <ModalWrapper
            view={view}
            setView={setView}
            changeEl={changeEl}
            addClass={addClass}
            setAddClass={setAddClass}
        >
            <form className={cn(style.modal, addStyles)} onSubmit={onSubmit}>
                <p className={style.title}>{title}</p>
                {children}
            </form>
        </ModalWrapper>
    )
}