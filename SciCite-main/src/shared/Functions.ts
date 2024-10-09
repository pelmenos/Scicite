export type TToggleOBj = {
    [k: string]: boolean
}

export const removeModal = (setAddClass: (toggle: boolean) => void, setView: (toggle: boolean) => void) => {
    setAddClass(false)
    setTimeout(() => {
        setView(false)
    }, 900);
}

export function removeModals(setAddClass: (toggle: boolean) => void, setView: (toggle: TToggleOBj) => void,
    obj: TToggleOBj, changeEl: string, shownEl?: string) {
    setAddClass(false)
    setTimeout(() => {
        if (typeof obj == 'object' && !!obj && changeEl in obj) {
            if (shownEl && shownEl in obj) {
                setView({ ...obj, [changeEl]: false, [shownEl]: true })
            } else {
                setView({ ...obj, [changeEl]: false })
            }
        }
    }, 900);
}

export const parseDate = (date: Date, fullYear: boolean, withTime?: boolean) => {
    let day = `${date.getDate()}.`
    if (+day < 10) {
        day = '0' + day
    }
    let month = `${date.getMonth() + 1}.`
    if (+month < 10) {
        month = '0' + month
    }
    const year = fullYear ? `${date.getFullYear()}` : `${date.getFullYear()}`.slice(2)

    let hours = `${date.getHours()}`
    if (+hours < 10) {
        hours = '0' + hours
    }

    let minutes = `${date.getMinutes()}`
    if (+minutes < 10) {
        minutes = '0' + minutes
    }

    if (withTime) {
        return day + month + year + ' ' + hours + ':' + minutes
    } 

    return day + month + year
}