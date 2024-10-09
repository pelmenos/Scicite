import { CSSProperties, ChangeEvent, FC, FocusEventHandler, forwardRef, useEffect, useState } from "react"
import cn from "classnames"
import style from './Dropdown.module.scss'

type TField = {
    field: boolean,
    placeholder: string
}

type TProps = {
    name: string
    placeholder: string
    items: any[]
    isField?: TField
    textCenter?: boolean
    disabled?: boolean
    multi?: boolean
    action?: boolean
    setInputValue: any // !! типизировать !!
    addStyle?: CSSProperties,
    setIsBaseSelected?: (value: string) => void
}

export const Dropdown: FC<TProps> = forwardRef<HTMLInputElement, TProps>(
    (
        {
            name,
            placeholder,
            items,
            isField,
            textCenter,
            disabled,
            multi,
            setInputValue,
            addStyle,
            setIsBaseSelected,
            action,
            ...props
        },
        ref
    ) => {
        const [showDrop, setShowDrop] = useState(false)
        const [isTouched, setIsTouched] = useState(false)
        const [value, setValue] = useState(placeholder)
        const [currentLi, setCurrentLi] = useState<string[]>([])
        const [remainingValue, setRemainingValue] = useState('')

        const saveValue = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            const { target } = e
            if (target) {
                const numLi = (target as HTMLLIElement).dataset.index
                if (numLi) {
                    if (multi) {
                        if (currentLi.length < 3) {
                            setCurrentLi([...currentLi, numLi])
                        }
                    } else {
                        setCurrentLi([numLi])
                        if (setIsBaseSelected) {
                            setIsBaseSelected(items.find(item => item.id === numLi).name)
                        }
                    }
                }
                const content = (target as HTMLLIElement).textContent
                if (content) {
                    if (currentLi.length === 0) {
                        setValue(content)
                    }
                    if (multi) {
                        if (!remainingValue.includes(content) && currentLi.length < 3) {

                            setRemainingValue(remainingValue + content)
                        }
                    } else {
                        setRemainingValue(content)
                    }
                }
                if (!multi) {
                    setShowDrop(false)
                }
            }
        }

        const saveFieldValue = (e: React.FocusEvent<HTMLInputElement, Element>) => {
            if (isField) {
                e.currentTarget.placeholder = isField.placeholder
                if (e.currentTarget.value) {
                    setValue(`${e.currentTarget.value}`)
                    setInputValue(name, `${e.currentTarget.value}`)
                }
            }
        }

        useEffect(() => {
            if (currentLi.length === 0) {
                setValue(placeholder)
            } else if (currentLi.length === 1) {
                setValue(remainingValue)
            } else if (currentLi.length > 1) {
                setValue(`${currentLi.length} раздела`)
            }
            if (isTouched) {
                setInputValue(name, currentLi.join(','))
            }
        }, [currentLi, setValue])

        const RemoveValue = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            const { target } = e
            if (target) {
                const content = (target as HTMLLIElement).textContent
                if (content) {
                    setRemainingValue(remainingValue.replace(content, ''))
                }
                const numLi = (target as HTMLLIElement).dataset.index
                if (numLi) {
                    if (multi) {
                        setCurrentLi([...currentLi.filter(li => li !== numLi)])
                    }
                }
            }
        }

        const handleChangeDeadline = (e: ChangeEvent<HTMLInputElement>) => {
            const pattern = e.currentTarget.pattern
            const value = e.currentTarget.value[e.currentTarget.value.length - 1]
            if (!value?.match(pattern) || +e.currentTarget.value[0] === 0) {
                e.currentTarget.value = e.currentTarget.value.substring(0, e.currentTarget.value.length - 1)
            }
            if (+e.currentTarget.value > 12) {
                e.currentTarget.value = '12'
            }
        }

        const li = items?.map((item, i) =>
            isField && i === items.length - 1 ?
                <li key={item.id} className={cn(style.dropdown__item,
                    currentLi.includes(item.id) && i !== items.length - 1 ? style.active : '')}
                    data-index={item.id} style={{ margin: '0 auto' }}>
                    <input
                        type="text"
                        placeholder={isField.placeholder}
                        pattern="[0-9]"
                        max={12}
                        onFocus={(e) => e.currentTarget.placeholder = 'число месяцев'}
                        onBlur={saveFieldValue}
                        onChange={(e) => handleChangeDeadline(e)}
                        className={cn('input-reset', style.field)}
                    />
                </li> :
                <li key={item.id} className={cn(style.dropdown__item,
                    currentLi.includes(item.id) ? style.active : '')} 
                    data-index={item.id} style={{ margin: textCenter ? '0 auto' : ''}}
                    onClick={e => !currentLi.includes(item.id) ? saveValue(e) : RemoveValue(e)}>{item.name}</li>
        )

        return (
            <div className={style.selectWrapper}>
                <input name={name} ref={ref} type="text" className={'is-hidden'} {...props} />
                <div className={cn(style.select, disabled ? style.disabled : '', addStyle)}
                style={{borderColor: action ? 'green' : '' }}
                    onClick={() => {
                        setShowDrop(true);
                        setIsTouched(true)
                    }
                    }>{value}</div>
                {
                    showDrop ?
                        <>
                            <div className={style.overlay} onClick={() => setShowDrop(false)}></div>
                            <ul className={cn('list-reset', style.dropdown)}>
                                {li}
                            </ul>
                        </> : ''
                }
            </div>
        )
    })