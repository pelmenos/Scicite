import { FC, useEffect, useState } from "react"
import style from './Tape.module.scss'
import { TapeCards } from "./TapeCards/TapeCards"
import { TapeResponse } from "./TapeResponse/TapeResponse"
import { TapeUsers } from "./TapeUsers/TapeUsers"

type TProps = {
    currentSection: number
    setCurrentSubSection: (num: number) => void
    currentParam: string
    setCurrentParam: (param: string) => void
}

export const Tape: FC<TProps> = (
    {
        currentSection,
        setCurrentSubSection,
        currentParam,
        setCurrentParam
    }
) => {

    return (
        <div className={style.subSection}>
            {
                (currentSection === 1 &&
                    <TapeCards
                        currentParam={currentParam}
                    />) ||
                (currentSection === 2 &&
                    <TapeResponse
                        currentParam={currentParam}
                    />) ||
                (currentSection === 3 &&
                    <TapeUsers
                        setCurrentSubSection={setCurrentSubSection}
                        setCurrentParam={setCurrentParam}
                    />)
            }
        </div>
    )
}