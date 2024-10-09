import { FC, useState, FocusEvent, FormEvent } from "react";
import cn from "classnames";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "entities/AuthForm/AuthForm.module.scss";
import { useForm, useWatch } from "react-hook-form";
import { FormInput } from "shared/ui/FormInput/FormInput";
import { emailPattern } from "shared/Patterns";
import { registration } from "store/auth/authSlice";
import { AuthForm } from "entities/AuthForm/AuthForm";
import { TRegistrationData } from "types/auth.types";
import { AxiosError } from "axios";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";

import privatePolicy from "./privatePolicy.pdf";
import userPolicy from "./userPolicy.pdf";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalRegistration: FC<TProps> = ({ view, setView }) => {
  const { t } = useTranslation();
  const [addClass, setAddClass] = useState(true);
  const [err, setErrors] = useState<TRegistrationData>();
  const [isShowPass, setIsShowPass] = useState({ pass: false, confirm: false });
  const [email, setEmail] = useState("");

  const [isUserPolicy, setIsUserPolicy] = useState(false);
  const [isPrivatePolicy, setIsPrivatePolicy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    clearErrors,
    setError,
  } = useForm<TRegistrationData>();

  const password = useWatch({
    control,
    name: "password",
  });

  const Login = () => {
    removeModals(setAddClass, setView, view, "auth", "login");
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await registration(data);
      setEmail(data.email);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        setErrors(error.response?.data);
      }
    }
  });

  const handleChangeNumberPhone = (value: string) => {
    setValue("number_phone", value);
  };

  const handleBlurNumberPhone = (e: FocusEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 10) {
      clearErrors("number_phone");
    } else if (
      e.currentTarget.value.length < 10 &&
      e.currentTarget.value.length > 1
    ) {
      setError("number_phone", {
        type: "minLength",
        message: t("min_length"),
      });
    } else if (!e.currentTarget.value) {
      setError("number_phone", {
        type: "required",
        message: t("required", { name: t("phone") }),
      });
    }
  };

  const handleChangeLogin = (e: FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 32) {
      e.currentTarget.value = e.currentTarget.value.substring(
        0,
        e.currentTarget.value.length - 1
      );
    }
  };

  const onChangeIsUserPolicy = (e: any) => {
    const check = e.target.checked;
    setIsUserPolicy(check);
  };

  const onChangeIsPrivatePolicy = (e: any) => {
    const check = e.target.checked;
    setIsPrivatePolicy(check);
  };

  return (
    <AuthForm
      addClass={addClass}
      setAddClass={setAddClass}
      changeEl="auth"
      onSubmit={onSubmit}
      view={view}
      setView={setView}
      title={email ? "" : t("signUp")}
      addStyles={email ? style.subForm : ""}
    >
      {!email ? (
        <>
          <div>
            <FormInput<TRegistrationData>
              type="text"
              name="login"
              placeholder={t("login")}
              register={register}
              errors={errors}
              rules={{
                required: t("required", { name: t("login") }),
                maxLength: {
                  value: 32,
                  message: t("max_length", { count: 32 }),
                },
              }}
              addStyle={style.field}
              onInput={handleChangeLogin}
            />
            {(errors.login || err) && (
              <p className={style.error}>
                {errors?.login?.message || err?.login}
              </p>
            )}
          </div>
          <div>
            <FormInput<TRegistrationData>
              type="email"
              name="email"
              placeholder={t("email")}
              register={register}
              errors={errors}
              rules={{
                required: t("required", { name: "Email" }),
                pattern: {
                  value: emailPattern.value,
                  message: t("incorrect", { name: "Email" }),
                },
              }}
              addStyle={style.field}
            />
            {(errors.email || err) && (
              <p className={style.error}>
                {errors?.email?.message || err?.email}
              </p>
            )}
          </div>
          <div>
            <PhoneInput
              country={"ru"}
              specialLabel=""
              value={getValues("number_phone")}
              onChange={handleChangeNumberPhone}
              onBlur={handleBlurNumberPhone}
              containerClass={style.reactTelInput}
              inputClass={cn("input-reset", style.input, style.field)}
              inputStyle={
                errors.number_phone || err
                  ? { border: "2px solid var(--error-color)" }
                  : {}
              }
              buttonClass={style.flagDropdown}
              dropdownClass={style.dropdown}
              placeholder={t("phone")}
            />
            {(errors.number_phone || err) && (
              <p className={style.error}>
                {errors?.number_phone?.message || err?.number_phone}
              </p>
            )}
          </div>
          {/* {
                confirmNumber ?
                    <Input type="text" placeholder={'введите код'} addStyle={style.field} />
                    :
                    <div className={style.fieldWrapper}>
                        <button type={'button'} className={cn('btn-reset', style.btnConfirm)}
                            onClick={() => setConfirmNumber(true)}>подтвердить</button>
                    </div>
            } */}
          <div>
            <FormInput<TRegistrationData>
              type="text"
              name="full_name"
              placeholder={`${t("full_name")} (${t("not_required")})`}
              register={register}
              errors={errors}
              rules={{ maxLength: 150 }}
              addStyle={style.field}
            />
            {(errors.full_name || err) && (
              <p className={style.error}>
                {errors?.full_name?.message || err?.full_name}
              </p>
            )}
          </div>
          <div>
            <div className={style.passwordWrapper}>
              <FormInput<TRegistrationData>
                type={isShowPass.pass ? "text" : "password"}
                name="password"
                placeholder={t("password")}
                register={register}
                errors={errors}
                rules={{
                  required: t("required", { name: t("password") }),
                  minLength: {
                    value: 8,
                    message: t("min_length_many", {
                      name: t("password"),
                      count: 8,
                    }),
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: t("password_message"),
                  },
                }}
                addStyle={style.field}
              />
              {!isShowPass.pass ? (
                <button
                  type="button"
                  className={cn("btn-reset", style.btnTogglePassVisible)}
                  onClick={() =>
                    setIsShowPass((old) => ({ ...old, pass: true }))
                  }
                >
                  <SvgIcon name={"showPass"} />
                </button>
              ) : (
                <button
                  type="button"
                  className={cn("btn-reset", style.btnTogglePassVisible)}
                  onClick={() =>
                    setIsShowPass((old) => ({ ...old, pass: false }))
                  }
                >
                  <SvgIcon name={"hidePass"} />
                </button>
              )}
            </div>
            {(errors.password || err) && (
              <p className={style.error}>
                {errors?.password?.message || err?.password}
              </p>
            )}
          </div>
          <div>
            <div className={style.passwordWrapper}>
              <FormInput<TRegistrationData>
                type={isShowPass.confirm ? "text" : "password"}
                name="password_confirm"
                placeholder={t("password_confirm")}
                register={register}
                errors={errors}
                rules={{
                  required: t("required", { name: "" }),
                  validate: (value) =>
                    value === password || t("confirm_pass_error"),
                }}
                addStyle={style.field}
              />
              {!isShowPass.confirm ? (
                <button
                  type="button"
                  className={cn("btn-reset", style.btnTogglePassVisible)}
                  onClick={() =>
                    setIsShowPass((old) => ({ ...old, confirm: true }))
                  }
                >
                  <SvgIcon name={"showPass"} />
                </button>
              ) : (
                <button
                  type="button"
                  className={cn("btn-reset", style.btnTogglePassVisible)}
                  onClick={() =>
                    setIsShowPass((old) => ({ ...old, confirm: false }))
                  }
                >
                  <SvgIcon name={"hidePass"} />
                </button>
              )}
            </div>
            {(errors.password_confirm || err) && (
              <p className={style.error}>
                {errors?.password_confirm?.message || err?.password_confirm}
              </p>
            )}
          </div>
          <div className={style.container}>
            <div className={style.containerCheckbox}>
              <input
                type="checkbox"
                id="policy"
                className={style.checkbox}
                checked={isUserPolicy ?? false}
                onChange={onChangeIsUserPolicy}
              />
              <div className={style.containerTip}>
                <label className={style.label} htmlFor="policy">
                  {t("read")}{" "}
                  <a href={privatePolicy} target="_blank" rel="noreferrer">
                    {t("policy")}
                  </a>
                </label>
              </div>
            </div>
            <div className={style.containerCheckbox}>
              <input
                type="checkbox"
                id="user"
                className={style.checkbox}
                checked={isPrivatePolicy ?? false}
                onChange={onChangeIsPrivatePolicy}
              />
              <div className={style.containerTip}>
                <label className={style.label} htmlFor="user">
                {t("read")}{" "}
                  <a href={userPolicy} target="_blank" rel="noreferrer">
                  {t("user_policy")}
                  </a>
                </label>
              </div>
            </div>
          </div>
          <div className={style.regButtonWrapper}>
            <button
              type="submit"
              disabled={!isPrivatePolicy || !isUserPolicy}
              className={cn("btn-reset", styleBtns.btnDark, style.btnSub)}
            >
              {t("signUp")}
            </button>
            <span className={style.infoWrapper}>
              <SvgIcon name="info" />
              <div className={style.info}>
                <p>
                  {t("signUp_text.part1")}
                </p>
                <p>
                {t("signUp_text.part2")}<b>{t("signUp_text.strong")}</b>
                </p>
              </div>
            </span>
          </div>
        </>
      ) : (
        <p className={style.title}>
          {t("reg_confirm.part1")} <span>{email}</span> {t("reg_confirm.part2")}
        </p>
      )}
      <button
        type={"button"}
        className={cn("btn-reset", style.btnAuth)}
        onClick={Login}
      >
        {t("signIn")}
      </button>
    </AuthForm>
  );
};
