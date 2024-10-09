import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";


type TPortalProps = {
    children: ReactNode
    element?: HTMLElement
}

export const Portal: FC<TPortalProps> = ({children, element = document.body}) => {
    return (
        createPortal(children, element)
    )
}