import { DeepMap, FieldError, FieldValues, Path, RegisterOptions, UseFormRegister, get } from "react-hook-form";
import { Input, InputProps } from "./Input/Input";

export type FormInputProps<TFormValues extends FieldValues> = {
    name: Path<TFormValues>;
    rules?: RegisterOptions;
    register?: UseFormRegister<TFormValues>;
    errors?: Partial<DeepMap<TFormValues, FieldError>>;
} & Omit<InputProps, 'name'>;

export const FormInput = <TFormValues extends Record<string, unknown>>({
    name,
    register,
    rules,
    errors,
    addStyle,
    type,
    placeholder,
    value,
    onInput,
    ...props
}: FormInputProps<TFormValues>): JSX.Element => {
    const errorMessages = get(errors, name);
    const hasError = !!(errors && errorMessages);

    return (
        <>
            <Input
                type={type}
                placeholder={placeholder}
                addStyle={addStyle}
                name={name}
                value={value}
                aria-invalid={hasError}
                onInput={onInput}
                {...props}
                {...(register && register(name, rules))}
            />
        </>
    )
}