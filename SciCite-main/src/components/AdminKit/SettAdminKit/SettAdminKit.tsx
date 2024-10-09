import { FC, useCallback, useEffect, FocusEvent, useState } from "react"
import styleBtns from 'assets/scss/btns.module.scss'
import style from './SettAdminKit.module.scss'
import cn from "classnames"
import { AppDispatch } from "store/store"
import { useDispatch, useSelector } from "react-redux"
import { requestLevels, requestSettings, setErrors, updateLevel, updateSettings } from "store/admin/adminSlice"
import { getErrors, getLevels, getSettings } from "store/admin/adminSelector"
import { SvgIcon } from "entities/SvgIcon/SvgIcon"
import { Path, useForm } from "react-hook-form"

type TSettFields = {
    welcome_bonus: string
    price_publication: {
        [k: string]: number
    }
    discount: {
        month: string
        enabled: string
        percent: string
    }
    price_citation: {
        [k: string]: number
    }
    scicoins: {
        price: number
        discount: number
        percent: string
    }
    minimal_duration_card: string
    free_card: {
        enabled: string
        duration: string
    }
    level: {
        [k: string]: {
            id: string
            limit: number
            count_offers: number
        }
    }
}

export const Settings: FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const settings = useSelector(getSettings)
    const levels = useSelector(getLevels)
    const err = useSelector(getErrors)

    const [isSubmit, setIsSubmit] = useState(false)
    const [isShowMessage, setIsShowMessage] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<TSettFields>()

    const adjustingMonths = (monthCount: number) => {
        return (
            (monthCount % 10 === 1 && monthCount + ' месяц') ||
            (monthCount % 10 < 5 && monthCount + ' месяца') ||
            ((monthCount % 10 >= 5 || monthCount % 10 === 0) && monthCount + ' месяцев') ||
            monthCount + ' месяц'
        )
    }

    const removeText = (e: FocusEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value
        if (value.includes('%')) {
            value = value.slice(0, value.indexOf('%'))
        } else if (value.includes(' ')) {
            value = value.slice(0, value.indexOf(' '))
        }
        e.currentTarget.value = value
    }

    const blurMonthHandler = (e: FocusEvent<HTMLInputElement>, name: string) => {
        const value = adjustingMonths(+e.currentTarget.value)
        e.currentTarget.value = value
        register(`${name}` as Path<TSettFields>).onBlur(e)
    }

    const resetForm = useCallback(() => {
        if (settings && levels) {
            Object.keys(settings.price_publication).map(item => (
                setValue(`price_publication.${item}` as Path<TSettFields>, settings.price_publication[item])
            ))
            setValue('discount', {
                enabled: settings.discount.enabled ? '+' : '-',
                month: settings.discount.month + ' мес.',
                percent: settings.discount.percent + '%',
            })
            Object.keys(settings.price_citation).map(item => (
                setValue(`price_citation.${item}` as Path<TSettFields>, settings.price_citation[item])
            ))
            setValue('scicoins', {
                price: settings.scicoins.price,
                discount: settings.scicoins.discount,
                percent: settings.scicoins.percent + '%',
            })
            setValue('minimal_duration_card', adjustingMonths(settings.minimal_duration_card))
            setValue('level', Object.fromEntries(levels.map(level => (
                [level.name, { id: level.id, limit: level.limit, count_offers: level.count_offers }]
            ))))
            setValue('welcome_bonus', settings.welcome_bonus + ' scicoins')
            setValue('free_card', {
                enabled: settings.discount.enabled ? '+' : '-',
                duration: adjustingMonths(settings.free_card.duration),
            })
        }
    }, [levels, setValue, settings])

    const getSettingsInfo = useCallback(() => {
        dispatch(requestSettings())
        dispatch(requestLevels())
    }, [dispatch])

    useEffect(() => {
        getSettingsInfo()
    }, [getSettingsInfo])

    useEffect(() => {
        resetForm()
    }, [resetForm])

    const onSubmit = handleSubmit(async (data) => {
        if (err !== null) {
            dispatch(setErrors(null))
        }
        await dispatch(updateSettings({
            price_publication: Object.fromEntries(Object.keys(data.price_publication).map(pubSet => (
                [pubSet, +data.price_publication[pubSet]]
            ))),
            discount: {
                enabled: data.discount.enabled === '+' ? true : false,
                month: +data.discount.month.slice(0, data.discount.month.indexOf(' ')),
                percent: +data.discount.percent.slice(0, data.discount.percent.indexOf('%'))
            },
            price_citation: Object.fromEntries(Object.keys(data.price_citation).map(citSet => (
                [citSet, +data.price_citation[citSet]]
            ))),
            scicoins: {
                ...data.scicoins,
                percent: +data.scicoins.percent.slice(0, data.discount.percent.indexOf('%'))
            },
            minimal_duration_card: +data.minimal_duration_card.slice(0, data.minimal_duration_card.indexOf(' ')),
            welcome_bonus: +data.welcome_bonus.slice(0, data.welcome_bonus.indexOf(' ')),
            free_card: {
                duration: +data.free_card.duration.slice(0, data.free_card.duration.indexOf(' ')),
                enabled: data.discount.enabled === '+' ? true : false
            }
        }))
        levels.map(async level => (
            await dispatch(updateLevel({ ...data.level[level.name], name: level.name }))
        ))
        getSettingsInfo()
        setIsSubmit(true)
    })

    useEffect(() => {
        const closeModal = () => {
            if (err === null && isSubmit) {
                setIsShowMessage(true)
                setTimeout(() => {
                    setIsShowMessage(false)
                }, 5000)
            }
        }

        closeModal()
        setIsSubmit(false)
    }, [err, isSubmit])

    return (
        <form className={style.settings} onSubmit={onSubmit}>
            <div className={style.row}>
                <p className={style.title}>стоимость публикациии</p>
                <div className={style.container}>
                    {
                        settings &&
                        Object.keys(settings.price_publication).map(pubSett => (
                            <div key={pubSett} className={style.wrapperField}>
                                <label>{pubSett}</label>
                                <input
                                    {...register(
                                        `price_publication.${pubSett}` as Path<TSettFields>,
                                        {
                                            required: {
                                                value: true,
                                                message: 'обязательное поле'
                                            },
                                            pattern: {
                                                value: /[1-9]0?$/,
                                                message: 'не верный формат данных'
                                            }
                                        }
                                    )}
                                    type="text"
                                    className={cn('input-reset', style.smallField)}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={style.row}>
                <p className={style.title}>скидка на публикацию</p>
                <div className={style.container}>
                    <div className={style.wrapperField}>
                        <label>активность</label>
                        <input
                            {...register(
                                'discount.enabled',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[+-]+$/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            type="text"
                            className={cn('input-reset', style.smallField)}
                        />
                    </div>
                    <div className={style.wrapperField}>
                        <label>скидка от</label>
                        <input
                            {...register(
                                'discount.month',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[1-9]/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            onFocus={(e) => removeText(e)}
                            onBlur={(e) => {
                                e.currentTarget.value = e.currentTarget.value + ' мес.'
                                register('discount.month').onBlur(e)
                            }}
                            type="text"
                            className={cn('input-reset', style.smallField)}
                        />
                    </div>
                    <div className={style.wrapperField}>
                        <label>размер скидки</label>
                        <input
                            {...register(
                                'discount.percent',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[1-9]/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            onFocus={(e) => removeText(e)}
                            onBlur={(e) => {
                                e.currentTarget.value = e.currentTarget.value + '%'
                                register('discount.percent').onBlur(e)
                            }}
                            type="text"
                            className={cn('input-reset', style.smallField)}
                        />
                    </div>
                </div>
            </div>
            <div className={style.row}>
                <p className={style.title}>оплата цитирования</p>
                <div className={style.container}>
                    {
                        settings &&
                        Object.keys(settings.price_citation).map(citSett => (
                            <div key={citSett} className={style.wrapperField}>
                                <label>{citSett}</label>
                                <input
                                    {...register(
                                        `price_citation.${citSett}` as Path<TSettFields>,
                                        {
                                            required: {
                                                value: true,
                                                message: 'обязательное поле'
                                            },
                                            pattern: {
                                                value: /[1-9]0?$/,
                                                message: 'не верный формат данных'
                                            }
                                        }
                                    )}
                                    type="text"
                                    className={cn('input-reset', style.smallField)}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={style.row}>
                <p className={style.title}>scicoins</p>
                <div className={style.container}>
                    <div className={style.wrapperField}>
                        <label>стоимость</label>
                        <input
                            {...register(
                                'scicoins.price',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[1-9]0?$/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            type="text"
                            className={cn('input-reset', style.smallField)}
                        />
                    </div>
                    <div className={style.wrapperField}>
                        <label>скидка от</label>
                        <input
                            {...register(
                                'scicoins.discount',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[1-9]0?$/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            type="text"
                            className={cn('input-reset', style.smallField)}
                        />
                    </div>
                    <div className={style.wrapperField}>
                        <label>размер скидки</label>
                        <input
                            {...register(
                                'scicoins.percent',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[1-9]/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            onFocus={(e) => removeText(e)}
                            onBlur={(e) => {
                                e.currentTarget.value = e.currentTarget.value + '%'
                                register('scicoins.percent').onBlur(e)
                            }}
                            type="text"
                            className={cn('input-reset', style.smallField)}
                        />
                    </div>
                </div>
            </div>
            <div className={style.bigRow}>
                <p className={style.title}>минимальная длительность публикации</p>
                <div className={style.container}>
                    <input
                        {...register(
                            'minimal_duration_card',
                            {
                                required: {
                                    value: true,
                                    message: 'обязательное поле'
                                },
                                pattern: {
                                    value: /[1-9]/,
                                    message: 'не верный формат данных'
                                }
                            }
                        )}
                        onFocus={(e) => removeText(e)}
                        onBlur={(e) => blurMonthHandler(e, 'minimal_duration_card')}
                        type="text"
                        className={cn('input-reset', style.field)}
                    />
                </div>
            </div>
            <div className={style.row}>
                <p className={style.title}>предел цитирований</p>
                <div className={style.container}>
                    {
                        [...levels].sort((a, b) => a.limit - b.limit).map(level => (
                            <div key={level.limit} className={style.wrapperField}>
                                <label>
                                    <SvgIcon name={level.name} />
                                </label>
                                <input
                                    {...register(
                                        `level.${level.name}.limit` as Path<TSettFields>,
                                        {
                                            required: {
                                                value: true,
                                                message: 'обязательное поле'
                                            },
                                            pattern: {
                                                value: /[0-9]/,
                                                message: 'не верный формат данных'
                                            }
                                        }
                                    )}
                                    type="text"
                                    className={cn('input-reset', style.smallField)}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={style.row}>
                <p className={style.title}>переход на новый уровень </p>
                <div className={style.container}>
                    {
                        [...levels].sort((a, b) => a.count_offers - b.count_offers).map(level => (
                            <div key={level.count_offers} className={style.wrapperField}>
                                <label>
                                    <SvgIcon name={level.name} />
                                </label>
                                <input
                                    {...register(
                                        `level.${level.name}.count_offers` as Path<TSettFields>,
                                        {
                                            required: {
                                                value: true,
                                                message: 'обязательное поле'
                                            },
                                            pattern: {
                                                value: /[0-9]/,
                                                message: 'не верный формат данных'
                                            }
                                        }
                                    )}
                                    type="text"
                                    className={cn('input-reset', style.smallField)}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={style.bigRow}>
                <p className={style.title}>приветственный бонус</p>
                <div className={style.container}>
                    <input
                        {...register(
                            'welcome_bonus',
                            {
                                required: {
                                    value: true,
                                    message: 'обязательное поле'
                                },
                                pattern: {
                                    value: /[0-9]/,
                                    message: 'не верный формат данных'
                                }
                            }
                        )}
                        onFocus={(e) => removeText(e)}
                        onBlur={(e) => {
                            e.currentTarget.value = e.currentTarget.value + ' scicoins'
                            register('welcome_bonus').onBlur(e)
                        }}
                        type="text"
                        className={cn('input-reset', style.field)}
                    />
                </div>
            </div>
            <div className={style.row}>
                <p className={style.title}>бесплатная карточка</p>
                <div className={style.container}>
                    <div className={style.wrapperField}>
                        <label>активность</label>
                        <input
                            {...register(
                                'free_card.enabled',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[+-]$/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            type="text"
                            className={cn('input-reset', style.smallField)}
                        />
                    </div>
                    <div className={style.wrapperField}>
                        <label>срок публикации</label>
                        <input
                            {...register(
                                'free_card.duration',
                                {
                                    required: {
                                        value: true,
                                        message: 'обязательное поле'
                                    },
                                    pattern: {
                                        value: /[1-9]/,
                                        message: 'не верный формат данных'
                                    }
                                }
                            )}
                            onFocus={(e) => removeText(e)}
                            onBlur={(e) => blurMonthHandler(e, 'free_card.duration')}
                            type="text"
                            className={cn('input-reset', style.mediumField)}
                        />
                    </div>
                </div>
            </div>
            {
                isShowMessage &&
                <div className={style.successText} style={{ color: "green" }}>
                    Данные формы успешно отправлены
                </div>
            }
            <div className={style.btnsBlock}>
                <button
                    type="submit"
                    className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                >принять</button>
                <button
                    onClick={resetForm}
                    type="button"
                    className={cn('btn-reset', styleBtns.btnAstral, style.btn)}
                >отмена</button>
            </div>
        </form>
    )
}