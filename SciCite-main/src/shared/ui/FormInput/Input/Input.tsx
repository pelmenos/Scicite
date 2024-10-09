import { CSSProperties, FC, FormEvent, forwardRef } from "react";
import cn from "classnames";
import style from './Input.module.scss';

export type InputProps = {
    type: string
    name: string
    placeholder: string
    addStyle?: CSSProperties
    disabled?: boolean
    value?: string
    maxLength?: number
    minLength?: number
    onInput?: (e: FormEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type,
            name,
            placeholder,
            addStyle,
            disabled,
            value,
            maxLength,
            minLength,
            onInput,
            ...props
        },
        ref
    ) => {

        return (
            <input
                type={type}
                name={name}
                ref={ref}
                placeholder={placeholder}
                className={cn('input-reset', style.input, addStyle)}
                disabled={disabled}
                defaultValue={value ? value : ''}
                onInput={(e) => onInput ? onInput(e) : (e)}
                {...props}
            />
        )
    })